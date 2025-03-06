import {Link} from 'react-router-dom'
import FeaturedCollectionCard, {FeaturedCollectionCardProps} from '../Card/FeaturedCollectionCard'

interface FeaturedCollectionsProps {
  collections: FeaturedCollectionCardProps[]
}

function FeaturedCollections({collections}: FeaturedCollectionsProps) {
  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-8'>
        <h2 className='text-2xl font-cabin font-bold text-primary-300 mb-4 sm:mb-0'>Featured Collections</h2>
        <Link to='/collections' className='text-gray-400 hover:text-white font-medium'>
          View all collections →
        </Link>
      </div>

      <div className='flex flex-nowrap overflow-x-auto sm:flex-wrap justify-between items-center mb-4 space-x-4 sm:space-x-6 pb-2 sm:pb-0'>
        <button className='text-white font-medium border-b-2 border-primary-500 whitespace-nowrap'>All</button>
        <button className='text-gray-400 hover:text-white whitespace-nowrap'>Art</button>
        <button className='text-gray-400 hover:text-white whitespace-nowrap'>Collectibles</button>
        <button className='text-gray-400 hover:text-white whitespace-nowrap'>Game Assets</button>
        <button className='text-gray-400 hover:text-white whitespace-nowrap'>Music</button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {collections.map(collection => (
          <FeaturedCollectionCard key={collection.id} {...collection} />
        ))}
      </div>

      <div className='flex justify-center mt-8'>
        <Link to='/collections'>
          <button className='bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200 text-sm'>LOAD MORE COLLECTIONS</button>
        </Link>
      </div>
    </div>
  )
}

export default FeaturedCollections