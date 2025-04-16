import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios'; // Using axios directly
import { AuthService } from '../auth/auth.service'; // Importer AuthService

// Consider moving this to a configuration file/service
const ULTRA_API_ENDPOINT = 'http://ultra.api.eosnation.io';
const ULTRA_AVATAR_CONTRACT = 'ultra.avatar';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  
  constructor(private readonly authService: AuthService) {} // Injecter AuthService

  private async getTableRow<T>(table: string, account: string): Promise<T | null> {
    try {
      const response = await axios.post(`${ULTRA_API_ENDPOINT}/v1/chain/get_table_rows`, {
        json: true,
        code: ULTRA_AVATAR_CONTRACT,
        scope: ULTRA_AVATAR_CONTRACT,
        table: table,
        lower_bound: account,
        upper_bound: account,
      });

      if (response.data && response.data.rows && response.data.rows.length > 0) {
        // Check if the returned row actually matches the requested account
        // (lower_bound/upper_bound might return the next key if exact match not found)
        const row = response.data.rows[0];
        // Assuming the first field in the struct is always the account name (key)
        const keyField = Object.keys(row)[0];
        if (row[keyField] === account) {
          return row as T;
        }
      }
      return null;
    } catch (error) {
      this.logger.error(`Error fetching table ${table} for account ${account}: ${error.message}`, error.stack);
      // Rethrow or handle specific errors (e.g., network issues, API errors)
      throw new InternalServerErrorException(`Failed to fetch data from Ultra API for table ${table}`);
    }
  }

  async getUsername(account: string): Promise<{ account: string; username: string } | null> {
    this.logger.log(`Fetching username for account: ${account}`);
    const row = await this.getTableRow<{ account: string; username: string }>('accusername', account);
    if (!row) {
       throw new NotFoundException(`Username not found for account ${account}`);
    }
    return row;
  }

  async getAvatar(account: string): Promise<{ account: string; nft_id: string } | null> { // Assuming nft_id is string due to uint64_t
    this.logger.log(`Fetching avatar for account: ${account}`);
    const row = await this.getTableRow<{ account: string; nft_id: string }>('accavatar', account);
     if (!row) {
       // It's okay if avatar is not set, return null instead of throwing error
       this.logger.log(`Avatar not set for account ${account}`);
       return null;
    }
     // Ultra API returns uint64_t as number sometimes, ensure it's string
    return { ...row, nft_id: String(row.nft_id) };
  }

  async updateUsername(account: string, username: string): Promise<void> {
    this.logger.log(`Attempting to update username for ${account} to ${username}`);

    try {
      const tokenResponse = await this.authService.getUltraToken();
      const accessToken = tokenResponse.access_token;

      const response = await axios.post(`${ULTRA_API_ENDPOINT}/v1/chain/push_transaction`, {
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