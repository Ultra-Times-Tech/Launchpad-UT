import {Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus} from '@nestjs/common'
import {ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger'
// Services
import {CollectionsService} from './collections.service'
// Interfaces
import {CollectionsResponse} from './interfaces/collection-response.interface'
// DTOs
import {CreateCollectionDto} from './dto/create-collection.dto'
import {UpdateCollectionDto} from './dto/update-collection.dto'
import {CollectionFiltersDto} from './dto/collection-filters.dto'

@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  findAll(@Query() filters: CollectionFiltersDto): Promise<CollectionsResponse> {
    return this.collectionsService.findAll(filters)
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CollectionsResponse> {
    return this.collectionsService.findOne(id)
  }

  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto): Promise<void> {
    return this.collectionsService.create(createCollectionDto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto): Promise<void> {
    return this.collectionsService.update(id, updateCollectionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.collectionsService.remove(id)
  }
}