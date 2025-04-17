import { Controller, Get, Put, Param, Body, UsePipes, ValidationPipe, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
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
  @ApiResponse({ status: 200, description: 'Username found or empty if not set.', type: Object })
  async getUsername(@Param('account') account: string) {
    this.logger.log(`GET /users/${account}/username`);
    try {
      const result = await this.usersService.getUsername(account);
      return result || { account, username: '' }; // Toujours retourner un objet, même si vide
    } catch (error) {
      this.logger.error(`Error in getUsername controller for ${account}: ${error.message}`);
      // Retourner un objet vide au lieu de relancer l'erreur
      return { account, username: '' };
    }
  }

  @Get(':account/avatar')
  @ApiOperation({ summary: "Get a user's avatar NFT ID" })
  @ApiParam({ name: 'account', description: 'The Ultra blockchain account name', type: String })
  @ApiResponse({ status: 200, description: 'Avatar found or empty if not set.', type: Object })
  async getAvatar(@Param('account') account: string) {
    this.logger.log(`GET /users/${account}/avatar`);
    try {
      const result = await this.usersService.getAvatar(account);
      return result || { account, nft_id: '' }; // Toujours retourner un objet, même si nft_id est vide
    } catch (error) {
      this.logger.error(`Error in getAvatar controller for ${account}: ${error.message}`);
      // Retourner un objet vide au lieu de relancer l'erreur
      return { account, nft_id: '' };
    }
  }

  @Put(':account/username')
  @ApiOperation({ summary: "Update a user's username (requires blockchain interaction - Placeholder)" })
  @ApiParam({ name: 'account', description: 'The Ultra blockchain account name', type: String })
  @ApiBody({ type: UpdateUsernameDto })
  @ApiResponse({ status: 200, description: 'Username update process initiated (placeholder).' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateUsername(@Param('account') account: string, @Body() updateUsernameDto: UpdateUsernameDto) {
    this.logger.log(`PUT /users/${account}/username with username: ${updateUsernameDto.username}`);
    // TODO: Add authentication/authorization check here
    // Make sure the authenticated user is allowed to update this account's username
    try {
      await this.usersService.updateUsername(account, updateUsernameDto.username);
      return { 
        message: 'Username update initiated successfully.', 
        account, 
        username: updateUsernameDto.username 
      };
    } catch (error) {
      this.logger.error(`Error updating username for ${account}: ${error.message}`);
      throw new InternalServerErrorException(`Failed to update username for ${account}`);
    }
  }

  @Put(':account/avatar')
  @ApiOperation({ summary: "Update a user's avatar NFT ID (requires blockchain interaction - Placeholder)" })
  @ApiParam({ name: 'account', description: 'The Ultra blockchain account name', type: String })
  @ApiBody({ type: UpdateAvatarDto })
  @ApiResponse({ status: 200, description: 'Avatar update process initiated (placeholder).' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateAvatar(@Param('account') account: string, @Body() updateAvatarDto: UpdateAvatarDto) {
    this.logger.log(`PUT /users/${account}/avatar with nftId: ${updateAvatarDto.nftId}`);
    // TODO: Add authentication/authorization check here
    // Make sure the authenticated user is allowed to update this account's avatar
    try {
      await this.usersService.updateAvatar(account, updateAvatarDto.nftId);
      return { 
        message: 'Avatar update initiated successfully.', 
        account, 
        nft_id: updateAvatarDto.nftId 
      };
    } catch (error) {
      this.logger.error(`Error updating avatar for ${account}: ${error.message}`);
      throw new InternalServerErrorException(`Failed to update avatar for ${account}`);
    }
  }
}