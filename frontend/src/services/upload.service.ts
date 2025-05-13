import { apiRequestor } from '../utils/axiosInstanceHelper'
import { UploadedFile, UploadResponse } from '../types/upload.types'

class UploadService {
  async uploadImage(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiRequestor.post<UploadedFile>('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        filename: response.data.filename,
        url: response.data.url
      };
    } catch (error) {
      console.error('Erreur lors de l\'upload d\'image:', error);
      throw error;
    }
  }

  getImageUrl(filename: string | undefined): string {
    // Si nous avons une URL complète du CDN, l'utiliser directement
    if (filename && filename.startsWith('http')) {
      return filename;
    }
    
    // Sinon, construire l'URL via l'API locale
    const isProduction = import.meta.env.PROD;
    const baseUrl = isProduction 
      ? 'https://launchpad-2ycml.ondigitalocean.app/api' 
      : '/api';
    
    return `${baseUrl}/uploads/${filename || ''}`;
  }
}

export const uploadService = new UploadService(); 