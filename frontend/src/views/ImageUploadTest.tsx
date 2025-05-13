import React, { useState } from 'react';
import { uploadService } from '../services/upload.service';
import { UploadResponse } from '../types/upload.types';

const ImageUploadTest: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setError(null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner une image');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await uploadService.uploadImage(selectedFile);
      setUploadedImage(result);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Erreur lors de l\'upload. Veuillez réessayer.');
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Test d'Upload d'Images</h1>
      
      <div className="mb-6 p-6 border border-gray-200 rounded-lg shadow-sm">
        <div className="mb-4">
          <label htmlFor="image-upload" className="block text-sm font-medium mb-2">
            Sélectionner une image
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {preview && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Aperçu</p>
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Aperçu"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            !selectedFile || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? 'Chargement...' : 'Uploader l\'image'}
        </button>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {uploadedImage && (
        <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Image uploadée avec succès!</h2>
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">URL de l'image:</p>
            <code className="block p-2 bg-gray-100 rounded overflow-x-auto">
              {uploadService.getImageUrl(uploadedImage.filename)}
            </code>
          </div>
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={uploadService.getImageUrl(uploadedImage.filename)}
              alt="Image uploadée"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadTest; 