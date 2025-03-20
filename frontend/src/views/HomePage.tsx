// Hooks
import {useCollections, latestCollections, mintActivities, trendingCollections} from '../hooks/useCollections'
import { useTranslation } from '../hooks/useTranslation'
// Components
import Slider from '../components/Slider/Slider'
import FeaturedCollections from '../components/Sections/FeaturedCollections'
import LatestCollections from '../components/Sections/LatestCollections'
import TrendingCollections from '../components/Sections/TrendingCollections'
import Newsletter from '../components/Sections/Newsletter'

function HomePage() {
  const {featuredCollections, loading, error} = useCollections()
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className='min-h-screen bg-dark-950 text-white flex items-center justify-center'>
        <div className='flex flex-col items-center'>
          <div className='w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin'></div>
          <p className='mt-4 text-xl font-cabin'>Loading content...</p>
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

  return (
    <div className='bg-dark-950 text-white'>
      <Slider 
        title={t('slider_title')} 
        description={t('slider_description')} 
        buttonText={t('slider_button')} 
        onButtonClick={() => console.log('Button clicked')} 
      />
      <FeaturedCollections collections={featuredCollections} />
      <LatestCollections latestCollections={latestCollections} mintActivities={mintActivities} />
      <TrendingCollections collections={trendingCollections} />
      <Newsletter />
    </div>
  )
}

export default HomePage