import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAssetUrl } from '../utils/imageHelper';

interface Collection {
  id: number;
  name: string;
  description: string;
  image: string;
  totalItems: number;
  floorPrice: string;
  creator: string;
  releaseDate: string;
  items: CollectionItem[];
  features: string[];
  story: string;
}

interface CollectionItem {
  id: number;
  name: string;
  image: string;
  rarity: string;
  price: string;
}

function CollectionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'items' | 'story' | 'features'>('items');

  useEffect(() => {
    // Simulate fetching collection data
    const fetchCollection = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data based on the ID
        setTimeout(() => {
          const mockCollection = getMockCollection(Number(id));
          setCollection(mockCollection);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching collection:', error);
        setLoading(false);
      }
    };

    fetchCollection();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-xl">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Collection Not Found</h2>
        <p className="mb-6">The collection you're looking for doesn't exist or has been removed.</p>
        <Link to="/collections" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200">
          Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Banner */}
      <div className="relative h-96 w-full">
        <img 
          src={getAssetUrl(collection.image)} 
          alt={collection.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent flex flex-col items-center justify-end pb-12">
          <h1 className="text-5xl font-bold mb-4 text-center">{collection.name}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
              {collection.totalItems} Items
            </span>
            <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-semibold">
              Floor: {collection.floorPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800 py-4 sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/collections" className="text-white hover:text-blue-400 transition">
              ← Back to Collections
            </Link>
            <div className="flex space-x-6">
              <button 
                onClick={() => setActiveTab('items')} 
                className={`px-4 py-2 rounded-lg transition ${activeTab === 'items' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Items
              </button>
              <button 
                onClick={() => setActiveTab('story')} 
                className={`px-4 py-2 rounded-lg transition ${activeTab === 'story' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Story
              </button>
              <button 
                onClick={() => setActiveTab('features')} 
                className={`px-4 py-2 rounded-lg transition ${activeTab === 'features' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Features
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Collection Info */}
        <div className="bg-gray-800 rounded-xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About {collection.name}</h2>
              <p className="text-gray-300 mb-6">{collection.description}</p>
              <p className="text-gray-300 mb-6">{collection.story.substring(0, 200)}...</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-gray-400 text-sm">Creator</h3>
                  <p className="font-semibold">{collection.creator}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Release Date</h3>
                  <p className="font-semibold">{collection.releaseDate}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Total Items</h3>
                  <p className="font-semibold">{collection.totalItems}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Floor Price</h3>
                  <p className="font-semibold text-green-400">{collection.floorPrice}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200 mb-4">
                View on Marketplace
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200">
                Mint New Item
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'items' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Collection Items</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {collection.items.map(item => (
                  <div key={item.id} className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition duration-300">
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-48 object-cover"
                      />
                      <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                        item.rarity === 'Legendary' ? 'bg-yellow-500 text-black' : 
                        item.rarity === 'Epic' ? 'bg-purple-500' : 
                        item.rarity === 'Rare' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                        {item.rarity}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2">{item.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-green-400">{item.price}</span>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded transition duration-200">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'story' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Collection Story</h2>
              <div className="bg-gray-800 rounded-xl p-8">
                <p className="text-gray-300 mb-6 leading-relaxed">{collection.story}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <img 
                    src={`https://picsum.photos/800/500?random=${collection.id}1`} 
                    alt="Story illustration" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <img 
                    src={`https://picsum.photos/800/500?random=${collection.id}2`} 
                    alt="Story illustration" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Collection Features</h2>
              <div className="bg-gray-800 rounded-xl p-8">
                <ul className="space-y-4">
                  {collection.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-gray-300">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
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

// Mock data function
function getMockCollection(id: number): Collection {
  const collections = [
    {
      id: 1,
      name: "Factory Arsenal",
      description: "A collection of rare weapons and equipment from the future, featuring unique designs and powerful capabilities.",
      image: "/banners/factory-arsenal.png",
      totalItems: 1000,
      floorPrice: "0.5 ETH",
      creator: "Ultra Times Studios",
      releaseDate: "March 15, 2025",
      story: "In the year 2150, the Ultra Times Corporation revolutionized warfare with their advanced weapons technology. The Factory Arsenal collection represents the pinnacle of their achievements, featuring weapons that combine cutting-edge technology with artistic design. Each weapon in this collection has been meticulously crafted to reflect both form and function, with unique attributes that make them valuable not just as digital collectibles but as functional items within the Ultra Times ecosystem. The story of Factory Arsenal begins in the research labs of Ultra Times, where brilliant engineers and designers worked tirelessly to create weapons that would change the course of history. These weapons were not just tools of destruction, but works of art that reflected the cultural and technological advancements of their time. Now, these legendary weapons are available as NFTs, allowing collectors to own a piece of this fictional future history.",
      features: [
        "Each weapon has unique attributes and power levels",
        "Weapons can be used in the Ultra Times gaming ecosystem",
        "Rare and legendary weapons include animated visual effects",
        "Owners receive exclusive access to special in-game events",
        "Limited edition weapons with enhanced capabilities",
        "Blockchain-verified ownership and authenticity"
      ],
      items: [
        {
          id: 101,
          name: "Plasma Rifle Alpha",
          image: "https://picsum.photos/400/400?random=101",
          rarity: "Common",
          price: "0.2 ETH"
        },
        {
          id: 102,
          name: "Quantum Blade",
          image: "https://picsum.photos/400/400?random=102",
          rarity: "Rare",
          price: "0.8 ETH"
        },
        {
          id: 103,
          name: "Graviton Hammer",
          image: "https://picsum.photos/400/400?random=103",
          rarity: "Epic",
          price: "1.5 ETH"
        },
        {
          id: 104,
          name: "Neutron Shield",
          image: "https://picsum.photos/400/400?random=104",
          rarity: "Common",
          price: "0.3 ETH"
        },
        {
          id: 105,
          name: "Vortex Cannon",
          image: "https://picsum.photos/400/400?random=105",
          rarity: "Legendary",
          price: "3.0 ETH"
        },
        {
          id: 106,
          name: "Stealth Dagger",
          image: "https://picsum.photos/400/400?random=106",
          rarity: "Rare",
          price: "0.7 ETH"
        },
        {
          id: 107,
          name: "Fusion Gauntlet",
          image: "https://picsum.photos/400/400?random=107",
          rarity: "Epic",
          price: "1.8 ETH"
        },
        {
          id: 108,
          name: "Temporal Bow",
          image: "https://picsum.photos/400/400?random=108",
          rarity: "Legendary",
          price: "2.5 ETH"
        }
      ]
    },
    {
      id: 2,
      name: "Factory Artifact",
      description: "Enter the world of mysterious artifacts with this collection of rare and powerful items created by ancient civilizations.",
      image: "/banners/factory-artifact.png",
      totalItems: 500,
      floorPrice: "0.8 ETH",
      creator: "Ultra Times Archaeology",
      releaseDate: "April 22, 2025",
      story: "Throughout human history, ancient civilizations have created artifacts of immense power and mystery. The Factory Artifact collection brings these legendary items to life as digital collectibles. Each artifact in this collection has a unique history and set of powers, drawn from mythologies and legends from around the world. From the Amulet of Anubis to the Chalice of Immortality, these artifacts represent the pinnacle of ancient craftsmanship and mystical knowledge. The Ultra Times archaeological team has spent decades researching and documenting these artifacts, creating detailed digital recreations that capture their essence and power. Now, collectors can own these pieces of history and unlock their potential within the Ultra Times universe.",
      features: [
        "Artifacts based on real-world mythologies and legends",
        "Each artifact has a unique backstory and lore",
        "Artifacts provide special abilities in Ultra Times games",
        "Detailed 3D models with intricate designs",
        "Artifact combinations unlock hidden features",
        "Ownership grants access to exclusive artifact lore"
      ],
      items: [
        {
          id: 201,
          name: "Amulet of Anubis",
          image: "https://picsum.photos/400/400?random=201",
          rarity: "Epic",
          price: "1.2 ETH"
        },
        {
          id: 202,
          name: "Chalice of Immortality",
          image: "https://picsum.photos/400/400?random=202",
          rarity: "Legendary",
          price: "2.8 ETH"
        },
        {
          id: 203,
          name: "Orb of Destiny",
          image: "https://picsum.photos/400/400?random=203",
          rarity: "Rare",
          price: "0.9 ETH"
        },
        {
          id: 204,
          name: "Ancient Scroll",
          image: "https://picsum.photos/400/400?random=204",
          rarity: "Common",
          price: "0.4 ETH"
        },
        {
          id: 205,
          name: "Crystal of Power",
          image: "https://picsum.photos/400/400?random=205",
          rarity: "Epic",
          price: "1.5 ETH"
        },
        {
          id: 206,
          name: "Mask of Shadows",
          image: "https://picsum.photos/400/400?random=206",
          rarity: "Rare",
          price: "0.85 ETH"
        },
        {
          id: 207,
          name: "Staff of Elements",
          image: "https://picsum.photos/400/400?random=207",
          rarity: "Legendary",
          price: "3.2 ETH"
        },
        {
          id: 208,
          name: "Relic of Time",
          image: "https://picsum.photos/400/400?random=208",
          rarity: "Epic",
          price: "1.7 ETH"
        }
      ]
    },
    {
      id: 3,
      name: "Factory Characters",
      description: "A collection featuring unique characters with different abilities, backgrounds, and stories from the Ultra Times universe.",
      image: "/banners/factory-characters.png",
      totalItems: 750,
      floorPrice: "1.2 ETH",
      creator: "Ultra Times Creative",
      releaseDate: "May 10, 2025",
      story: "The Ultra Times universe is home to countless unique characters, each with their own stories, abilities, and destinies. The Factory Characters collection brings these diverse individuals to life as digital collectibles. From brave heroes to cunning villains, mystical beings to technological wonders, this collection represents the rich tapestry of personalities that populate the Ultra Times narrative. Each character has been carefully designed with a detailed backstory, unique visual style, and special abilities that make them valuable within the Ultra Times ecosystem. Collectors can own these characters and use them in various Ultra Times games and experiences, unlocking new storylines and gameplay possibilities.",
      features: [
        "Characters with unique abilities and attributes",
        "Detailed character backstories and lore",
        "Characters can be used in Ultra Times games",
        "Different character classes with special abilities",
        "Character progression and customization",
        "Limited edition characters with unique storylines"
      ],
      items: [
        {
          id: 301,
          name: "Commander Nova",
          image: "https://picsum.photos/400/400?random=301",
          rarity: "Epic",
          price: "1.8 ETH"
        },
        {
          id: 302,
          name: "Shadow Assassin",
          image: "https://picsum.photos/400/400?random=302",
          rarity: "Rare",
          price: "0.95 ETH"
        },
        {
          id: 303,
          name: "Mystic Sage",
          image: "https://picsum.photos/400/400?random=303",
          rarity: "Legendary",
          price: "3.5 ETH"
        },
        {
          id: 304,
          name: "Tech Engineer",
          image: "https://picsum.photos/400/400?random=304",
          rarity: "Common",
          price: "0.5 ETH"
        },
        {
          id: 305,
          name: "Cosmic Explorer",
          image: "https://picsum.photos/400/400?random=305",
          rarity: "Epic",
          price: "2.0 ETH"
        },
        {
          id: 306,
          name: "Beast Hunter",
          image: "https://picsum.photos/400/400?random=306",
          rarity: "Rare",
          price: "1.1 ETH"
        },
        {
          id: 307,
          name: "Time Traveler",
          image: "https://picsum.photos/400/400?random=307",
          rarity: "Legendary",
          price: "4.0 ETH"
        },
        {
          id: 308,
          name: "Desert Nomad",
          image: "https://picsum.photos/400/400?random=308",
          rarity: "Common",
          price: "0.6 ETH"
        }
      ]
    },
    {
      id: 4,
      name: "Factory Power Booster",
      description: "Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem.",
      image: "/banners/factory-powerbooster.png",
      totalItems: 600,
      floorPrice: "0.75 ETH",
      creator: "Ultra Times Labs",
      releaseDate: "June 5, 2025",
      story: "In the competitive world of Ultra Times, power boosters provide the edge that can mean the difference between victory and defeat. The Factory Power Booster collection features a range of digital items that enhance abilities, unlock new powers, and provide strategic advantages within the Ultra Times ecosystem. Developed by the brilliant minds at Ultra Times Labs, these power boosters represent the cutting edge of digital enhancement technology. Each booster has been carefully balanced to provide significant advantages without disrupting the overall game balance. From temporary stat boosts to permanent ability unlocks, these power boosters offer a variety of ways to customize and enhance your Ultra Times experience.",
      features: [
        "Boosters provide temporary or permanent enhancements",
        "Different booster types for various gameplay styles",
        "Stackable effects for customized enhancement",
        "Rare boosters with unique visual effects",
        "Boosters can be combined to create more powerful effects",
        "Limited edition boosters with exclusive abilities"
      ],
      items: [
        {
          id: 401,
          name: "Speed Amplifier",
          image: "https://picsum.photos/400/400?random=401",
          rarity: "Common",
          price: "0.3 ETH"
        },
        {
          id: 402,
          name: "Strength Enhancer",
          image: "https://picsum.photos/400/400?random=402",
          rarity: "Rare",
          price: "0.8 ETH"
        },
        {
          id: 403,
          name: "Intelligence Booster",
          image: "https://picsum.photos/400/400?random=403",
          rarity: "Epic",
          price: "1.4 ETH"
        },
        {
          id: 404,
          name: "Ultimate Power Core",
          image: "https://picsum.photos/400/400?random=404",
          rarity: "Legendary",
          price: "2.5 ETH"
        },
        {
          id: 405,
          name: "Stealth Module",
          image: "https://picsum.photos/400/400?random=405",
          rarity: "Rare",
          price: "0.9 ETH"
        },
        {
          id: 406,
          name: "Defense Matrix",
          image: "https://picsum.photos/400/400?random=406",
          rarity: "Common",
          price: "0.4 ETH"
        },
        {
          id: 407,
          name: "Energy Catalyst",
          image: "https://picsum.photos/400/400?random=407",
          rarity: "Epic",
          price: "1.6 ETH"
        },
        {
          id: 408,
          name: "Time Dilator",
          image: "https://picsum.photos/400/400?random=408",
          rarity: "Legendary",
          price: "3.0 ETH"
        }
      ]
    }
  ];

  return collections.find(c => c.id === id) || collections[0];
}

export default CollectionDetailsPage;