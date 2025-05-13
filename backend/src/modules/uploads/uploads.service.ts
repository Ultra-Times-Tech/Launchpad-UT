import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { S3Service } from './s3.service';

@Injectable()
export class UploadsService {
  constructor(private readonly s3Service: S3Service) {}

  async saveFile(file: any) {
    if (!file) {
      throw new Error('Aucun fichier fourni');
    }

    // Upload le fichier vers DigitalOcean Spaces
    const fileUrl = await this.s3Service.uploadFile(file, 'images');

    const response = {
      filename: file.filename,
      originalname: file.originalname,
      url: fileUrl,
      size: file.size,
      mimetype: file.mimetype,
    };

    return response;
  }

  async getFile(filename: string) {
    const filePath = join(process.cwd(), 'uploads', filename);
    
    if (!existsSync(filePath)) {
      throw new NotFoundException('Fichier non trouvé');
    }
    
    return filePath;
  }
} 