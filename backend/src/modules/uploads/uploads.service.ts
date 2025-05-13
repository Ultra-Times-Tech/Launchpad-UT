import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadsService {
  async saveFile(file: any) {
    if (!file) {
      throw new Error('Aucun fichier fourni');
    }

    const response = {
      filename: file.filename,
      originalname: file.originalname,
      path: `uploads/${file.filename}`,
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