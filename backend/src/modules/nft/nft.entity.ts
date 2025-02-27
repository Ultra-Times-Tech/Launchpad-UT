import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class NFT {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: string;

  @Column()
  image: string;

  @Column()
  artist: string;

  @Column()
  supply: number;

  @Column()
  minted: number;
}