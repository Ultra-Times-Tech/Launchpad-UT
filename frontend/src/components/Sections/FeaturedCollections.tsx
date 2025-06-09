import {Link} from 'react-router-dom'
import FeaturedCollectionCard, {FeaturedCollectionCardProps} from '../Card/FeaturedCollectionCard'
import {useTranslation} from '../../hooks/useTranslation'
import {AppRouteKey} from '../../contexts/TranslationContext'

interface FeaturedCollectionsProps {
  collections: FeaturedCollectionCardProps[]
}

function FeaturedCollections({collections}: FeaturedCollectionsProps) {
  const {t, generateLocalizedPath} = useTranslation()

  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='flex justify-between items-center mb-8' data-aos="fade-down">
        <h2 className='text-2xl font-cabin font-bold text-primary-300 before:bg-[url("https://ultratimes.io/images/logo/logo_UT_icon-2.png")]'>{t('featured_collections')}</h2>
        <Link to={generateLocalizedPath('collections' as AppRouteKey)} className='text-gray-400 hover:text-white font-medium hidden sm:block'>
          {t('view_all_collections')} →
        </Link>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {collections.map((collection, index) => (
          <div key={collection.id} data-aos="fade-up" data-aos-delay={index * 100}>
            <FeaturedCollectionCard {...collection} />
          </div>
        ))}
      </div>

      <div className='flex justify-center mt-8' data-aos="fade-up">
        <Link to={generateLocalizedPath('collections' as AppRouteKey)}>
          <button className='bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200 text-sm'>{t('load_more_collections')}</button>
        </Link>
      </div>
    </div>
  )
}

export default FeaturedCollections