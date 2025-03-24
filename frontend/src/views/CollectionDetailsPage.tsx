import {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import {getAssetUrl} from '../utils/imageHelper'
import FactoryCard, {FactoryCardProps} from '../components/Card/FactoryCard'

interface Collection {
  id: number
  name: string
  description: string
  image: string
  totalItems: number
  floorPrice: string
  creator: string
  releaseDate: string
  factories: FactoryCardProps[]
  features: string[]
}

function CollectionDetailsPage() {
  const {id} = useParams<{id: string}>()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'story' | 'features'>('story')

  useEffect(() => {
    // Simulate fetching collection data
    const fetchCollection = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const mockCollection = getMockCollection(Number(id))
          setCollection(mockCollection)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error('Error fetching collection:', error)
        setLoading(false)
      }
    }

    fetchCollection()
  }, [id])

  if (loading) {
    return (
      <div className='min-h-screen bg-dark-950 text-white flex items-center justify-center'>
        <div className='flex flex-col items-center'>
          <div className='w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin'></div>
          <p className='mt-4 text-xl'>Loading collection...</p>
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className='min-h-screen bg-dark-950 text-white flex flex-col items-center justify-center'>
        <h2 className='text-2xl font-bold mb-4'>Collection Not Found</h2>
        <p className='mb-6'>The collection you're looking for doesn't exist or has been removed.</p>
        <Link to='/collections' className='bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200'>
          Back to Collections
        </Link>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white'>
      {/* Hero Banner */}
      <div className='relative h-96 w-full'>
        <img src={getAssetUrl(collection.image)} alt={collection.name} className='w-full h-full object-cover' />
        <div className='absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent flex flex-col items-center justify-end pb-12'>
          <h1 className='text-5xl font-bold mb-4 text-center text-primary-300'>{collection.name}</h1>
          <div className='flex items-center space-x-4 mb-4'>
            <span className='bg-primary-600 px-3 py-1 rounded-full text-sm font-semibold'>{collection.totalItems} Items</span>
            <span className='bg-green-600 px-3 py-1 rounded-full text-sm font-semibold'>Floor: {collection.floorPrice}</span>
          </div>
          <p className='text-sm text-gray-300'>by {collection.creator}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className='bg-dark-800 py-4 sticky top-0 z-10 shadow-lg'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center'>
            <Link to='/collections' className='text-white hover:text-primary-300 transition'>
              ← Back to Collections
            </Link>
            <div className='flex space-x-6'>
              <button onClick={() => setActiveTab('story')} className={`px-4 py-2 rounded-lg transition ${activeTab === 'story' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                Story
              </button>
              <button onClick={() => setActiveTab('features')} className={`px-4 py-2 rounded-lg transition ${activeTab === 'features' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                Features
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12'>
        {/* Collection Info */}
        <div className='bg-dark-800 rounded-xl p-8 mb-12'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='md:col-span-3'>
              <h2 className='text-2xl font-bold mb-4 text-primary-300'>About {collection.name}</h2>
              <p className='text-gray-300 mb-6'>{collection.description}</p>

              {activeTab === 'features' && (
                <div className='mb-6'>
                  <h3 className='text-xl font-bold mb-3 text-primary-300'>Features</h3>
                  <ul className='list-disc pl-5 text-gray-300 space-y-2'>
                    {collection.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className='grid grid-cols-2 gap-4 mt-6'>
                <div>
                  <h3 className='text-gray-400 text-sm'>Creator</h3>
                  <p className='font-semibold text-white'>{collection.creator}</p>
                </div>
                <div>
                  <h3 className='text-gray-400 text-sm'>Release Date</h3>
                  <p className='font-semibold text-white'>{collection.releaseDate}</p>
                </div>
                <div>
                  <h3 className='text-gray-400 text-sm'>Total Items</h3>
                  <p className='font-semibold text-white'>{collection.totalItems}</p>
                </div>
                <div>
                  <h3 className='text-gray-400 text-sm'>Floor Price</h3>
                  <p className='font-semibold text-green-400'>{collection.floorPrice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Factories Section */}
        <div className='mb-12'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {collection.factories.map(factory => (
              <FactoryCard key={factory.id} id={factory.id} collectionId={collection.id} name={factory.name} description={factory.description} image={factory.image} mintPrice={factory.mintPrice} supply={factory.supply} minted={factory.minted} />
            ))}
          </div>
        </div>

        {/* Marketing Sections */}
        <div className='container mx-auto px-4 py-8 mb-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='bg-dark-800 p-6 rounded-xl'>
              <h3 className='text-xl font-bold mb-4 text-primary-300'>Street Art Reimagined</h3>
              <p className='text-gray-300 mb-4'>Experience the perfect fusion of street art and cubism, where each piece tells a unique story through geometric forms and vibrant colors. A groundbreaking collection that redefines the boundaries of digital art.</p>
              <p className='text-primary-300 font-semibold'>Limited edition of 2 unique pieces</p>
            </div>

            <div className='flex items-center justify-center'>
              <img src='/launchpad-ut/banners/dark-counsil.avif' alt='Dark Wisdom Counsellor' className='rounded-xl w-full h-48 object-cover' />
            </div>
          </div>
        </div>

        <div className='container mx-auto px-4 py-8 mb-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='flex items-center justify-center'>
              <img src='/launchpad-ut/banners/phygital.avif' alt='Phygital Voucher' className='rounded-xl w-full h-48 object-cover' />
            </div>

            <div className='bg-dark-800 p-6 rounded-xl'>
              <h3 className='text-xl font-bold mb-4 text-primary-300'>Exclusivity & Rarity</h3>
              <p className='text-gray-300 mb-4'>Each piece in the collection is a unique artwork signed by C-la. Take advantage of an exceptional opportunity with our special raffle system: for every 5 UniQ purchased, you have a chance to win a rare ViT UniQ from the UT Collection.</p>
              <p className='text-primary-300 font-semibold'>Physical artwork conversion available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mock data function
function getMockCollection(id: number): Collection {
  const collections = [
    {
      id: 1,
      name: 'Vox-in-Time',
      description: 'A collection of rare weapons and equipment from the future, featuring unique designs and powerful capabilities.',
      image: '/banners/vit-banner.png',
      totalItems: 1000,
      floorPrice: '0.5 ETH',
      creator: 'Ultra Times Studios',
      releaseDate: 'March 15, 2025',
      features: ['Each weapon has unique attributes and power levels', 'Weapons can be used in the Ultra Times gaming ecosystem', 'Rare and legendary weapons include animated visual effects', 'Owners receive exclusive access to special in-game events', 'Limited edition weapons with enhanced capabilities', 'Blockchain-verified ownership and authenticity'],
      factories: [
        {
          id: 1,
          collectionId: 1,
          name: 'Personnages',
          description: 'Donec nec ante nisi. Vestibulum tincidunt lectus sed magna.',
          image: 'https://picsum.photos/400/300?random=1',
          mintPrice: '0.5 UOS',
          supply: 100,
          minted: 45,
        },
        {
          id: 2,
          collectionId: 1,
          name: 'Arsenal',
          description: 'Morbi eget mattis vel felis sodales commodo tempor magna.',
          image: 'https://picsum.photos/400/300?random=2',
          mintPrice: '0.8 UOS',
          supply: 150,
          minted: 23,
        },
        {
          id: 3,
          collectionId: 1,
          name: 'Artifacts',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          image: 'https://picsum.photos/400/300?random=3',
          mintPrice: '1.2 UOS',
          supply: 75,
          minted: 62,
        },
        {
          id: 4,
          collectionId: 1,
          name: 'Power boosters',
          description: 'Vivamus feugiat verius accumsan. Proin ac orci sed mattis.',
          image: 'https://picsum.photos/400/300?random=4',
          mintPrice: '0.3 UOS',
          supply: 200,
          minted: 89,
        },
      ],
    },
    {
      id: 2,
      name: 'Ultra Street-Cubism',
      description: 'Discover Ultra Street-Cubism, a groundbreaking collection that merges street art with cubism. Each piece is a unique digital masterpiece that captures the essence of urban culture through geometric forms and vibrant colors.',
      image: '/banners/factory-artifact.png',
      totalItems: 2,
      floorPrice: '0 ETH',
      creator: 'C-la',
      releaseDate: 'June 01, 2024',
      features: [
        'Unique fusion of street art and cubism',
        'Each piece signed by the artist C-la',
        'Exclusive chance to win ViT UniQ through special raffle',
        'Physical artwork conversion option available',
        'Limited edition of only 2 unique pieces',
        'Blockchain-verified authenticity'
      ],
      factories: [
        {
          id: 1,
          collectionId: 2,
          name: 'Dark Wisdom Counsellor',
          description: 'A stunning Dark Street Cubism painting inspired by an Ultra\'s Movement Elder design. This exclusive creation is personally signed by C-la. By acquiring this Art, you\'re automatically entered into a special raffle that occurs every 5 UniQ purchases (excluding Vouchers), giving you a chance to win a high-rarity ViT UniQ from the UT Collection.',
          image: '/launchpad-ut/banners/dark-counsil.avif',
          mintPrice: '0 UOS',
          supply: 1,
          minted: 0,
        },
        {
          id: 2,
          collectionId: 2,
          name: 'Phygital Voucher',
          description: 'Transform your digital Ultra Street-Cubism collection into a physical masterpiece. This voucher entitles you to receive a printed version of your UniQ on a premium 60cm x 80cm dibond support, ensuring durability and longevity. (Shipping costs not included) For more information, contact Ultra Times teams on Discord: https://discord.gg/R2zvShJAyh',
          image: '/launchpad-ut/banners/phygital.avif',
          mintPrice: '0 UOS',
          supply: 1,
          minted: 0,
        }
      ],
    },
    {
      id: 3,
      name: 'Crypto Punks Edition',
      description: 'A collection featuring unique characters with different abilities, backgrounds, and stories from the Ultra Times universe.',
      image: '/banners/factory-characters.png',
      totalItems: 750,
      floorPrice: '1.2 ETH',
      creator: 'Ultra Times Creative',
      releaseDate: 'May 10, 2025',
      features: ['Characters with unique abilities and attributes', 'Detailed character backstories and lore', 'Characters can be used in Ultra Times games', 'Different character classes with special abilities', 'Character progression and customization', 'Limited edition characters with unique storylines'],
      factories: [
        {
          id: 1,
          collectionId: 3,
          name: 'Personnages',
          description: 'Donec nec ante nisi. Vestibulum tincidunt lectus sed magna.',
          image: 'https://picsum.photos/400/300?random=9',
          mintPrice: '0.5 UOS',
          supply: 100,
          minted: 45,
        },
        {
          id: 2,
          collectionId: 3,
          name: 'Arsenal',
          description: 'Morbi eget mattis vel felis sodales commodo tempor magna.',
          image: 'https://picsum.photos/400/300?random=10',
          mintPrice: '0.8 UOS',
          supply: 150,
          minted: 23,
        },
      ],
    },
  ]

  return collections.find(c => c.id === id) || collections[0]
}

export default CollectionDetailsPage