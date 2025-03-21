import { useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaTrash, FaPlus, FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface SliderImage {
  id: string;
  url: string;
  order: number;
  alt: string;
}

const DraggableImage = ({ 
  image, 
  index, 
  moveImage, 
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  total
}: {
  image: SliderImage;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
  total: number;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'image',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'image',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
        hover:shadow-xl hover:ring-2 hover:ring-primary-400`}
      style={{ width: '100%', aspectRatio: '16/9' }}
      role="article"
      aria-label={`Slide ${index + 1} sur ${total}`}
    >
      <img
        src={image.url}
        alt={image.alt || `Slide ${index + 1}`}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay avec les contrôles */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
        <div className="hidden group-hover:flex gap-2">
          {/* Contrôles de position */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onMoveUp(index)}
              disabled={isFirst}
              className={`p-2 rounded-full ${isFirst 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-primary-500 hover:bg-primary-600'} text-white transition-colors`}
              aria-label="Déplacer vers le haut"
            >
              <FaArrowUp />
            </button>
            <button
              onClick={() => onMoveDown(index)}
              disabled={isLast}
              className={`p-2 rounded-full ${isLast 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-primary-500 hover:bg-primary-600'} text-white transition-colors`}
              aria-label="Déplacer vers le bas"
            >
              <FaArrowDown />
            </button>
          </div>
          
          {/* Bouton supprimer */}
          <button
            onClick={() => onDelete(image.id)}
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            aria-label="Supprimer l'image"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Indicateur de position */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white py-2 px-3 text-sm font-quicksand">
        Position {index + 1} sur {total}
      </div>
    </div>
  );
};

const SliderManager = () => {
  const [images, setImages] = useState<SliderImage[]>([
    { id: '1', url: 'https://picsum.photos/800/400?random=1', order: 0, alt: 'Image slider 1' },
    { id: '2', url: 'https://picsum.photos/800/400?random=2', order: 1, alt: 'Image slider 2' },
    { id: '3', url: 'https://picsum.photos/800/400?random=3', order: 2, alt: 'Image slider 3' },
  ]);

  const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
    const newImages = [...images];
    const draggedImage = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, draggedImage);
    setImages(newImages.map((img, idx) => ({ ...img, order: idx })));
  }, [images]);

  const handleDelete = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const handleMoveUp = useCallback((index: number) => {
    if (index > 0) {
      moveImage(index, index - 1);
    }
  }, [moveImage]);

  const handleMoveDown = useCallback((index: number) => {
    if (index < images.length - 1) {
      moveImage(index, index + 1);
    }
  }, [moveImage, images.length]);

  const handleAddImage = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.setAttribute('aria-label', 'Sélectionner une image à ajouter');
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: SliderImage = {
            id: Date.now().toString(),
            url: e.target?.result as string,
            order: images.length,
            alt: file.name.replace(/\.[^/.]+$/, '')
          };
          setImages([...images, newImage]);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h3 className="text-xl font-cabin text-gray-100">Images du Slider Principal</h3>
          <p className="text-sm text-gray-400">Glissez-déposez les images ou utilisez les flèches pour réorganiser</p>
        </div>
        <button
          onClick={handleAddImage}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <FaPlus /> Ajouter une image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Liste des images du slider">
        {images.map((image, index) => (
          <DraggableImage
            key={image.id}
            image={image}
            index={index}
            moveImage={moveImage}
            onDelete={handleDelete}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            isFirst={index === 0}
            isLast={index === images.length - 1}
            total={images.length}
          />
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-gray-400">Aucune image dans le slider</p>
          <button
            onClick={handleAddImage}
            className="mt-4 text-primary-400 hover:text-primary-300 underline"
          >
            Ajouter votre première image
          </button>
        </div>
      )}
    </div>
  );
};

export default SliderManager; 