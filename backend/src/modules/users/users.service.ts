import { Injectable, Logger, NotFoundException, InternalServerErrorException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios'; // Using axios directly
import { AuthService } from '../auth/auth.service'; // Importer AuthService
import { UserResponse, UsersResponse } from './interfaces';
import { UserFiltersDto } from './dto/user-filters.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Consider moving this to a configuration file/service
const ULTRA_API_MAINNET_ENDPOINT = 'https://ultra.api.eosnation.io';
const ULTRA_API_TESTNET_ENDPOINT = 'http://ultratest.api.eosnation.io';
const ULTRA_AVATAR_CONTRACT = 'ultra.avatar';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;
  
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    const apiUrl = this.configService.get<string>('UT_LAUNCHPAD_API_URL');
    const apiKey = this.configService.get<string>('UT_LAUNCHPAD_API_KEY');

    if (!apiUrl || !apiKey) {
      throw new Error('Missing required environment variables: UT_LAUNCHPAD_API_URL or UT_LAUNCHPAD_API_KEY');
    }

    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'X-Joomla-Token': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

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
        this.logger.log(`Avatar not set for account ${account}`);
        return { account, nft_id: '' };
      }
      return { ...row, nft_id: String(row.nft_id) };
    } catch (error) {
      this.logger.error(`Error in getAvatar for account ${account}: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error;
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

  // Ultra Times API

  async findAll(filters?: UserFiltersDto): Promise<UsersResponse> {
    try {
      let url = `${this.apiUrl}/api/index.php/v1/users`;
      const queryParams: string[] = [];

      if (filters) {
        if (filters.state !== undefined) {
          queryParams.push(`filter[state]=${filters.state}`);
        }
        if (filters.search) {
          queryParams.push(`filter[search]=${filters.search}`);
        }
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      this.logger.log(`GET ${url}`);
      const response = await axios.get<UsersResponse>(url, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching users:', error);
      throw new InternalServerErrorException('Failed to fetch users from Ultratimes API');
    }
  }

  async findOne(id: string): Promise<UserResponse> {
    try {
      const url = `${this.apiUrl}/api/index.php/v1/users/${id}`;
      this.logger.log(`GET ${url}`);
      const response = await axios.get<UserResponse>(url, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching user ${id}:`, error);
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw new InternalServerErrorException(`Failed to fetch user ${id} from Ultratimes API`);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    try {
      const url = `${this.apiUrl}/api/index.php/v1/users`;
      this.logger.log(`POST ${url}`);
      const response = await axios.post<UserResponse>(url, createUserDto, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      this.logger.error('Error creating user:', error);
      if (error.response && error.response.data) {
        throw new BadRequestException(error.response.data.message || 'Failed to create user');
      }
      throw new InternalServerErrorException('Failed to create user in Ultratimes API');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    try {
      const url = `${this.apiUrl}/api/index.php/v1/users/${id}`;
      this.logger.log(`PATCH ${url}`);
      const response = await axios.patch<UserResponse>(url, updateUserDto, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      this.logger.error(`Error updating user ${id}:`, error);
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      if (error.response && error.response.data) {
        throw new BadRequestException(error.response.data.message || `Failed to update user ${id}`);
      }
      throw new InternalServerErrorException(`Failed to update user ${id} in Ultratimes API`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const url = `${this.apiUrl}/api/index.php/v1/users/${id}`;
      this.logger.log(`DELETE ${url}`);
      await axios.delete(url, { headers: this.getHeaders() });
    } catch (error) {
      this.logger.error(`Error deleting user ${id}:`, error);
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw new InternalServerErrorException(`Failed to delete user ${id} from Ultratimes API`);
    }
  }

  async findByWalletId(walletId: string): Promise<UsersResponse> {
    try {
      const url = `${this.apiUrl}/api/index.php/v1/ultratimes/users?filter[search]=wid:${walletId}`;
      this.logger.log(`GET ${url}`);
      const response = await axios.get<UsersResponse>(url, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching users by wallet ID ${walletId}:`, error);
      throw new InternalServerErrorException('Failed to fetch users by wallet ID from Ultratimes API');
    }
  }
}