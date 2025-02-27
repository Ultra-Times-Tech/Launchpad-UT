import { DataSource } from 'typeorm';
import { NFTEntity } from './modules/nft/nft.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [NFTEntity],
  synchronize: true,
  logging: false,
});

export default AppDataSource;