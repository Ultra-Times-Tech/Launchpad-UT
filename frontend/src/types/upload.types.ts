export interface UploadedFile {
  filename: string;
  originalname: string;
  path: string;
  size: number;
  mimetype: string;
}

export interface UploadResponse {
  filename: string;
  path: string;
} 