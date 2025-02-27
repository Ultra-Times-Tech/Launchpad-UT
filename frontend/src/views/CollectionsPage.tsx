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
  // Collections data using local factory images
  const collections: Collection[] = [
    {
      id: 1,
      name: 'Factory Arsenal',
      description: 'A collection of rare weapons and equipment from the future, featuring unique designs and powerful capabilities.',
      image: '/banners/factory-arsenal.png',
      totalItems: 1000,
      floorPrice: '0.5 ETH',
      artist: 'Ultra Times Studios',
      mintPrice: '0.5 UOS',
      minted: 22,
      supply: 100,
    },
    {
      id: 2,
      name: 'Factory Artifact',
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
      name: 'Factory Characters',
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
            <h2 className='text-xl font-cabin font-semibold text-primary-300'>Featured Collections</h2>
            <div></div> {/* Empty div for flex spacing */}
          </div>
        </div>
      </div>

      {/* Collections Grid - New Layout based on the image */}
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {collections.map(collection => (
            <div key={collection.id} className='bg-dark-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300'>
              <div className='p-4'>
                <div className='mb-4'>
                  <img src={getAssetUrl(collection.image)} alt={collection.name} className='w-full h-48 object-cover rounded-lg' />
                </div>
                <h3 className='text-xl font-cabin font-bold mb-2 text-primary-300'>{collection.name}</h3>
                <p className='text-sm text-gray-400 mb-4'>by {collection.artist}</p>
                <p className='text-gray-300 mb-4 text-sm'>{collection.description}</p>

                <div className='flex justify-between items-center mb-4'>
                  <div>
                    <span className='text-gray-400 text-sm'>Mint Price:</span>
                    <span className='ml-2 text-primary-300 font-semibold'>{collection.mintPrice}</span>
                  </div>
                  <div className='flex items-center'>
                    <span className='text-gray-400 text-sm mr-2'>Total Supply:</span>
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
                  <span className='text-gray-400'>Total supply: {collection.supply}</span>
                </div>

                <Link to={`/collections/${collection.id}`} className='block w-full'>
                  <button className='w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200'>ACCESS AU MINT</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collection Categories */}
      <div className='container mx-auto px-4 py-8 mb-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-dark-800 p-6 rounded-xl'>
            <h3 className='text-xl font-cabin font-bold mb-4 text-primary-300'>Personnages</h3>
            <p className='text-gray-300 mb-4 text-sm'>Donec nec ante nisi. Vestibulum tincidunt lectus sed magna fringilla sagittis.</p>
            <Link to='/collections/personnages' className='text-primary-300 hover:text-primary-400 transition-colors text-sm'>
              View all →
            </Link>
          </div>

          <div className='bg-dark-800 p-6 rounded-xl'>
            <h3 className='text-xl font-cabin font-bold mb-4 text-primary-300'>Arsenal</h3>
            <p className='text-gray-300 mb-4 text-sm'>Morbi eget mattis vel felis sodales commodo tempor magna, tincidunt aliquet mauris.</p>
            <Link to='/collections/arsenal' className='text-primary-300 hover:text-primary-400 transition-colors text-sm'>
              View all →
            </Link>
          </div>

          <div className='bg-dark-800 p-6 rounded-xl'>
            <h3 className='text-xl font-cabin font-bold mb-4 text-primary-300'>Artifacts</h3>
            <p className='text-gray-300 mb-4 text-sm'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget nulla eu.</p>
            <Link to='/collections/artifacts' className='text-primary-300 hover:text-primary-400 transition-colors text-sm'>
              View all →
            </Link>
          </div>

          <div className='bg-dark-800 p-6 rounded-xl'>
            <h3 className='text-xl font-cabin font-bold mb-4 text-primary-300'>Power boosters</h3>
            <p className='text-gray-300 mb-4 text-sm'>Vivamus feugiat verius accumsan. Proin ac orci sed mattis ultricies.</p>
            <Link to='/collections/power-boosters' className='text-primary-300 hover:text-primary-400 transition-colors text-sm'>
              View all →
            </Link>
          </div>
        </div>
      </div>

      {/* Marketing Sections */}
      <div className='container mx-auto px-4 py-8 mb-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-dark-800 p-6 rounded-xl'>
            <h3 className='text-xl font-cabin font-bold mb-4 text-primary-300'>VIP Marketing</h3>
            <p className='text-gray-300 mb-4'>Info marketing sur la collection, les utilités, les grades, table...</p>
            <p className='text-primary-300 font-semibold'>All NFTs are in VIP</p>
          </div>

          <div className='flex items-center justify-center'>
            <img src='https://picsum.photos/400/300?random=10' alt='VIP Marketing' className='rounded-xl w-full h-48 object-cover' />
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8 mb-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='flex items-center justify-center'>
            <img src='https://picsum.photos/400/300?random=11' alt='VIP Marketing' className='rounded-xl w-full h-48 object-cover' />
          </div>

          <div className='bg-dark-800 p-6 rounded-xl'>
            <h3 className='text-xl font-cabin font-bold mb-4 text-primary-300'>VIP Marketing</h3>
            <p className='text-gray-300 mb-4'>Info marketing sur la collection, les utilités, les grades, table...</p>
            <p className='text-primary-300 font-semibold'>All NFTs are in VIP</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionsPage