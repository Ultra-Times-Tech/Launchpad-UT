import {Injectable, Logger} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import axios from 'axios'

@Injectable()
export class CollectionsService {
  private readonly logger = new Logger(CollectionsService.name);

  constructor(private configService: ConfigService) {}

  async getCollections() {
    this.logger.log('Début de la récupération des collections');
    const apiUrl = this.configService.get<string>('UT_LAUNCHPAD_API_URL')
    const apiKey = this.configService.get<string>('UT_LAUNCHPAD_API_KEY')

    this.logger.debug(`URL de l'API: ${apiUrl}`);
    this.logger.debug('Clé API présente: ' + (!!apiKey));

    try {
      this.logger.log('Envoi de la requête à l\'API');
      const response = await axios.get(`${apiUrl}/api/index.php/v1/ultratimes/collections`, {
        headers: {
          'X-Joomla-Token': `${apiKey}`,
        },
      })

      this.logger.log(`Réponse reçue avec succès. Nombre de collections: ${response.data?.data?.length || 0}`);
      return response.data
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des collections:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          headers: error.config?.headers
        }
      });
      throw new Error(`Erreur lors de la récupération des collections: ${error.message}`)
    }
  }
}