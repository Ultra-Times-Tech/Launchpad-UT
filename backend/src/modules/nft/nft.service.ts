import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {NFT} from './nft.entity'

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(NFT)
    private nftRepository: Repository<NFT>
  ) {}

  async onModuleInit() {
    await this.seed()
  }

  findAll(): Promise<NFT[]> {
    return this.nftRepository.find()
  }

  findOne(id: number): Promise<NFT | null> {
    return this.nftRepository.findOneBy({id})
  }

  create(nftData: Partial<NFT>): Promise<NFT> {
    const nft = this.nftRepository.create(nftData)
    return this.nftRepository.save(nft)
  }

  async update(id: number, nftData: Partial<NFT>): Promise<NFT | null> {
    await this.nftRepository.update(id, nftData)
    return this.findOne(id)
  }

  async delete(id: number): Promise<void> {
    await this.nftRepository.delete(id)
  }

  async seed() {
    const count = await this.nftRepository.count()
    if (count === 0) {
      const fakeNFTs = [
        {
          name: 'Cosmic Explorer #1',
          description: 'A rare cosmic explorer NFT from the future',
          price: '0.5 ETH',
          image: 'https://picsum.photos/400/400?random=1',
          artist: 'CryptoArtist_01',
          supply: 100,
          minted: 45,
        },
        {
          name: 'Digital Dreams #24',
          description: 'Enter the world of digital dreams',
          price: '0.8 ETH',
          image: 'https://picsum.photos/400/400?random=2',
          artist: 'DigitalDreamer',
          supply: 50,
          minted: 23,
        },
        {
          name: 'Neon Nights #7',
          description: 'Cyberpunk-inspired digital collectible',
          price: '1.2 ETH',
          image: 'https://picsum.photos/400/400?random=3',
          artist: 'NeonMaster',
          supply: 75,
          minted: 62,
        },
      ]

      await this.nftRepository.save(fakeNFTs)
      console.log('Fake NFTs inserted')
    }
  }
}
