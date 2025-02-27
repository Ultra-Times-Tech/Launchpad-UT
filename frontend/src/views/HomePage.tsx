import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Helpers
import { apiRequestor } from '../utils/axiosInstanceHelper';

interface NFT {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  artist: string;
  supply: number;
  minted: number;
}

function HomePage() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        console.log('Fetching NFTs from backend...');
        const response = await apiRequestor.get('/nfts');
        console.log('NFTs response:', response.data);
        setNfts(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setError('Failed to load NFTs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-xl">Loading NFTs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Launchpad Ultra Times</h1>
        <p className="text-gray-400 mb-6">Discover and collect unique digital art NFTs</p>
        <Link to="/collections" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200">
          View Collections
        </Link>
      </header>

      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white p-4 rounded-lg mb-8">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {nfts.map((nft) => (
          <div key={nft.id} className="bg-gray-800 rounded-xl overflow-hidden">
            <img src={nft.image} alt={nft.name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{nft.name}</h2>
              <p className="text-gray-400 mb-4">{nft.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-green-400 font-semibold">{nft.price}</span>
                <span className="text-gray-400">by {nft.artist}</span>
              </div>
              <div className="bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(nft.minted / nft.supply) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>{nft.minted} minted</span>
                <span>Total supply: {nft.supply}</span>
              </div>
              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                Mint NFT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;