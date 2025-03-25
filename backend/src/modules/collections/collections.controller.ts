import {Controller, Get, Logger} from '@nestjs/common'
import {CollectionsService} from './collections.service'
import {CollectionsEntity} from './collections.entity'

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  findAll(): Promise<CollectionsEntity[]> {
    return this.collectionsService.findAll()
  }
}