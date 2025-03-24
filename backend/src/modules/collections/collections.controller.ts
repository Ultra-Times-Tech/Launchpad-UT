import { Controller, Get, Logger } from '@nestjs/common';
import { CollectionsService } from './collections.service';

@Controller('collections')
export class CollectionsController {
  private readonly logger = new Logger(CollectionsController.name);

  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  async getCollections() {
    this.logger.log('Requête GET /collections reçue');
    try {
      const collections = await this.collectionsService.getCollections();
      this.logger.log('Collections récupérées avec succès');
      return collections;
    } catch (error) {
      this.logger.error('Erreur dans le contrôleur:', error);
      throw error;
    }
  }
} 