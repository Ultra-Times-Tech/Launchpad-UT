import {Link} from 'react-router-dom'
import {getAssetUrl} from '../../utils/imageHelper'
import {useTranslation} from '../../hooks/useTranslation'

export interface CollectionCardProps {
  id: number
  name: string
  description: string
  category: string
  image: string
  artist: string
  totalItems: number
  floorPrice: string
}

function CollectionCard({id, name, description, image, artist}: CollectionCardProps) {
  const {t} = useTranslation()

  return (
    <div className='h-[450px] bg-dark-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 flex flex-col select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
      <div className='relative h-48 flex-shrink-0 select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
        <img src={getAssetUrl(image)} alt={name} className='w-full h-full object-cover select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', pointerEvents: 'none'}} />
      </div>

      <div className='p-4 flex flex-col h-[258px] select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
        <h3 className='text-xl font-cabin font-bold mb-2 text-primary-300 line-clamp-1 select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
          {name}
        </h3>
        <p className='text-sm text-gray-400 mb-4 line-clamp-1 select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
          {t('by')} {artist}
        </p>
        <p className='text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
          {description}
        </p>

        <Link to={`/collection/${id}`} className='mt-auto block w-full select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
          <button className='w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
            {t('view_collection')}
          </button>
        </Link>
      </div>
    </div>
  )
}

export default CollectionCard