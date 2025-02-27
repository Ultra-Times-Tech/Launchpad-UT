import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { NftService } from './nft.service';
import { NFT } from './nft.entity';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get()
  findAll(): Promise<NFT[]> {
    return this.nftService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<NFT | null> {
    return this.nftService.findOne(Number(id));
  }

  @Post()
  create(@Body() nftData: Partial<NFT>): Promise<NFT> {
    return this.nftService.create(nftData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() nftData: Partial<NFT>): Promise<NFT | null> {
    return this.nftService.update(Number(id), nftData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.nftService.delete(Number(id));
  }
}