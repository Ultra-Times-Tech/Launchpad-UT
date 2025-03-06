import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
// Helpers
import {apiRequestor} from '../utils/axiosInstanceHelper'
import FeaturedCollectionCard, {FeaturedCollectionCardProps} from '../components/Card/FeaturedCollectionCard'
import CollectionCard from '../components/Card/CollectionCard'
import Slider from '../components/Slider/Slider'

interface NFT {
  id: number
  name: string
  description: string
  price: string
  image: string
  artist: string
  supply: number
  minted: number
}

interface MintActivity {
  id: number
  collectionName: string
  itemName: string
  price: string
  timestamp: string
  image: string
}

interface FeaturedCollection {
  id: number
  name: string
  description: string
  image: string
  artist: string
}

function HomePage() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [featuredCollections, setFeaturedCollections] = useState<FeaturedCollectionCardProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentCollectionIndex, setCurrentCollectionIndex] = useState(0)

  // Mock featured collections for the slider
  const latestCollections: FeaturedCollection[] = [
    {
      id: 1,
      name: 'Vox-in-Time',
      description: 'A groundbreaking collection featuring futuristic digital art and unique characters',
      image: 'https://picsum.photos/800/500?random=1',
      artist: 'Ultra Times Studios',
    },
    {
      id: 2,
      name: 'Ultra Street-Cubism',
      description: 'Where street art meets digital innovation in a stunning NFT collection',
      image: 'https://picsum.photos/800/500?random=2',
      artist: 'Digital Cubists',
    },
    {
      id: 3,
      name: 'Crypto Punks Edition',
      description: 'The legendary collection reimagined for the Ultra ecosystem',
      image: 'https://picsum.photos/800/500?random=3',
      artist: 'CryptoPunk Labs',
    },
    {
      id: 4,
      name: 'Factory Arsenal',
      description: 'Exclusive weapons and equipment from the future',
      image: 'https://picsum.photos/800/500?random=4',
      artist: 'Arsenal Studios',
    },
    {
      id: 5,
      name: 'Power Boosters',
      description: 'Enhance your digital experience with unique power-ups',
      image: 'https://picsum.photos/800/500?random=5',
      artist: 'Power Labs',
    },
  ]

  // Mock mint activities with images
  const mintActivities: MintActivity[] = [
    {
      id: 1,
      collectionName: 'Vox-in-Time',
      itemName: 'Character #156',
      price: '0.5 UOS',
      timestamp: '2 minutes ago',
      image: 'https://picsum.photos/100/100?random=6',
    },
    {
      id: 2,
      collectionName: 'Ultra Street-Cubism',
      itemName: 'Artwork #89',
      price: '0.8 UOS',
      timestamp: '5 minutes ago',
      image: 'https://picsum.photos/100/100?random=7',
    },
    {
      id: 3,
      collectionName: 'Crypto Punks',
      itemName: 'Punk #2234',
      price: '1.2 UOS',
      timestamp: '8 minutes ago',
      image: 'https://picsum.photos/100/100?random=8',
    },
    {
      id: 4,
      collectionName: 'Factory Arsenal',
      itemName: 'Weapon #445',
      price: '0.6 UOS',
      timestamp: '12 minutes ago',
      image: 'https://picsum.photos/100/100?random=9',
    },
    {
      id: 5,
      collectionName: 'Power Boosters',
      itemName: 'Booster #78',
      price: '0.3 UOS',
      timestamp: '15 minutes ago',
      image: 'https://picsum.photos/100/100?random=10',
    },
  ]

  // Mock newest collections
  const newestCollections = [
    {
      id: 1,
      name: 'Digital Dreams',
      description: 'Experience the future of digital art with this unique collection',
      image: 'https://picsum.photos/400/300?random=11',
      artist: 'Digital Dreamers',
      totalItems: 500,
      floorPrice: '0.4 ETH',
    },
    {
      id: 2,
      name: 'Cyber Warriors',
      description: 'Join the elite force of cyber warriors in this exclusive collection',
      image: 'https://picsum.photos/400/300?random=12',
      artist: 'Cyber Labs',
      totalItems: 750,
      floorPrice: '0.6 ETH',
    },
    {
      id: 3,
      name: 'Nature Redux',
      description: 'A digital interpretation of natural wonders',
      image: 'https://picsum.photos/400/300?random=13',
      artist: 'Green Digital',
      totalItems: 300,
      floorPrice: '0.3 ETH',
    },
    {
      id: 4,
      name: 'Meta Beings',
      description: 'Discover unique digital beings from the metaverse',
      image: 'https://picsum.photos/400/300?random=14',
      artist: 'Meta Creators',
      totalItems: 1000,
      floorPrice: '0.5 ETH',
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from backend...')
        // Fetch NFTs
        const nftResponse = await apiRequestor.get('/nfts')
        console.log('NFTs response:', nftResponse.data)
        setNfts(nftResponse.data)

        // Set featured collections (mock data for now)
        setFeaturedCollections([
          {
            id: 1,
            name: 'Vox-in-Time',
            description: 'Suspendisse pretium. Sed neque augue, mattis in posuere euis, sagittis...',
            image: '/banners/vit-banner.png',
            artist: 'Ultra Times',
            date: 'Mar 16, 2025',
            totalItems: 1000,
            floorPrice: '0.5 ETH',
            comingSoon: true,
          },
          {
            id: 2,
            name: 'Ultra Street-Cubism Discover',
            description: 'Nunc ex tortor, venenatis fermentum ipsum id, gravida lacinia cras...',
            image: '/banners/factory-artifact.png',
            artist: 'Bob Jacob',
            date: 'Feb 22, 2025',
            totalItems: 500,
            floorPrice: '0.8 ETH',
            comingSoon: false,
          },
          {
            id: 3,
            name: 'Crypto Punks Edition',
            description: 'Praesent lobortis, lorem id elementum vehicula, sapien ipsum tincidunt...',
            image: '/banners/factory-characters.png',
            artist: 'John Alvarez',
            date: 'Mar 10, 2025',
            totalItems: 750,
            floorPrice: '1.2 ETH',
            comingSoon: false,
          },
        ])

        setError(null)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Auto-rotate collections every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCollectionIndex(current => (current + 1) % latestCollections.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [latestCollections.length])

  if (loading) {
    return (
      <div className='min-h-screen bg-dark-950 text-white flex items-center justify-center'>
        <div className='flex flex-col items-center'>
          <div className='w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin'></div>
          <p className='mt-4 text-xl font-cabin'>Loading content...</p>
        </div>
      </div>
    )
  }

  const currentCollection = latestCollections[currentCollectionIndex]

  return (
    <div className='min-h-screen bg-dark-950 text-white'>
      {/* Hero Banner Slider */}
      <Slider title="10 collections d'Uniq à ne pas rater" description='Découvrez notre sélection exclusive de collections numériques créées par des artistes de renommée mondiale' buttonText='En savoir plus' onButtonClick={() => console.log('Button clicked')} />

      {/* Featured Collections */}
      <div className='container mx-auto px-4 py-12'>
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-2xl font-cabin font-bold text-primary-300'>Featured Collections</h2>
          <Link to='/collections' className='text-gray-400 hover:text-white font-medium'>
            View all collections →
          </Link>
        </div>

        <div className='flex justify-between items-center mb-4'>
          <div className='flex space-x-6 font-cabin'>
            <button className='text-white font-medium border-b-2 border-primary-500'>All</button>
            <button className='text-gray-400 hover:text-white'>Art</button>
            <button className='text-gray-400 hover:text-white'>Collectibles</button>
            <button className='text-gray-400 hover:text-white'>Game Assets</button>
            <button className='text-gray-400 hover:text-white'>Music</button>
          </div>
        </div>

        {/* Collections Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {featuredCollections.map(collection => (
            <FeaturedCollectionCard key={collection.id} id={collection.id} name={collection.name} description={collection.description} image={collection.image} artist={collection.artist} date={collection.date} totalItems={collection.totalItems} floorPrice={collection.floorPrice} comingSoon={collection.comingSoon} />
          ))}
        </div>

        <div className='flex justify-center mt-8'>
          <Link to='/collections'>
            <button className='bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200 text-sm'>LOAD MORE COLLECTIONS</button>
          </Link>
        </div>
      </div>

      {/* Latest Collections and Mint Activities */}
      <div className='container mx-auto px-4 py-12'>
        <h2 className='text-2xl font-cabin font-bold mb-8 text-center text-primary-300'>Latest Collections</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Featured Collection Slider */}
          <div className='md:col-span-2'>
            <div className='bg-dark-800 text-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300'>
              <div className='relative' style={{height: '500px'}}>
                <img src={currentCollection.image} alt={currentCollection.name} className='w-full h-full object-cover' />
                <div className='absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent flex items-end justify-center'>
                  <div className='text-center p-6 w-full'>
                    <h3 className='text-2xl md:text-3xl font-cabin font-bold mb-2 text-primary-300'>{currentCollection.name}</h3>
                    <p className='text-gray-300 mb-2 font-quicksand'>{currentCollection.description}</p>
                    <p className='text-sm text-primary-300'>by {currentCollection.artist}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mint Activities */}
          <div className='h-[500px] overflow-hidden'>
            <h3 className='text-xl font-cabin font-bold mb-4 text-primary-300'>Mint Activities</h3>
            <div className='space-y-4 h-full overflow-y-auto pr-2'>
              {mintActivities.map(activity => (
                <div key={activity.id} className='flex items-center space-x-4 bg-dark-800 p-3 rounded-lg hover:bg-dark-700 transition duration-300'>
                  <div className='w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden'>
                    <img src={activity.image} alt={activity.itemName} className='w-full h-full object-cover' />
                  </div>
                  <div className='flex-grow'>
                    <h4 className='font-cabin font-medium text-primary-200'>{activity.itemName}</h4>
                    <p className='text-sm text-gray-400 font-quicksand'>from {activity.collectionName}</p>
                    <div className='flex justify-between items-center mt-1'>
                      <span className='text-sm text-green-400'>{activity.price}</span>
                      <span className='text-xs text-gray-500'>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newest Collections */}
      <div className='container mx-auto px-4 py-12'>
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-2xl font-cabin font-bold text-primary-300'>Newest Collections</h2>
          <Link to='/collections' className='text-gray-400 hover:text-white font-medium'>
            View all collections →
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {newestCollections.map(collection => (
            <CollectionCard
              key={collection.id}
              id={collection.id}
              name={collection.name}
              description={collection.description}
              image={collection.image}
              artist={collection.artist}
              totalItems={collection.totalItems}
              floorPrice={collection.floorPrice}
            />
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className='container mx-auto px-4 py-12 text-center'>
        <h2 className='text-2xl font-cabin font-bold mb-6 text-primary-300'>Subscribe to our Newsletter</h2>
        <div className='max-w-md mx-auto'>
          <div className='flex'>
            <input type='email' placeholder='Your email address' className='flex-grow px-4 py-3 bg-dark-800 border border-dark-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-quicksand' />
            <button className='bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-r-md transition duration-300'>Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage