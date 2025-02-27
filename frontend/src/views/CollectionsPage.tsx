import {Link} from 'react-router-dom'
import {getAssetUrl} from '../utils/imageHelper'

interface Collection {
  id: number
  name: string
  description: string
  image: string
  totalItems: number
  floorPrice: string
}

function CollectionsPage() {
  // Collections data using local factory images
  const collections: Collection[] = [
    {
      id: 1,
      name: 'Factory Arsenal',
      description: 'A collection of rare weapons and equipment from the future, featuring unique designs and powerful capabilities.',
      image: '/banners/factory-arsenal.png',
      totalItems: 1000,
      floorPrice: '0.5 ETH',
    },
    {
      id: 2,
      name: 'Factory Artifact',
      description: 'Enter the world of mysterious artifacts with this collection of rare and powerful items created by ancient civilizations.',
      image: '/banners/factory-artifact.png',
      totalItems: 500,
      floorPrice: '0.8 ETH',
    },
    {
      id: 3,
      name: 'Factory Characters',
      description: 'A collection featuring unique characters with different abilities, backgrounds, and stories from the Ultra Times universe.',
      image: '/banners/factory-characters.png',
      totalItems: 750,
      floorPrice: '1.2 ETH',
    },
    {
      id: 4,
      name: 'Factory Power Booster',
      description: 'Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem.',
      image: '/banners/factory-powerbooster.png',
      totalItems: 600,
      floorPrice: '0.75 ETH',
    },
  ]

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
            <Link to='/' className='text-white hover:text-primary-400 transition'>
              ← Back to Home
            </Link>
            <h2 className='text-xl font-cabin font-semibold text-primary-300'>Featured Collections</h2>
            <div></div> {/* Empty div for flex spacing */}
          </div>
        </div>
      </div>

      {/* Collections List - One per row, horizontal banner style */}
      <div className='container mx-auto px-4 py-12'>
        <div className='flex flex-col space-y-8'>
          {collections.map(collection => (
            <div key={collection.id} className='bg-dark-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1'>
              <div className='flex flex-col md:flex-row'>
                {/* Image section - optimized for different screen sizes */}
                <div className='md:w-1/2 lg:w-2/5'>
                  <img src={getAssetUrl(collection.image)} alt={collection.name} className='w-full h-64 md:h-full object-cover' />
                </div>
                {/* Content section */}
                <div className='p-6 md:w-1/2 lg:w-3/5 flex flex-col justify-between'>
                  <div>
                    <h3 className='text-2xl font-cabin font-bold mb-2 text-primary-300'>{collection.name}</h3>
                    <p className='text-gray-400 mb-4 font-quicksand'>{collection.description}</p>
                  </div>
                  <div>
                    <div className='flex justify-between items-center mb-4'>
                      <div>
                        <span className='text-gray-400 font-quicksand'>Total Items:</span>
                        <span className='ml-2 font-semibold text-white'>{collection.totalItems}</span>
                      </div>
                      <div>
                        <span className='text-gray-400 font-quicksand'>Floor Price:</span>
                        <span className='ml-2 text-green-400 font-semibold'>{collection.floorPrice}</span>
                      </div>
                    </div>
                    <Link to={`/collections/${collection.id}`} className='block w-full'>
                      <button className='w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200'>View Collection</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Dimensions Information */}
      <div className='container mx-auto px-4 py-8 bg-dark-800 rounded-xl mb-8'>
        <h3 className='text-xl font-cabin font-bold mb-4 text-primary-300'>Optimal Image Dimensions</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-dark-700 p-4 rounded-lg'>
            <h4 className='font-cabin font-semibold mb-2 text-primary-200'>Mobile Screens</h4>
            <p className='font-quicksand'>Width: 640px</p>
            <p className='font-quicksand'>Height: 360px</p>
            <p className='font-quicksand'>Aspect Ratio: 16:9</p>
          </div>
          <div className='bg-dark-700 p-4 rounded-lg'>
            <h4 className='font-cabin font-semibold mb-2 text-primary-200'>Tablet Screens</h4>
            <p className='font-quicksand'>Width: 1024px</p>
            <p className='font-quicksand'>Height: 384px</p>
            <p className='font-quicksand'>Aspect Ratio: 8:3</p>
          </div>
          <div className='bg-dark-700 p-4 rounded-lg'>
            <h4 className='font-cabin font-semibold mb-2 text-primary-200'>Desktop Screens</h4>
            <p className='font-quicksand'>Width: 1280px</p>
            <p className='font-quicksand'>Height: 400px</p>
            <p className='font-quicksand'>Aspect Ratio: 16:5</p>
          </div>
          <div className='bg-dark-700 p-4 rounded-lg'>
            <h4 className='font-cabin font-semibold mb-2 text-primary-200'>Large Desktop Screens</h4>
            <p className='font-quicksand'>Width: 1920px</p>
            <p className='font-quicksand'>Height: 600px</p>
            <p className='font-quicksand'>Aspect Ratio: 16:5</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionsPage