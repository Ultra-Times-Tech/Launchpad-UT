import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {getAssetUrl} from '../utils/imageHelper'

interface Collection {
  id: number
  name: string
  description: string
  image: string
  totalItems: number
  floorPrice: string
  artist?: string
  mintPrice?: string
  minted?: number
  supply?: number
}

function CollectionsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  const collectionsPerPage = 12
  const totalPages = Math.ceil(collections.length / collectionsPerPage)

  // Get current collections for pagination
  const indexOfLastCollection = currentPage * collectionsPerPage
  const indexOfFirstCollection = indexOfLastCollection - collectionsPerPage
  const currentCollections = collections.slice(indexOfFirstCollection, indexOfLastCollection)

  useEffect(() => {
    // Simulate fetching collections data
    const fetchCollections = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          // Generate 24 collections for pagination demo
          const mockCollections = generateMockCollections(24)
          setCollections(mockCollections)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error('Error fetching collections:', error)
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll to top when changing page
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-dark-950 text-white flex items-center justify-center'>
        <div className='flex flex-col items-center'>
          <div className='w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin'></div>
          <p className='mt-4 text-xl'>Loading collections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white'>
      {/* Banner */}
      <div className='relative h-80 w-full'>
        <img src='https://picsum.photos/1920/600?random=5' alt='Collections Banner' className='w-full h-full object-cover' />
        <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center'>
          <h1 className='text-5xl font-cabin font-bold mb-4 text-primary-300'>NFT Collections</h1>
          <p className='text-xl max-w-2xl text-center font-quicksand'>Explore our exclusive digital art collections created by world-renowned artists</p>
        </div>
      </div>

      {/* Navigation */}
      <div className='bg-dark-800 py-4'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center'>
            <Link to='/' className='text-white hover:text-primary-300 transition-colors'>
              ← Back to Home
            </Link>
            <h2 className='text-xl font-cabin font-semibold text-primary-300'>All Collections</h2>
            <div></div> {/* Empty div for flex spacing */}
          </div>
        </div>
      </div>

      {/* Collections Grid - 4 per row, 12 per page */}
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {currentCollections.map(collection => (
            <div key={collection.id} className='bg-dark-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300'>
              <div className='p-4'>
                <div className='mb-4'>
                  <img src={getAssetUrl(collection.image)} alt={collection.name} className='w-full h-48 object-cover rounded-lg' />
                </div>
                <h3 className='text-xl font-cabin font-bold mb-2 text-primary-300'>{collection.name}</h3>
                <p className='text-sm text-gray-400 mb-4'>by {collection.artist}</p>
                <p className='text-gray-300 mb-4 text-sm line-clamp-2'>{collection.description}</p>

                <div className='flex justify-between items-center mb-4'>
                  <div>
                    <span className='text-gray-400 text-sm'>Mint Price:</span>
                    <span className='ml-2 text-primary-300 font-semibold'>{collection.mintPrice}</span>
                  </div>
                  <div className='flex items-center'>
                    <span className='text-gray-400 text-sm mr-2'>Supply:</span>
                    <span className='text-white font-semibold'>{collection.supply}</span>
                  </div>
                </div>

                <div className='flex justify-between items-center mb-4'>
                  <div className='w-full bg-dark-700 rounded-full h-2.5'>
                    <div className='bg-primary-500 h-2.5 rounded-full' style={{width: `${(collection.minted! / collection.supply!) * 100}%`}}></div>
                  </div>
                </div>

                <div className='flex justify-between items-center mb-4 text-sm'>
                  <span className='text-gray-400'>{collection.minted} minted</span>
                  <span className='text-gray-400'>Total: {collection.supply}</span>
                </div>

                <Link to={`/collection/${collection.id}`} className='block w-full'>
                  <button className='w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200'>ACCESS AU MINT</button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center mt-12'>
            <div className='flex space-x-2'>
              <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-dark-700 text-gray-500 cursor-not-allowed' : 'bg-dark-800 text-white hover:bg-primary-600 transition-colors'}`}>
                Previous
              </button>

              {Array.from({length: totalPages}, (_, i) => i + 1).map(number => (
                <button key={number} onClick={() => handlePageChange(number)} className={`w-10 h-10 rounded-lg ${currentPage === number ? 'bg-primary-500 text-white' : 'bg-dark-800 text-white hover:bg-dark-700 transition-colors'}`}>
                  {number}
                </button>
              ))}

              <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-dark-700 text-gray-500 cursor-not-allowed' : 'bg-dark-800 text-white hover:bg-primary-600 transition-colors'}`}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to generate mock collections
function generateMockCollections(count: number): Collection[] {
  const baseCollections = [
    {
      id: 1,
      name: 'Vox-in-Time',
      description: 'A collection of rare weapons and equipment from the future, featuring unique designs and powerful capabilities.',
      image: '/banners/vit.png',
      totalItems: 1000,
      floorPrice: '0.5 ETH',
      artist: 'Ultra Times Studios',
      mintPrice: '0.5 UOS',
      minted: 22,
      supply: 100,
    },
    {
      id: 2,
      name: 'Ultra Street-Cubism Discover',
      description: 'Enter the world of mysterious artifacts with this collection of rare and powerful items created by ancient civilizations.',
      image: '/banners/factory-artifact.png',
      totalItems: 500,
      floorPrice: '0.8 ETH',
      artist: 'Ultra Times Archaeology',
      mintPrice: '0.8 UOS',
      minted: 45,
      supply: 150,
    },
    {
      id: 3,
      name: 'Crypto Punks Edition',
      description: 'A collection featuring unique characters with different abilities, backgrounds, and stories from the Ultra Times universe.',
      image: '/banners/factory-characters.png',
      totalItems: 750,
      floorPrice: '1.2 ETH',
      artist: 'Ultra Times Creative',
      mintPrice: '1.2 UOS',
      minted: 75,
      supply: 200,
    },
    {
      id: 4,
      name: 'Factory Power Booster',
      description: 'Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem.',
      image: '/banners/factory-powerbooster.png',
      totalItems: 600,
      floorPrice: '0.75 ETH',
      artist: 'Ultra Times Labs',
      mintPrice: '0.75 UOS',
      minted: 30,
      supply: 100,
    },
  ]

  // Generate additional collections based on the base collections
  const collections: Collection[] = []

  for (let i = 0; i < count; i++) {
    const baseCollection = baseCollections[i % baseCollections.length]
    collections.push({
      ...baseCollection,
      id: i + 1,
      name: i < baseCollections.length ? baseCollection.name : `${baseCollection.name} #${Math.floor(i / baseCollections.length) + 1}`,
      minted: Math.floor(Math.random() * baseCollection.supply!),
    })
  }

  return collections
}

export default CollectionsPage
