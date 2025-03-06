import {Link} from 'react-router-dom'
import {getAssetUrl} from '../../utils/imageHelper'

export interface FeaturedCollectionCardProps {
  id: number
  name: string
  description: string
  image: string
  artist: string
  date: string
  totalItems: number
  floorPrice: string
  comingSoon?: boolean
}

function FeaturedCollectionCard({id, name, description, image, artist, date, comingSoon = false}: FeaturedCollectionCardProps) {
  return (
    <div className='bg-dark-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 flex flex-col h-full'>
      <div className='relative'>
        <img src={getAssetUrl(image)} alt={name} className='w-full h-48 object-cover' />
      </div>

      <div className='p-4 flex flex-col flex-grow'>
        <div className='flex justify-between items-center mb-2'>
          <h3 className='text-lg font-cabin font-bold text-primary-300'>{name}</h3>
          <span className='text-xs text-gray-400'>{date}</span>
        </div>

        <div className='flex items-center text-xs text-gray-400 mb-3'>
          <span>{artist}</span>
        </div>

        <p className='text-gray-300 text-sm mb-4 line-clamp-2'>{description}</p>

        <div className='mt-auto'>
          <Link to={`/collection/${id}`} className='block w-full'>
            <button className={`w-full font-medium py-2 px-4 rounded-lg transition duration-200 text-sm ${comingSoon ? 'bg-primary-700 text-white cursor-default' : 'bg-primary-500 hover:bg-primary-700 text-white'}`}>{comingSoon ? 'COMING SOON' : 'ACCÈS AU MINT'}</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FeaturedCollectionCard