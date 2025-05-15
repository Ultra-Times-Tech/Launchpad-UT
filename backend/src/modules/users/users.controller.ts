import {Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, UsePipes, ValidationPipe, NotFoundException, Logger, InternalServerErrorException, HttpCode, HttpStatus, UseGuards} from '@nestjs/common'
import {UsersService} from './users.service'
import {UpdateUsernameDto} from './dto/update-username.dto'
import {CreateUserDto} from './dto/create-user.dto'
import {UpdateUserDto} from './dto/update-user.dto'
import {UserFiltersDto} from './dto/user-filters.dto'
import {ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody, ApiQuery} from '@nestjs/swagger'
import {UserResponse, UsersResponse} from './interfaces'

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private readonly usersService: UsersService) {}

  @Get(':account/username')
  @ApiOperation({summary: "Get a user's username"})
  @ApiParam({name: 'account', description: 'The Ultra blockchain account name', type: String})
  @ApiResponse({status: 200, description: 'Username found or empty if not set.', type: Object})
  async getUsername(@Param('account') account: string) {
    try {
      const result = await this.usersService.getUsername(account)
      return result || {account, username: ''}
    } catch (error) {
      this.logger.error(`Error in getUsername controller for ${account}: ${error.message}`)
      return {account, username: ''}
    }
  }

  @Get(':account/avatar')
  @ApiOperation({summary: "Get a user's avatar UNIQ ID"})
  @ApiParam({name: 'account', description: 'The Ultra blockchain account name', type: String})
  @ApiResponse({status: 200, description: 'Avatar found or empty if not set.', type: Object})
  async getAvatar(@Param('account') account: string) {
    try {
      const result = await this.usersService.getAvatar(account)
      return result || {account, nft_id: ''}
    } catch (error) {
      this.logger.error(`Error in getAvatar controller for ${account}: ${error.message}`)
      return {account, nft_id: ''}
    }
  }

  // Ultra Times API

  @Get()
  @ApiOperation({summary: 'Get all users from Ultratimes'})
  @ApiQuery({name: 'state', required: false, description: 'Filter by block state (0: unblocked, 1: blocked)'})
  @ApiQuery({name: 'search', required: false, description: 'Search in name, username or email'})
  @ApiResponse({status: 200, description: 'List of users found'})
  async findAll(@Query() filters: UserFiltersDto): Promise<UsersResponse> {
    return this.usersService.findAll(filters)
  }

  @Get('wallets/:walletId')
  @ApiOperation({summary: 'Get users by wallet ID'})
  @ApiParam({name: 'walletId', description: 'The wallet ID (complete or partial)'})
  @ApiResponse({status: 200, description: 'List of users with matching wallet'})
  async findByWalletId(@Param('walletId') walletId: string): Promise<UsersResponse> {
    return this.usersService.findByWalletId(walletId)
  }

  @Get(':id')
  @ApiOperation({summary: 'Get a user by ID'})
  @ApiParam({name: 'id', description: 'The internal user ID'})
  @ApiResponse({status: 200, description: 'User found'})
  @ApiResponse({status: 404, description: 'User not found'})
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    return this.usersService.findOne(id)
  }

  @Post()
  @ApiOperation({summary: 'Create a new user'})
  @ApiBody({type: CreateUserDto})
  @ApiResponse({status: 200, description: 'User created successfully'})
  @ApiResponse({status: 400, description: 'Invalid input data'})
  @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.usersService.create(createUserDto)
  }

  @Patch(':id')
  @ApiOperation({summary: 'Update a user'})
  @ApiParam({name: 'id', description: 'The internal user ID'})
  @ApiBody({type: UpdateUserDto})
  @ApiResponse({status: 200, description: 'User updated successfully'})
  @ApiResponse({status: 400, description: 'Invalid input data'})
  @ApiResponse({status: 404, description: 'User not found'})
  @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponse> {
    return this.usersService.update(id, updateUserDto)
  }

  @Delete(':id')
  @ApiOperation({summary: 'Delete a user'})
  @ApiParam({name: 'id', description: 'The internal user ID'})
  @ApiResponse({status: 204, description: 'User deleted successfully'})
  @ApiResponse({status: 404, description: 'User not found'})
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id)
  }
}