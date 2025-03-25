import {Injectable, Logger} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import axios from 'axios'
import {CollectionsResponse} from './interfaces/collection-response.interface'
import {CreateCollectionDto} from './dto/create-collection.dto'
import {UpdateCollectionDto} from './dto/update-collection.dto'
import {CollectionFiltersDto} from './dto/collection-filters.dto'

@Injectable()
export class CollectionsService {
  private readonly logger = new Logger(CollectionsService.name)
  private readonly apiUrl: string
  private readonly apiKey: string

  constructor(private configService: ConfigService) {
    const apiUrl = this.configService.get<string>('UT_LAUNCHPAD_API_URL')
    const apiKey = this.configService.get<string>('UT_LAUNCHPAD_API_KEY')

    if (!apiUrl || !apiKey) {
      throw new Error('Missing required environment variables: UT_LAUNCHPAD_API_URL or UT_LAUNCHPAD_API_KEY')
    }

    this.apiUrl = apiUrl
    this.apiKey = apiKey
  }

  private getHeaders() {
    return {
      'X-Joomla-Token': this.apiKey,
      'Content-Type': 'application/json',
    }
  }

  async findAll(filters?: CollectionFiltersDto): Promise<CollectionsResponse> {
    try {
      let url = `${this.apiUrl}/api/index.php/v1/ultratimes/collections`
      const queryParams: string[] = []

      if (filters) {
        if (filters.published !== undefined) {
          queryParams.push(`filter[published]=${filters.published}`)
        }
        if (filters.search) {
          queryParams.push(`filter[search]=${filters.search}`)
        }
        if (filters.ordering) {
          queryParams.push(`list[ordering]=${filters.ordering}`)
        }
        if (filters.direction) {
          queryParams.push(`list[direction]=${filters.direction}`)
        }
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`
      }

      const response = await axios.get<CollectionsResponse>(url, {headers: this.getHeaders()})
      return response.data
    } catch (error) {
      this.logger.error('Error fetching collections:', error)
      throw error
    }
  }

  async findOne(id: string): Promise<CollectionsResponse> {
    try {
      const response = await axios.get<CollectionsResponse>(
        `${this.apiUrl}/api/index.php/v1/ultratimes/collections/${id}`,
        {headers: this.getHeaders()}
      )
      return response.data
    } catch (error) {
      this.logger.error(`Error fetching collection ${id}:`, error)
      throw error
    }
  }

  async create(createCollectionDto: CreateCollectionDto): Promise<void> {
    try {
      await axios.post(
        `${this.apiUrl}/api/index.php/v1/ultratimes/collections`,
        createCollectionDto,
        {headers: this.getHeaders()}
      )
    } catch (error) {
      this.logger.error('Error creating collection:', error)
      throw error
    }
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto): Promise<void> {
    try {
      await axios.patch(
        `${this.apiUrl}/api/index.php/v1/ultratimes/collections/${id}`,
        updateCollectionDto,
        {headers: this.getHeaders()}
      )
    } catch (error) {
      this.logger.error(`Error updating collection ${id}:`, error)
      throw error
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await axios.delete(
        `${this.apiUrl}/api/index.php/v1/ultratimes/collections/${id}`,
        {headers: this.getHeaders()}
      )
    } catch (error) {
      this.logger.error(`Error deleting collection ${id}:`, error)
      throw error
    }
  }
}