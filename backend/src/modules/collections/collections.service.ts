import {Injectable, Logger} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import axios from 'axios'
import {CollectionsResponse} from './interfaces/collection-response.interface'
import {Collection} from './interfaces/collection.interface'
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

  private transformCollectionResponse(data: any): Collection[] | Collection {
    if (Array.isArray(data)) {
      return data.map(item => this.transformCollectionItem(item))
    } else {
      return this.transformCollectionItem(data)
    }
  }

  private transformCollectionItem(item: any): Collection {
    const transformed = {
      type: 'collections',
      id: String(item.attributes?.id || item.id),
      attributes: {
        id: Number(item.attributes?.id || item.id),
        name: item.attributes?.name || item.name || `Collection #${item.attributes?.id || item.id}`,
        state: item.attributes?.state !== undefined ? Number(item.attributes?.state) : item.state !== undefined ? Number(item.state) : 0,
        publish_up: item.attributes?.publish_up || item.publish_up || null,
        publish_down: item.attributes?.publish_down || item.publish_down || null,
        created: item.attributes?.created || item.created || null,
        created_by: Number(item.attributes?.created_by || item.created_by || 0),
        modified: item.attributes?.modified || item.modified || new Date().toISOString(),
        image: item.attributes?.image || item.image ? `/images/collections/${item.attributes?.id || item.id}/${item.attributes?.image || item.image}` : null,
        is_trending: Boolean(Number(item.attributes?.is_trending || item.is_trending || 0)),
        is_featured: Boolean(Number(item.attributes?.is_featured || item.is_featured || 0)),
        ordering: item.attributes?.ordering !== undefined ? Number(item.attributes?.ordering) : item.ordering !== undefined ? Number(item.ordering) : null,
      },
    }

    return transformed
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

      const response = await axios.get(url, {headers: this.getHeaders()})

      const transformedData = this.transformCollectionResponse(response.data.data)

      return {
        links: response.data.links,
        data: transformedData,
        meta: response.data.meta,
      }
    } catch (error) {
      this.logger.error('Error fetching collections:', error)
      throw error
    }
  }

  async findOne(id: string): Promise<CollectionsResponse> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/index.php/v1/ultratimes/collections/${id}`, {headers: this.getHeaders()})

      const transformedData = this.transformCollectionItem(response.data.data)

      return {
        links: response.data.links,
        data: transformedData,
      }
    } catch (error) {
      this.logger.error(`Error fetching collection ${id}:`, error)
      throw error
    }
  }

  async create(createCollectionDto: CreateCollectionDto): Promise<void> {
    try {
      const payload = {
        name: createCollectionDto.name,
        alias: createCollectionDto.alias,
        state: createCollectionDto.state,
        image: createCollectionDto.image,
        is_trending: createCollectionDto.is_trending,
        is_featured: createCollectionDto.is_featured,
        ordering: createCollectionDto.ordering,
      }

      await axios.post(`${this.apiUrl}/api/index.php/v1/ultratimes/collections`, payload, {headers: this.getHeaders()})
    } catch (error) {
      this.logger.error('Error creating collection:', error)
      throw error
    }
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto): Promise<void> {
    try {
      const payload = {
        ...(updateCollectionDto.name && {name: updateCollectionDto.name}),
        ...(updateCollectionDto.alias && {alias: updateCollectionDto.alias}),
        ...(updateCollectionDto.state && {state: updateCollectionDto.state}),
        ...(updateCollectionDto.image !== undefined && {image: updateCollectionDto.image}),
        ...(updateCollectionDto.is_trending !== undefined && {is_trending: updateCollectionDto.is_trending}),
        ...(updateCollectionDto.is_featured !== undefined && {is_featured: updateCollectionDto.is_featured}),
        ...(updateCollectionDto.ordering !== undefined && {ordering: updateCollectionDto.ordering}),
      }

      await axios.patch(`${this.apiUrl}/api/index.php/v1/ultratimes/collections/${id}`, payload, {headers: this.getHeaders()})
    } catch (error) {
      this.logger.error(`Error updating collection ${id}:`, error)
      throw error
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/api/index.php/v1/ultratimes/collections/${id}`, {headers: this.getHeaders()})
    } catch (error) {
      this.logger.error(`Error deleting collection ${id}:`, error)
      throw error
    }
  }
}
