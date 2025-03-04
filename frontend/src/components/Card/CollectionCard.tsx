import { Link } from 'react-router-dom'
import { getAssetUrl } from '../../utils/imageHelper'

export interface CollectionCardProps {
  id: number
  name: string
  description: string
  image: string
  artist: string
  totalItems: number
  floorPrice: string
}

function CollectionCard({ id, name, description, image, artist, totalItems, floorPrice }: CollectionCardProps) {
  return (
    <div className="bg-dark-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
      <div className="relative">
        <img 
          src={getAssetUrl(image)} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-900 to-transparent p-4">
          <div className="flex items-center space-x-2">
            <span className="bg-primary-600/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
              {totalItems} Items
            </span>
            <span className="bg-green-600/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
              Floor: {floorPrice}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-cabin font-bold mb-2 text-primary-300">{name}</h3>
        <p className="text-sm text-gray-400 mb-4">by {artist}</p>
        <p className="text-gray-300 mb-6 text-sm line-clamp-2">{description}</p>
        
        <Link to={`/collection/${id}`} className="block w-full">
          <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
            VIEW COLLECTION
          </button>
        </Link>
      </div>
    </div>
  )
}

export default CollectionCard