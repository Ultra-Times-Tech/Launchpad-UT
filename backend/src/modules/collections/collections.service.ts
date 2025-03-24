import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import axios from 'axios'

@Injectable()
export class CollectionsService {
  constructor(private configService: ConfigService) {}

  async getCollections() {
    const apiUrl = this.configService.get<string>('UT_LAUNCHPAD_API_URL')
    const apiKey = this.configService.get<string>('UT_LAUNCHPAD_API_KEY')

    try {
      const response = await axios.get(`${apiUrl}/api/index.php/v1/ultratimes/collections`, {
        headers: {
          'X-Joomla-Token': `${apiKey}`,
        },
      })

      return response.data
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des collections: ${error.message}`)
    }
  }
}