import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
// Helpers
import {apiRequestor} from '../utils/axiosInstanceHelper'
import FeaturedCollectionCard, {FeaturedCollectionCardProps} from '../components/Card/FeaturedCollectionCard'

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

interface Article {
  id: number
  title: string
  description: string
  image: string
  date: string
  author: string
}

function HomePage() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [featuredCollections, setFeaturedCollections] = useState<FeaturedCollectionCardProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  // Mock data for latest articles
  const latestArticles: Article[] = [
    {
      id: 1,
      title: '10 Life-Changing Books Everyone Should Read',
      description: 'Discover the books that have transformed lives around the world',
      image: 'https://picsum.photos/600/400?random=4',
      date: 'Feb 28, 2025',
      author: 'John Smith',
    },
  ]

  // Mock data for newest articles
  const newestArticles: Article[] = [
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
      <div className='min-h-screen bg-dark-950 text-white flex items-center justify-center'>
        <div className='flex flex-col items-center'>
          <div className='w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin'></div>
          <p className='mt-4 text-xl font-cabin'>Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white'>
      {/* Hero Banner */}
      <div className='bg-dark-900 text-white py-16'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-5xl font-cabin font-bold mb-4 text-primary-300'>10 collections d'Uniq à ne pas rater</h1>
          <p className='text-lg md:text-xl mb-8 max-w-3xl mx-auto font-quicksand'>Découvrez notre sélection exclusive de collections numériques créées par des artistes de renommée mondiale</p>
          <button className='bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-full transition duration-300'>En savoir plus</button>
        </div>
      </div>

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
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {featuredCollections.map(collection => (
            <FeaturedCollectionCard key={collection.id} id={collection.id} name={collection.name} description={collection.description} image={collection.image} artist={collection.artist} date={collection.date} totalItems={collection.totalItems} floorPrice={collection.floorPrice} comingSoon={collection.comingSoon} />
          ))}
        </div>

        <div className='flex justify-center mt-8'>
          <Link to='/collections'>
            <button className='bg-dark-800 hover:bg-dark-700 text-gray-300 font-medium py-2 px-6 rounded-lg transition duration-200 text-sm'>LOAD MORE COLLECTIONS</button>
          </Link>
        </div>
      </div>

      {/* Latest Articles */}
      <div className='container mx-auto px-4 py-12'>
        <h2 className='text-2xl font-cabin font-bold mb-8 text-center text-primary-300'>Latest Articles</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='md:col-span-2'>
            {latestArticles.map(article => (
              <div key={article.id} className='bg-dark-800 text-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1'>
                <div className='relative h-64'>
                  <img src={article.image} alt={article.title} className='w-full h-full object-cover' />
                  <div className='absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent flex items-center justify-center'>
                    <div className='text-center p-6'>
                      <h3 className='text-2xl md:text-3xl font-cabin font-bold mb-2 text-primary-300'>{article.title}</h3>
                      <p className='text-gray-300 mb-4 font-quicksand'>{article.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className='text-xl font-cabin font-bold mb-4 text-primary-300'>Most popular</h3>
            <div className='space-y-4'>
              {popularArticles.map(article => (
                <div key={article.id} className='flex items-center space-x-4 bg-dark-800 p-3 rounded-lg hover:bg-dark-700 transition duration-300'>
                  <div className='w-16 h-16 bg-dark-700 rounded-md flex-shrink-0'></div>
                  <div>
                    <h4 className='font-cabin font-medium text-primary-200'>{article.title}</h4>
                    <p className='text-sm text-gray-400 font-quicksand'>{article.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newest Articles */}
      <div className='container mx-auto px-4 py-12'>
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-2xl font-cabin font-bold text-primary-300'>Newest Articles</h2>
          <button className='text-gray-400 hover:text-white font-medium'>View all articles →</button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {newestArticles.map(article => (
            <div key={article.id} className='bg-dark-800 border border-dark-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1'>
              <div className='h-48 bg-dark-700 flex items-center justify-center'>
                <img src={article.image} alt={article.title} className='w-full h-full object-cover' />
              </div>
              <div className='p-4'>
                <h3 className='font-cabin font-bold mb-2 text-primary-300'>{article.title}</h3>
                <p className='text-sm text-gray-400 mb-3 font-quicksand'>{article.description}</p>
                <div className='flex justify-between items-center text-xs text-gray-500 font-quicksand'>
                  <span>{article.date}</span>
                  <span>By {article.author}</span>
                </div>
              </div>
            </div>
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