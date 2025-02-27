import {useEffect, useState} from 'react'
// Helpers
import {apiRequestor} from '../utils/axiosInstanceHelper'

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

interface Collection {
  id: number
  title: string
  description: string
  image: string
  date: string
  author: string
}

function HomePage() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        console.log('Fetching NFTs from backend...')
        const response = await apiRequestor.get('/nfts')
        console.log('NFTs response:', response.data)
        setNfts(response.data)
        setError(null)
      } catch (error) {
        console.error('Error fetching NFTs:', error)
        setError('Failed to load NFTs. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchNFTs()
  }, [])

  // Mock data for featured collections
  const featuredCollections = [
    {
      id: 1,
      title: 'Ultra Marketplace Browser',
      description: 'Explore the latest digital collectibles',
      image: 'https://picsum.photos/400/300?random=1',
      buttonText: 'Explore Marketplace',
    },
    {
      id: 2,
      title: 'Mint to Earn',
      description: 'Create and earn with your digital art',
      image: 'https://picsum.photos/400/300?random=2',
      buttonText: 'Start Minting',
    },
    {
      id: 3,
      title: 'P2E',
      description: 'Play games and earn rewards',
      image: 'https://picsum.photos/400/300?random=3',
      buttonText: 'Discover Games',
    },
  ]

  // Mock data for latest collections
  const latestCollections: Collection[] = [
    {
      id: 1,
      title: '10 Life-Changing Books Everyone Should Read',
      description: 'Discover the books that have transformed lives around the world',
      image: 'https://picsum.photos/600/400?random=4',
      date: 'Feb 28, 2025',
      author: 'John Smith',
    },
  ]

  // Mock data for newest collections
  const newestCollections: Collection[] = [
    {
      id: 1,
      title: 'Exploring the Future of Digital Art and NFTs',
      description: 'How NFTs Are Changing the Art World',
      image: 'https://picsum.photos/400/300?random=5',
      date: 'Feb 27, 2025',
      author: 'Emma Johnson',
    },
    {
      id: 2,
      title: 'The Evolution of Blockchain Technology',
      description: 'A Journey from Bitcoin to Smart Contracts',
      image: 'https://picsum.photos/400/300?random=6',
      date: 'Feb 26, 2025',
      author: 'Michael Chen',
    },
    {
      id: 3,
      title: 'Understanding Web3 and Decentralized Applications',
      description: 'The Next Generation of Internet',
      image: 'https://picsum.photos/400/300?random=7',
      date: 'Feb 25, 2025',
      author: 'Sarah Williams',
    },
    {
      id: 4,
      title: 'Cryptocurrency Trading Strategies for Beginners',
      description: 'Essential Tips for New Traders',
      image: 'https://picsum.photos/400/300?random=8',
      date: 'Feb 24, 2025',
      author: 'David Rodriguez',
    },
  ]

  // Mock data for most popular articles
  const popularArticles = [
    {
      id: 1,
      title: 'How to Create Your First NFT Collection',
      date: 'Feb 20, 2025',
    },
    {
      id: 2,
      title: 'The Top 5 NFT Marketplaces in 2025',
      date: 'Feb 18, 2025',
    },
    {
      id: 3,
      title: 'Understanding Gas Fees and How to Minimize Them',
      date: 'Feb 15, 2025',
    },
    {
      id: 4,
      title: 'NFT Investment Strategies for Long-term Growth',
      date: 'Feb 12, 2025',
    },
  ]

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-900 text-white flex items-center justify-center'>
        <div className='flex flex-col items-center'>
          <div className='w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin'></div>
          <p className='mt-4 text-xl'>Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      {/* Hero Banner */}
      <div className='bg-gray-800 text-white py-16'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>10 collections d'Uniq à ne pas rater</h1>
          <p className='text-lg md:text-xl mb-8 max-w-3xl mx-auto'>Découvrez notre sélection exclusive de collections numériques créées par des artistes de renommée mondiale</p>
          <button className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300'>En savoir plus</button>
        </div>
      </div>

      {/* Featured Collections */}
      <div className='container mx-auto px-4 py-12'>
        <div className='flex justify-between items-center mb-8'>
          <div className='flex space-x-6'>
            <button className='text-white font-medium border-b-2 border-blue-500'>All</button>
            <button className='text-gray-400 hover:text-white'>Art</button>
            <button className='text-gray-400 hover:text-white'>Collectibles</button>
            <button className='text-gray-400 hover:text-white'>Game Assets</button>
            <button className='text-gray-400 hover:text-white'>Music</button>
          </div>
          <button className='text-gray-400 hover:text-white font-medium'>View all collections →</button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {featuredCollections.map(collection => (
            <div key={collection.id} className='bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300'>
              <div className='h-48 bg-gray-700 flex items-center justify-center'>
                <img src={collection.image} alt={collection.title} className='w-full h-full object-cover' />
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-bold mb-2'>{collection.title}</h3>
                <p className='text-gray-400 mb-4'>{collection.description}</p>
                <button className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300'>{collection.buttonText}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Collections */}
      <div className='container mx-auto px-4 py-12'>
        <h2 className='text-2xl font-bold mb-8 text-center'>Latest Collections</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='md:col-span-2'>
            {latestCollections.map(collection => (
              <div key={collection.id} className='bg-gray-800 text-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300'>
                <div className='relative h-64'>
                  <img src={collection.image} alt={collection.title} className='w-full h-full object-cover' />
                  <div className='absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent flex items-center justify-center'>
                    <div className='text-center p-6'>
                      <h3 className='text-2xl md:text-3xl font-bold mb-2'>{collection.title}</h3>
                      <p className='text-gray-300 mb-4'>{collection.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className='text-xl font-bold mb-4'>Most popular</h3>
            <div className='space-y-4'>
              {popularArticles.map(article => (
                <div key={article.id} className='flex items-center space-x-4 bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition duration-300'>
                  <div className='w-16 h-16 bg-gray-700 rounded-md flex-shrink-0'></div>
                  <div>
                    <h4 className='font-medium'>{article.title}</h4>
                    <p className='text-sm text-gray-400'>{article.date}</p>
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
          <h2 className='text-2xl font-bold'>Newest from Collections</h2>
          <button className='text-gray-400 hover:text-white font-medium'>View all articles →</button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {newestCollections.map(collection => (
            <div key={collection.id} className='bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300'>
              <div className='h-48 bg-gray-700 flex items-center justify-center'>
                <img src={collection.image} alt={collection.title} className='w-full h-full object-cover' />
              </div>
              <div className='p-4'>
                <h3 className='font-bold mb-2'>{collection.title}</h3>
                <p className='text-sm text-gray-400 mb-3'>{collection.description}</p>
                <div className='flex justify-between items-center text-xs text-gray-500'>
                  <span>{collection.date}</span>
                  <span>By {collection.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className='container mx-auto px-4 py-12 text-center'>
        <h2 className='text-2xl font-bold mb-6'>Subscribe to our Newsletter</h2>
        <div className='max-w-md mx-auto'>
          <div className='flex'>
            <input type='email' placeholder='Your email address' className='flex-grow px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
            <button className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-r-md transition duration-300'>Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage