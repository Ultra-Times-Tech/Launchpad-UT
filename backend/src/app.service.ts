import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getNFTs() {
    return [
      {
        id: 1,
        name: 'Cosmic Explorer #1',
        description: 'A rare cosmic explorer NFT from the future',
        price: '0.5 ETH',
        image: 'https://picsum.photos/400/400?random=1',
        artist: 'CryptoArtist_01',
        supply: 100,
        minted: 45,
      },
      {
        id: 2,
        name: 'Digital Dreams #24',
        description: 'Enter the world of digital dreams',
        price: '0.8 ETH',
        image: 'https://picsum.photos/400/400?random=2',
        artist: 'DigitalDreamer',
        supply: 50,
        minted: 23,
      },
      {
        id: 3,
        name: 'Neon Nights #7',
        description: 'Cyberpunk-inspired digital collectible',
        price: '1.2 ETH',
        image: 'https://picsum.photos/400/400?random=3',
        artist: 'NeonMaster',
        supply: 75,
        minted: 62,
      },
    ];
  }
}
