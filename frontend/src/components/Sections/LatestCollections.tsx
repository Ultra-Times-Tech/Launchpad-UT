import {useState, useEffect} from 'react'
import MintCard from '../Card/MintCard'
import {useTranslation} from '../../hooks/useTranslation'
// Utils
import { getAssetUrl } from '../../utils/imageHelper'

interface FeaturedCollection {
  id: number
  name: string
  description: string
  image: string
  artist: string
}

interface MintActivity {
  id: number
  collectionName: string
  itemName: string
  price: string
  timestamp: string
  image: string
}

interface LatestCollectionsProps {
  latestCollections: FeaturedCollection[]
  mintActivities: MintActivity[]
}

function LatestCollections({latestCollections, mintActivities}: LatestCollectionsProps) {
  const [currentCollectionIndex, setCurrentCollectionIndex] = useState(0)
  const {t} = useTranslation()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCollectionIndex(current => (current + 1) % latestCollections.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [latestCollections.length])

  const currentCollection = latestCollections[currentCollectionIndex]

  return (
    <div className='container mx-auto px-4 py-12 mb-12'>
      <h2 className='text-2xl font-cabin font-bold mb-8 text-center text-primary-300'>{t('latest_collections')}</h2>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <div className='bg-dark-800 text-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300'>
            <div className='relative h-[300px] sm:h-[400px] lg:h-[500px]'>
              <img src={getAssetUrl(currentCollection.image)} alt={currentCollection.name} className='w-full h-full object-cover' />
              <div className='absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent flex items-end justify-center'>
                <div className='text-center p-4 sm:p-6 w-full'>
                  <h3 className='text-xl sm:text-2xl lg:text-3xl font-cabin font-bold mb-2 text-primary-300'>{currentCollection.name}</h3>
                  <p className='text-sm sm:text-base text-gray-300 mb-2 font-quicksand line-clamp-2 sm:line-clamp-none'>{currentCollection.description}</p>
                  <p className='text-xs sm:text-sm text-primary-300'>by {currentCollection.artist}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='h-[300px] sm:h-[400px] lg:h-[500px] bg-dark-900 rounded-2xl p-4 sm:p-6 backdrop-blur-sm bg-opacity-50 shadow-xl'>
          <h3 className='text-lg sm:text-xl font-cabin font-bold mb-4 sm:mb-6 text-primary-300 px-2'>{t('mint_activities')}</h3>
          <div className='space-y-4 h-[calc(100%-3rem)] sm:h-[calc(100%-3.5rem)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-transparent hover:scrollbar-thumb-primary-500/50'>
            {mintActivities.map(activity => (
              <MintCard key={activity.id} {...activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LatestCollections