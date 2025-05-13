import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as path from 'path';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('DO_SPACES_KEY') || '';
    const secretAccessKey = this.configService.get<string>('DO_SPACES_SECRET') || '';

    this.s3Client = new S3Client({
      endpoint: 'https://fra1.digitaloceanspaces.com',
      region: 'fra1',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, path?: string): Promise<string> {
    const bucketName = 'launchpad-ut-cdn';
    
    // Extraire l'extension du fichier original
    const fileExtension = this.getFileExtension(file.originalname);
    
    // Générer un identifiant unique pour le fichier
    const uniqueId = randomUUID();
    
    // Créer le nouveau nom de fichier sans référence au nom original
    const key = `${path ? path + '/' : ''}${uniqueId}${fileExtension}`;

    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read' as ObjectCannedACL,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      return `https://launchpad-ut-cdn.fra1.cdn.digitaloceanspaces.com/${key}`;
    } catch (error) {
      console.error('Erreur lors de l\'upload vers DigitalOcean Spaces:', error);
      throw new Error('Impossible de télécharger le fichier vers le CDN.');
    }
  }

  private getFileExtension(filename: string): string {
    // Récupérer l'extension du fichier original
    const ext = path.extname(filename).toLowerCase();
    return ext; // Retourne par exemple ".jpg", ".png", etc.
  }
} 