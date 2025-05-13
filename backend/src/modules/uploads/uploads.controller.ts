import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload une image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image à uploader',
    type: FileUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new HttpException('Aucun fichier trouvé', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.uploadsService.saveFile(file);
      return result;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du fichier:', error);
      throw new HttpException(
        `Erreur lors de l'upload: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', filename);
    
    if (!existsSync(filePath)) {
      throw new HttpException('Fichier non trouvé', HttpStatus.NOT_FOUND);
    }
    
    return res.sendFile(filePath);
  }
} 