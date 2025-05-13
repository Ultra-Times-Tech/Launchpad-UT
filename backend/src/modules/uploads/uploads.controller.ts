import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, HttpException, HttpStatus, Redirect } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload une image vers le CDN' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image à uploader',
    type: FileUploadDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploadée avec succès',
    schema: {
      properties: {
        originalname: { type: 'string' },
        url: { type: 'string', description: 'URL du CDN' },
        size: { type: 'number' },
        mimetype: { type: 'string' },
      },
    },
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
  @ApiOperation({ summary: 'Obtenir une image depuis le CDN' })
  @ApiResponse({
    status: 302,
    description: 'Redirection vers l\'URL du CDN',
  })
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      // Construction de l'URL CDN
      const cdnUrl = `https://launchpad-ut-cdn.fra1.cdn.digitaloceanspaces.com/images/${filename}`;
      
      // Redirection vers l'URL du CDN
      return res.redirect(cdnUrl);
    } catch (error) {
      throw new HttpException('Fichier non trouvé', HttpStatus.NOT_FOUND);
    }
  }
} 