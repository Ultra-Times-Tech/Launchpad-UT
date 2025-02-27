import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { NftService } from './nft.service';
import { NFTEntity } from './nft.entity';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get()
  findAll(): Promise<NFTEntity[]> {
    return this.nftService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<NFTEntity | null> {
    return this.nftService.findOne(Number(id));
  }

  @Post()
  create(@Body() nftData: Partial<NFTEntity>): Promise<NFTEntity> {
    return this.nftService.create(nftData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() nftData: Partial<NFTEntity>): Promise<NFTEntity | null> {
    return this.nftService.update(Number(id), nftData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.nftService.delete(Number(id));
  }
}