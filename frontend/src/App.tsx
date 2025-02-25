import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

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

function App() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/nfts');
        setNfts(response.data);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Launchpad Ultra Times</h1>
        <p className="text-gray-400">Discover and collect unique digital art NFTs</p>
      </header>

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

export default App;