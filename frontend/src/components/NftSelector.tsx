import { useState, useEffect } from 'react';
import { Nft, fetchUserNfts } from '../utils/nftService';

interface NftSelectorProps {
  blockchainId: string;
  onSelect: (nft: Nft) => void;
  currentAvatarId?: string;
}

const NftSelector: React.FC<NftSelectorProps> = ({ blockchainId, onSelect, currentAvatarId }) => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNftId, setSelectedNftId] = useState<string | null>(currentAvatarId || null);

  useEffect(() => {
    const loadNfts = async () => {
      if (!blockchainId) return;
      
      try {
        setLoading(true);
        const userNfts = await fetchUserNfts(blockchainId);
        setNfts(userNfts);
        setError(null);
      } catch (err) {
        console.error('Failed to load NFTs:', err);
        setError('Impossible de charger vos NFTs. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    loadNfts();
  }, [blockchainId]);

  const handleSelect = (nft: Nft) => {
    setSelectedNftId(nft.id);
    onSelect(nft);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 text-red-200 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={() => setLoading(true)} 
          className="mt-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="p-4 bg-dark-900 rounded-lg">
        <p className="text-gray-400">Vous ne possédez aucun NFT pour le moment.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Sélectionnez un NFT pour votre avatar</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {nfts.map((nft) => {
          const imageUrl = nft.metadata.content.medias.square?.uri || 
                         nft.metadata.content.medias.product?.uri || 
                         nft.metadata.content.medias.gallery?.uri ||
                         nft.metadata.content.medias.hero?.uri;
          
          const isSelected = selectedNftId === nft.id;
          
          return (
            <div 
              key={nft.id}
              onClick={() => handleSelect(nft)}
              className={`
                relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                ${isSelected ? 'border-primary-500 scale-105' : 'border-dark-700 hover:border-dark-500'}
              `}
            >
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={nft.metadata.content.name} 
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square bg-dark-800 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 bg-dark-900/80 p-2">
                <p className="text-sm font-medium truncate">{nft.metadata.content.name}</p>
                <p className="text-xs text-gray-400">#{nft.serialNumber}</p>
              </div>
              
              {isSelected && (
                <div className="absolute top-2 right-2 bg-primary-500 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NftSelector; 