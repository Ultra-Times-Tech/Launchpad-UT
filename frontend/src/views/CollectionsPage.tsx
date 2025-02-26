import { Link } from 'react-router-dom';

interface Collection {
  id: number;
  name: string;
  description: string;
  image: string;
  totalItems: number;
  floorPrice: string;
}

function CollectionsPage() {
  // Sample collections data
  const collections: Collection[] = [
    {
      id: 1,
      name: "Cosmic Explorers",
      description: "A collection of rare cosmic explorer NFTs from the future, featuring unique space travelers and interstellar adventurers.",
      image: "https://picsum.photos/800/400?random=10",
      totalItems: 1000,
      floorPrice: "0.5 ETH"
    },
    {
      id: 2,
      name: "Digital Dreams",
      description: "Enter the world of digital dreams with this surreal collection of abstract digital art pieces created by renowned digital artists.",
      image: "https://picsum.photos/800/400?random=11",
      totalItems: 500,
      floorPrice: "0.8 ETH"
    },
    {
      id: 3,
      name: "Neon Nights",
      description: "Cyberpunk-inspired digital collectibles featuring neon-lit cityscapes, futuristic characters, and dystopian themes.",
      image: "https://picsum.photos/800/400?random=12",
      totalItems: 750,
      floorPrice: "1.2 ETH"
    },
    {
      id: 4,
      name: "Mythical Creatures",
      description: "A fantasy collection featuring legendary creatures from various mythologies and folklore, reimagined in a modern digital style.",
      image: "https://picsum.photos/800/400?random=13",
      totalItems: 600,
      floorPrice: "0.75 ETH"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Banner */}
      <div className="relative h-80 w-full">
        <img 
          src="https://picsum.photos/1920/600?random=5" 
          alt="Collections Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold mb-4">NFT Collections</h1>
          <p className="text-xl max-w-2xl text-center">Explore our exclusive digital art collections created by world-renowned artists</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-white hover:text-blue-400 transition">
              ← Back to Home
            </Link>
            <h2 className="text-xl font-semibold">Featured Collections</h2>
            <div></div> {/* Empty div for flex spacing */}
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map(collection => (
            <div key={collection.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
              <img 
                src={collection.image} 
                alt={collection.name} 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                <p className="text-gray-400 mb-4">{collection.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-gray-400">Total Items:</span>
                    <span className="ml-2 font-semibold">{collection.totalItems}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Floor Price:</span>
                    <span className="ml-2 text-green-400 font-semibold">{collection.floorPrice}</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                  View Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 Launchpad Ultra Times. All rights reserved.</p>
          <div className="flex justify-center mt-4 space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CollectionsPage;