import { Controller, Get, Put, Param, Body, UsePipes, ValidationPipe, NotFoundException, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get(':account/username')
  @ApiOperation({ summary: "Get a user's username" })
  @ApiParam({ name: 'account', description: 'The Ultra blockchain account name', type: String })
  @ApiResponse({ status: 200, description: 'Username found.', type: Object })
  @ApiResponse({ status: 404, description: 'Username not found.' })
  async getUsername(@Param('account') account: string) {
    this.logger.log(`GET /users/${account}/username`);
    const result = await this.usersService.getUsername(account);
    if (!result) {
      throw new NotFoundException(`Username not found for account ${account}`);
    }
    return result;
  }

  @Get(':account/avatar')
  @ApiOperation({ summary: "Get a user's avatar NFT ID" })
  @ApiParam({ name: 'account', description: 'The Ultra blockchain account name', type: String })
  @ApiResponse({ status: 200, description: 'Avatar found or null if not set.', type: Object }) // Define a specific type later if needed
  async getAvatar(@Param('account') account: string) {
    this.logger.log(`GET /users/${account}/avatar`);
    const result = await this.usersService.getAvatar(account);
    // It's okay if result is null (avatar not set)
    return result ?? { message: `Avatar not set for account ${account}` }; // Returns { account: string, nft_id: string } or message
  }

  @Put(':account/username')
  @ApiOperation({ summary: "Update a user's username (requires blockchain interaction - Placeholder)" })
  @ApiParam({ name: 'account', description: 'The Ultra blockchain account name', type: String })
  @ApiBody({ type: UpdateUsernameDto })
  @ApiResponse({ status: 200, description: 'Username update process initiated (placeholder).' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateUsername(@Param('account') account: string, @Body() updateUsernameDto: UpdateUsernameDto) {
     this.logger.log(`PUT /users/${account}/username`);
     // TODO: Add authentication/authorization check here
     // Make sure the authenticated user is allowed to update this account's username
     await this.usersService.updateUsername(account, updateUsernameDto.username);
     return { message: 'Username update initiated successfully (placeholder).' };
  }

  @Put(':account/avatar')
  @ApiOperation({ summary: "Update a user's avatar NFT ID (requires blockchain interaction - Placeholder)" })
  @ApiParam({ name: 'account', description: 'The Ultra blockchain account name', type: String })
  @ApiBody({ type: UpdateAvatarDto })
  @ApiResponse({ status: 200, description: 'Avatar update process initiated (placeholder).' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateAvatar(@Param('account') account: string, @Body() updateAvatarDto: UpdateAvatarDto) {
    this.logger.log(`PUT /users/${account}/avatar`);
    // TODO: Add authentication/authorization check here
    // Make sure the authenticated user is allowed to update this account's avatar
    await this.usersService.updateAvatar(account, updateAvatarDto.nftId);
    return { message: 'Avatar update initiated successfully (placeholder).' };
  }
}