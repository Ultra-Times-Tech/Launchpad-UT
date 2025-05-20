// Hooks
import {useCollections} from '../hooks/useCollections'
import {useTranslation} from '../hooks/useTranslation'
// Components
import Slider from '../components/Slider/Slider'
import FeaturedCollections from '../components/Sections/FeaturedCollections'
import LatestCollections from '../components/Sections/LatestCollections'
import TrendingCollections from '../components/Sections/TrendingCollections'
import Newsletter from '../components/Sections/Newsletter'
// Data
import {mintActivities} from '../data/collections.data'
// Types
import {Collection} from '../types/collection.types'

function HomePage() {
  const {featuredCollections, trendingCollections, allCollections, loading, error} = useCollections()
  const {t} = useTranslation()

  if (loading) {
    return (
      <div className='min-h-screen bg-dark-950 text-white flex items-center justify-center'>
        <div className='flex flex-col items-center'>
          <div className='w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin'></div>
          <p className='mt-4 text-xl font-cabin'>{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-dark-950 text-white flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-500 mb-4'>Error</h2>
          <p className='text-gray-300'>{error}</p>
        </div>
      </div>
    )
  }

  const latestCollections = allCollections.slice(0, 5).map((collection: Collection) => ({
    id: collection.attributes.id,
    name: collection.attributes.name,
    description: 'Collection from Ultra Times ecosystem',
    image: collection.attributes.image || 'https://picsum.photos/800/500?random=1',
    artist: 'Ultra Times'
  }))

  return (
    <div className='bg-dark-950 text-white'>
      <Slider title={t('slider_title')} description={t('slider_description')} buttonText={t('slider_button')} />
      <FeaturedCollections collections={featuredCollections} />
      <LatestCollections latestCollections={latestCollections} mintActivities={mintActivities} />
      <TrendingCollections collections={trendingCollections} />
      <Newsletter />
    </div>
  )
}

export default HomePage