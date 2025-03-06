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
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0)

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
    {
      id: 6,
      collectionName: 'Digital Dreams',
      itemName: 'Dream #123',
      price: '0.7 UOS',
      timestamp: '18 minutes ago',
      image: 'https://picsum.photos/100/100?random=11',
    },
    {
      id: 7,
      collectionName: 'Cyber Warriors',
      itemName: 'Warrior #445',
      price: '0.9 UOS',
      timestamp: '20 minutes ago',
      image: 'https://picsum.photos/100/100?random=12',
    },
    {
      id: 8,
      collectionName: 'Nature Redux',
      itemName: 'Nature #67',
      price: '0.4 UOS',
      timestamp: '25 minutes ago',
      image: 'https://picsum.photos/100/100?random=13',
    },
    {
      id: 9,
      collectionName: 'Meta Beings',
      itemName: 'Being #890',
      price: '1.1 UOS',
      timestamp: '30 minutes ago',
      image: 'https://picsum.photos/100/100?random=14',
    },
    {
      id: 10,
      collectionName: 'Space Odyssey',
      itemName: 'Planet #234',
      price: '0.8 UOS',
      timestamp: '35 minutes ago',
      image: 'https://picsum.photos/100/100?random=15',
    },
  ]

  // Mock trending collections
  const trendingCollections = [
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
    {
      id: 5,
      name: 'Space Odyssey',
      description: 'Embark on a journey through digital space',
      image: 'https://picsum.photos/400/300?random=15',
      artist: 'Space Labs',
      totalItems: 600,
      floorPrice: '0.7 ETH',
    },
    {
      id: 6,
      name: 'Pixel Masters',
      description: 'Classic pixel art reimagined for the blockchain',
      image: 'https://picsum.photos/400/300?random=16',
      artist: 'Pixel Art Studio',
      totalItems: 800,
      floorPrice: '0.45 ETH',
    },
    {
      id: 7,
      name: 'Future Funk',
      description: 'Where music meets visual art in the digital realm',
      image: 'https://picsum.photos/400/300?random=17',
      artist: 'Funk Factory',
      totalItems: 400,
      floorPrice: '0.55 ETH',
    },
    {
      id: 8,
      name: 'Crystal Kingdoms',
      description: 'Explore magical realms made of digital crystals',
      image: 'https://picsum.photos/400/300?random=18',
      artist: 'Crystal Arts',
      totalItems: 550,
      floorPrice: '0.65 ETH',
    },
    {
      id: 9,
      name: 'Tech Totems',
      description: 'Ancient wisdom meets modern technology',
      image: 'https://picsum.photos/400/300?random=19',
      artist: 'Digital Shamans',
      totalItems: 450,
      floorPrice: '0.48 ETH',
    },
    {
      id: 10,
      name: 'Ocean Protocol',
      description: 'Digital art inspired by the depths of the ocean',
      image: 'https://picsum.photos/400/300?random=20',
      artist: 'Ocean Labs',
      totalItems: 700,
      floorPrice: '0.58 ETH',
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

  // Auto-rotate trending collections every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrendingIndex(current => (current + 1) % (trendingCollections.length - 3))
    }, 7000)

    return () => clearInterval(interval)
  }, [trendingCollections.length])

  const nextTrendingSlide = () => {
    setCurrentTrendingIndex(current => (current + 1) % (trendingCollections.length - 3))
  }

  const prevTrendingSlide = () => {
    setCurrentTrendingIndex(current => (current - 1 + (trendingCollections.length - 3)) % (trendingCollections.length - 3))
  }

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
      <div className='container mx-auto px-4 py-12 mb-12'>
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
          <div className='h-[500px] bg-dark-900 rounded-2xl p-6 backdrop-blur-sm bg-opacity-50 shadow-xl'>
            <h3 className='text-xl font-cabin font-bold mb-6 text-primary-300 px-2'>Mint Activities</h3>
            <div className='space-y-4 h-[calc(100%-3.5rem)] overflow-y-auto pr-4'>
              {mintActivities.map(activity => (
                <div key={activity.id} className='flex items-center space-x-4 bg-dark-800 bg-opacity-50 p-4 rounded-xl hover:bg-opacity-70 transition-all duration-300 backdrop-blur-sm border border-dark-700 last:mb-4'>
                  <div className='w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden shadow-lg'>
                    <img src={activity.image} alt={activity.itemName} className='w-full h-full object-cover transform hover:scale-110 transition-transform duration-300' />
                  </div>
                  <div className='flex-grow min-w-0'>
                    <h4 className='font-cabin font-medium text-primary-200 truncate text-lg'>{activity.itemName}</h4>
                    <p className='text-sm text-gray-400 font-quicksand truncate mb-1'>from {activity.collectionName}</p>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm font-medium bg-green-500 bg-opacity-20 text-green-400 px-2 py-1 rounded-full'>{activity.price}</span>
                      <span className='text-xs text-gray-500'>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trending Collections Slider */}
      <div className='bg-dark-900 py-16'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center mb-12'>
            <h2 className='text-2xl font-cabin font-bold text-primary-300'>Trending Collections</h2>
          </div>

          <div className='relative overflow-hidden group'>
            {/* Navigation Arrows - Positioned on sides */}
            <button 
              onClick={prevTrendingSlide} 
              className='absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-dark-800 bg-opacity-80 hover:bg-opacity-100 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg backdrop-blur-sm'
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>
            
            <button 
              onClick={nextTrendingSlide} 
              className='absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-dark-800 bg-opacity-80 hover:bg-opacity-100 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg backdrop-blur-sm'
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>

            {/* Collections Slider */}
            <div 
              className='flex transition-transform duration-700 ease-out'
              style={{
                transform: `translateX(-${currentTrendingIndex * 25}%)`,
              }}
            >
              {/* Double the collections for smooth infinite scroll */}
              {[...trendingCollections, ...trendingCollections].map((collection, index) => (
                <div key={`${collection.id}-${index}`} className='w-1/4 flex-shrink-0 px-3'>
                  <div className='collection-hover'>
                    <CollectionCard 
                      id={collection.id} 
                      name={collection.name} 
                      description={collection.description} 
                      image={collection.image} 
                      artist={collection.artist} 
                      totalItems={collection.totalItems} 
                      floorPrice={collection.floorPrice} 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Dots */}
            <div className='flex justify-center mt-8 space-x-2'>
              {Array.from({ length: trendingCollections.length - 3 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTrendingIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentTrendingIndex === index 
                      ? 'bg-primary-500 w-4' 
                      : 'bg-dark-700 hover:bg-dark-600'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
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