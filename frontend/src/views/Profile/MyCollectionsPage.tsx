import {useState} from 'react'
import {Link} from 'react-router-dom'

interface Collection {
  id: number
  name: string
  image: string
  itemCount: number
  floorPrice: string
  lastMinted: string
}

function MyCollectionsPage() {
  const [collections] = useState<Collection[]>([
    {
      id: 1,
      name: 'Vox-in-Time #156',
      image: 'https://picsum.photos/400/400?random=1',
      itemCount: 3,
      floorPrice: '0.5 UOS',
      lastMinted: '2 days ago',
    },
    {
      id: 2,
      name: 'Ultra Street-Cubism #89',
      image: 'https://picsum.photos/400/400?random=2',
      itemCount: 1,
      floorPrice: '0.8 UOS',
      lastMinted: '5 days ago',
    },
    {
      id: 3,
      name: 'Crypto Punks #2234',
      image: 'https://picsum.photos/400/400?random=3',
      itemCount: 2,
      floorPrice: '1.2 UOS',
      lastMinted: '1 week ago',
    },
  ])

  return (
    <div className='min-h-screen bg-dark-950 text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex justify-between items-center mb-8'>
            <h1 className='text-3xl font-bold text-primary-300'>My Collections</h1>
            <Link to='/collections' className='px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors'>
              Browse Collections
            </Link>
          </div>

          {collections.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {collections.map(collection => (
                <div key={collection.id} className='bg-dark-800 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300'>
                  <div className='relative h-48'>
                    <img src={collection.image} alt={collection.name} className='w-full h-full object-cover' />
                    <div className='absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent'></div>
                    <div className='absolute bottom-4 left-4'>
                      <h3 className='text-lg font-semibold text-white'>{collection.name}</h3>
                    </div>
                  </div>
                  <div className='p-4'>
                    <div className='flex justify-between items-center mb-4'>
                      <div className='text-sm'>
                        <span className='text-gray-400'>Items: </span>
                        <span className='text-primary-300'>{collection.itemCount}</span>
                      </div>
                      <div className='text-sm'>
                        <span className='text-gray-400'>Floor: </span>
                        <span className='text-primary-300'>{collection.floorPrice}</span>
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs text-gray-400'>Last minted {collection.lastMinted}</span>
                      <Link to={`/collection/${collection.id}`} className='text-primary-300 hover:text-primary-400 text-sm font-medium'>
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-12 bg-dark-800 rounded-xl'>
              <div className='w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                </svg>
              </div>
              <h2 className='text-xl font-semibold mb-2'>No Collections Yet</h2>
              <p className='text-gray-400 mb-6'>Start building your collection by minting new items</p>
              <Link to='/collections' className='px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors inline-block'>
                Browse Collections
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyCollectionsPage