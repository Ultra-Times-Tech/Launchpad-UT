export interface UploadedFile {
  filename: string;
  originalname: string;
  url: string;
  size: number;
  mimetype: string;
}

export interface UploadResponse {
  filename: string;
  url: string;
} 