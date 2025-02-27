import { DataSource } from 'typeorm';
import { NFT } from './modules/nft/nft.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [NFT],
  synchronize: true,
  logging: false,
});

export default AppDataSource;