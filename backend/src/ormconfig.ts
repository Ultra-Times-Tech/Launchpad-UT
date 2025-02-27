import {DataSource} from 'typeorm'
import {NFTEntity} from './modules/nft/nft.entity'
import * as path from 'path'

// Determine if we're in production (Vercel) or development
const isProd = process.env.NODE_ENV === 'production'

// For Vercel, we'll use the /tmp directory which is writable in serverless functions
const dbPath = isProd ? path.join('/tmp', 'database.sqlite') : ':memory:'

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbPath,
  entities: [NFTEntity],
  synchronize: true,
  logging: false,
})

export default AppDataSource
