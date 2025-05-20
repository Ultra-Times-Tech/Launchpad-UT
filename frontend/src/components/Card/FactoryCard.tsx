import {Link} from 'react-router-dom'
import {getAssetUrl} from '../../utils/imageHelper'
import {useTranslation} from '../../hooks/useTranslation'

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

function FactoryCard({id, collectionId, name, description, image, mintPrice, supply, minted}: FactoryCardProps) {
  const {t} = useTranslation()

  return (
    <div className='bg-dark-800 rounded-xl overflow-hidden'>
      <div className='relative h-40'>
        <img src={getAssetUrl(image)} alt={name} className='w-full h-full object-cover' />
      </div>

      <div className='p-4'>
        <h3 className='text-xl font-bold text-primary-300 mb-2'>{name}</h3>
        <p className='text-sm text-gray-300 mb-4 line-clamp-2'>{description}</p>

        <div className='space-y-2 mb-4'>
          <div className='flex items-center justify-end space-x-1 text-sm'>
            <span className='text-gray-400'>{t('mint_price')}</span>
            <span className='text-primary-300 font-medium'>{mintPrice}</span>
          </div>

          <div className='w-full bg-dark-700 rounded-full h-2'>
            <div className='bg-primary-500 h-2 rounded-full' style={{width: `${(minted / supply) * 100}%`}}></div>
          </div>

          <div className='flex justify-between text-sm'>
            <span className='text-gray-400'>{minted} {t('minted')}</span>
            <span className='text-gray-400'>{t('total_supply')} {supply}</span>
          </div>
        </div>

        <Link to={`/mint/${id}/${collectionId}`} className='block w-full'>
          <button className='w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200'>{t('mint_access')}</button>
        </Link>
      </div>
    </div>
  )
}

export default FactoryCard