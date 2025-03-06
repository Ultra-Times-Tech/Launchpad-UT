import {Link} from 'react-router-dom'
import FeaturedCollectionCard, {FeaturedCollectionCardProps} from '../Card/FeaturedCollectionCard'

interface FeaturedCollectionsProps {
  collections: FeaturedCollectionCardProps[]
}

function FeaturedCollections({collections}: FeaturedCollectionsProps) {
  return (
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

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
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