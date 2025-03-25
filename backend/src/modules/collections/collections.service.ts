import {Injectable, Logger} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import axios from 'axios'

@Injectable()
export class CollectionsService {
  constructor(private configService: ConfigService) {}

  async findAll() {
    const apiUrl = this.configService.get<string>('UT_LAUNCHPAD_API_URL')
    const apiKey = this.configService.get<string>('UT_LAUNCHPAD_API_KEY')

    try {
      const response = await axios.get(`${apiUrl}/api/index.php/v1/ultratimes/collections`, {
        headers: {
          'X-Joomla-Token': `${apiKey}`,
        },
      })

      if (!response.data?.data || !Array.isArray(response.data.data)) {
        throw new Error("Format de réponse invalide de l'API")
      }

      return response.data
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des collections: ${error.message}`)
    }
  }
}
