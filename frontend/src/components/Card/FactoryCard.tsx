import { Link } from 'react-router-dom'

export interface FactoryCardProps {
  id: number
  collectionId: number
  name: string
  description: string
  image: string
  mintPrice: string
  supply: number
  minted: number
}

function FactoryCard({ id, collectionId, name, description, image, mintPrice, supply, minted }: FactoryCardProps) {
  return (
    <div className="bg-dark-800 rounded-xl overflow-hidden">
      <div className="relative h-40">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent"></div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-primary-300">{name}</h3>
        <p className="text-sm text-gray-300 mb-4">{description}</p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">Mint Price:</span>
          <span className="text-primary-300 font-semibold">{mintPrice}</span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">Total Supply:</span>
          <span className="text-white font-semibold">{supply}</span>
        </div>
        
        <div className="w-full bg-dark-700 rounded-full h-2.5 mb-2">
          <div 
            className="bg-primary-500 h-2.5 rounded-full" 
            style={{ width: `${(minted / supply) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mb-4 text-sm">
          <span className="text-gray-400">{minted} minted</span>
          <span className="text-gray-400">Total: {supply}</span>
        </div>
        
        <Link to={`/mint/${id}/${collectionId}`} className="block w-full">
          <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
            ACCÈS AU MINT
          </button>
        </Link>
      </div>
    </div>
  )
}

export default FactoryCard