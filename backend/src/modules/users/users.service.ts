import { Injectable, Logger, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import axios from 'axios'; // Using axios directly
import { AuthService } from '../auth/auth.service'; // Importer AuthService

// Consider moving this to a configuration file/service
const ULTRA_API_MAINNET_ENDPOINT = 'https://ultra.api.eosnation.io';
const ULTRA_API_TESTNET_ENDPOINT = 'http://ultratest.api.eosnation.io';
const ULTRA_AVATAR_CONTRACT = 'ultra.avatar';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  
  constructor(private readonly authService: AuthService) {} // Injecter AuthService

  private async getTableRow<T>(table: string, account: string): Promise<T | null> {
    if (!account) {
      this.logger.error(`Invalid account parameter: ${account}`);
      throw new BadRequestException('Account ID must be provided');
    }
    
    try {
      this.logger.debug(`Making request to ${ULTRA_API_TESTNET_ENDPOINT}/v1/chain/get_table_rows for table ${table}, account ${account}`);
      const response = await axios.post(`${ULTRA_API_TESTNET_ENDPOINT}/v1/chain/get_table_rows`, {
        json: true,
        code: ULTRA_AVATAR_CONTRACT,
        scope: ULTRA_AVATAR_CONTRACT,
        table: table,
        lower_bound: account,
        upper_bound: account,
      });

      this.logger.debug(`Response for table ${table}: ${JSON.stringify(response.data)}`);

      if (response.data && response.data.rows && response.data.rows.length > 0) {
        // Check if the returned row actually matches the requested account
        // (lower_bound/upper_bound might return the next key if exact match not found)
        const row = response.data.rows[0];
        // Assuming the first field in the struct is always the account name (key)
        const keyField = Object.keys(row)[0];
        if (row[keyField] === account) {
          this.logger.debug(`Found matching row for account ${account} in table ${table}`);
          return row as T;
        }
        this.logger.debug(`Row found but key ${row[keyField]} doesn't match account ${account}`);
      } else {
        this.logger.debug(`No rows found for account ${account} in table ${table}`);
      }
      return null;
    } catch (error) {
      this.logger.error(`Error fetching table ${table} for account ${account}: ${error.message}`, error.stack);
      if (error.response) {
        this.logger.error(`Response status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
      }
      // Rethrow or handle specific errors (e.g., network issues, API errors)
      throw new InternalServerErrorException(`Failed to fetch data from Ultra API for table ${table}`);
    }
  }

  async getUsername(account: string): Promise<{ account: string; username: string } | null> {
    this.logger.log(`Fetching username for account: ${account}`);
    
    if (!account) {
      this.logger.error('Account ID is required');
      throw new BadRequestException('Account ID must be provided');
    }
    
    try {
      const row = await this.getTableRow<{ account: string; username: string }>('accusername', account);
      if (!row) {
        this.logger.log(`Username not found for account ${account}`);
        return { account, username: '' }; // Return empty username instead of throwing 404
      }
      return row;
    } catch (error) {
      this.logger.error(`Error in getUsername for account ${account}: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error; // Re-throw validation errors
      }
      throw new InternalServerErrorException(`Failed to fetch username for account ${account}`);
    }
  }

  async getAvatar(account: string): Promise<{ account: string; nft_id: string } | null> {
    this.logger.log(`Fetching avatar for account: ${account}`);
    
    if (!account) {
      this.logger.error('Account ID is required');
      throw new BadRequestException('Account ID must be provided');
    }
    
    try {
      const row = await this.getTableRow<{ account: string; nft_id: string }>('accavatar', account);
      if (!row) {
        // It's okay if avatar is not set, return null instead of throwing error
        this.logger.log(`Avatar not set for account ${account}`);
        return { account, nft_id: '' }; // Return empty nft_id instead of null
      }
      // Ultra API returns uint64_t as number sometimes, ensure it's string
      return { ...row, nft_id: String(row.nft_id) };
    } catch (error) {
      this.logger.error(`Error in getAvatar for account ${account}: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error; // Re-throw validation errors
      }
      throw new InternalServerErrorException(`Failed to fetch avatar for account ${account}`);
    }
  }

  async updateUsername(account: string, username: string): Promise<void> {
    this.logger.log(`Attempting to update username for ${account} to ${username}`);

    try {
      const tokenResponse = await this.authService.getUltraToken();
      const accessToken = tokenResponse.access_token;

      const response = await axios.post(`${ULTRA_API_TESTNET_ENDPOINT}/v1/chain/push_transaction`, {
        actions: [{
          account: ULTRA_AVATAR_CONTRACT,
          name: 'updatename',
          authorization: [{ actor: account, permission: 'active' }],
          data: {
            account: account,
            username: username,
          },
        }],
        blocksBehind: 3,
        expireSeconds: 30,
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      this.logger.log(`Username updated successfully for ${account}: ${response.data}`);
    } catch (error) {
      this.logger.error(`Error updating username for ${account}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Failed to update username for ${account}`);
    }
  }

  async updateAvatar(account: string, nftId: string): Promise<void> {
    this.logger.log(`Attempting to update avatar for ${account} to NFT ID ${nftId}`);
    // TODO: Implement blockchain transaction logic
    // Similar to updateUsername: Identify action name (e.g., 'setavatar'), params, signing.
    // Ensure nftId is handled correctly (string vs number for uint64_t).
    // Example placeholder:
    // const transaction = {
    //   actions: [{
    //     account: ULTRA_AVATAR_CONTRACT,
    //     name: 'ACTION_NAME_HERE', // e.g., 'setavatar'
    //     authorization: [{ actor: account, permission: 'active' }],
    //     data: {
    //       account: account,
    //       nft_id: nftId, // Ensure correct type/format for uint64_t
    //     },
    //   }],
    // };
    // Need to sign and broadcast this transaction.
     console.warn(`[TODO] Blockchain interaction for updating avatar for ${account} not implemented.`);
    // Simulate success for now
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async operation
  }
}