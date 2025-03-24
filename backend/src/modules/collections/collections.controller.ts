import { Controller, Get } from '@nestjs/common';
import { CollectionsService } from './collections.service';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  async getCollections() {
    return this.collectionsService.getCollections();
  }
} 