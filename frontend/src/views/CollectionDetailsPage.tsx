import {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import {getAssetUrl} from '../utils/imageHelper'
import FactoryCard from '../components/Card/FactoryCard'
import {CollectionDetailsProps} from '../types/collection.types'
import {collectionsService} from '../services/collections.service'
import {getMockCollection} from '../data/collections.data'
import {useTranslation} from '../hooks/useTranslation'
// AOS
import AOS from 'aos'
import 'aos/dist/aos.css'

function CollectionDetailsPage() {
  const {id} = useParams<{id: string}>()
  const [collection, setCollection] = useState<CollectionDetailsProps | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'story' | 'features'>('story')
  const {t} = useTranslation()

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    })
  }, [])

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true)
      try {
        if (!id) throw new Error('Collection ID is required')
        
        const collectionDetails = await collectionsService.getCollectionDetails(id)
        
        if (collectionDetails) {
          setCollection(collectionDetails)
          setError(null)
        } else {
          throw new Error('Collection not found')
        }
      } catch (error) {
        console.error('Error fetching collection:', error)
        setError('Failed to load collection. Please try again later.')
        
        if (id) {
          const mockCollection = getMockCollection(Number(id))
          setCollection(mockCollection)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCollection()
  }, [id])

  if (loading) {
    return (
      <div className='min-h-screen bg-dark-950 text-white flex items-center justify-center'>
        <div className='flex flex-col items-center'>
          <div className='w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin'></div>
          <p className='mt-4 text-xl'>{t('loading_collection')}</p>
        </div>
      </div>
    )
  }

  if (error && !collection) {
    return (
      <div className='min-h-screen bg-dark-950 text-white flex flex-col items-center justify-center'>
        <h2 className='text-2xl font-bold text-red-500 mb-4'>Error</h2>
        <p className='mb-6 text-gray-300'>{error}</p>
        <Link to='/collections' className='bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200'>
          Back to Collections
        </Link>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className='min-h-screen bg-dark-950 text-white flex flex-col items-center justify-center'>
        <h2 className='text-2xl font-bold mb-4'>Collection Not Found</h2>
        <p className='mb-6'>The collection you're looking for doesn't exist or has been removed.</p>
        <Link to='/collections' className='bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200'>
          Back to Collections
        </Link>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white'>
      {/* Hero Banner */}
      <div className='relative h-96 w-full' data-aos="fade-down">
        <img src={getAssetUrl(collection.image)} alt={collection.name} className='w-full h-full object-cover' />
        <div className='absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent flex flex-col items-center justify-end pb-12'>
          <h1 className='text-5xl font-bold mb-4 text-center text-primary-300'>{collection.name}</h1>
          <div className='flex items-center space-x-4 mb-4'>
            <span className='bg-primary-600 px-3 py-1 rounded-full text-sm font-semibold'>{collection.totalItems} Items</span>
            <span className='bg-green-600 px-3 py-1 rounded-full text-sm font-semibold'>Floor: {collection.floorPrice}</span>
          </div>
          <p className='text-sm text-gray-300'>{t('by')} {collection.creator}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className='bg-dark-800 py-4 sticky top-0 z-10 shadow-lg' data-aos="fade-up">
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center'>
            <Link to='/collections' className='text-white hover:text-primary-300 transition'>
              ← Back to Collections
            </Link>
            <div className='flex space-x-6'>
              <button onClick={() => setActiveTab('story')} className={`px-4 py-2 rounded-lg transition ${activeTab === 'story' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                Story
              </button>
              <button onClick={() => setActiveTab('features')} className={`px-4 py-2 rounded-lg transition ${activeTab === 'features' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                Features
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12'>
        {/* Collection Info */}
        <div className='bg-dark-800 rounded-xl p-8 mb-12' data-aos="fade-up" data-aos-delay="200">
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='md:col-span-3'>
              <h2 className='text-2xl font-bold mb-4 text-primary-300'>About {collection.name}</h2>
              <p className='text-gray-300 mb-6'>{collection.description}</p>

              {activeTab === 'features' && (
                <div className='mb-6' data-aos="fade-up" data-aos-delay="300">
                  <h3 className='text-xl font-bold mb-3 text-primary-300'>Features</h3>
                  <ul className='list-disc pl-5 text-gray-300 space-y-2'>
                    {collection.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className='grid grid-cols-2 gap-4 mt-6' data-aos="fade-up" data-aos-delay="400">
                <div>
                  <h3 className='text-gray-400 text-sm'>Creator</h3>
                  <p className='font-semibold text-white'>{collection.creator}</p>
                </div>
                <div>
                  <h3 className='text-gray-400 text-sm'>Release Date</h3>
                  <p className='font-semibold text-white'>{collection.releaseDate}</p>
                </div>
                <div>
                  <h3 className='text-gray-400 text-sm'>Total Items</h3>
                  <p className='font-semibold text-white'>{collection.totalItems}</p>
                </div>
                <div>
                  <h3 className='text-gray-400 text-sm'>Floor Price</h3>
                  <p className='font-semibold text-green-400'>{collection.floorPrice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Factories Section */}
        <div className='mb-12'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {collection.factories.map((factory, index) => (
              <div key={factory.id} data-aos="fade-up" data-aos-delay={500 + index * 100}>
                <FactoryCard 
                  id={factory.id} 
                  collectionId={collection.id} 
                  name={factory.name} 
                  description={factory.description} 
                  image={factory.image} 
                  mintPrice={factory.mintPrice} 
                  supply={factory.supply} 
                  minted={factory.minted} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Sections */}
        <div className='container mx-auto px-4 py-8 mb-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='bg-dark-800 p-6 rounded-xl' data-aos="fade-right" data-aos-delay="600">
              <h3 className='text-xl font-bold mb-4 text-primary-300'>Street Art Reimagined</h3>
              <p className='text-gray-300 mb-4'>Experience the perfect fusion of street art and cubism, where each piece tells a unique story through geometric forms and vibrant colors. A groundbreaking collection that redefines the boundaries of digital art.</p>
              <p className='text-primary-300 font-semibold'>Limited edition of 2 unique pieces</p>
            </div>

            <div className='flex items-center justify-center' data-aos="fade-left" data-aos-delay="700">
              <img src={getAssetUrl('/banners/factory-1.png')} alt='Dark Wisdom Counsellor' className='rounded-xl w-full h-48 object-cover' />
            </div>
          </div>
        </div>

        <div className='container mx-auto px-4 py-8 mb-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='flex items-center justify-center' data-aos="fade-right" data-aos-delay="800">
              <img src={getAssetUrl('/banners/phygital.png')} alt='Phygital Voucher' className='rounded-xl w-full h-48 object-cover' />
            </div>

            <div className='bg-dark-800 p-6 rounded-xl' data-aos="fade-left" data-aos-delay="900">
              <h3 className='text-xl font-bold mb-4 text-primary-300'>Exclusivity & Rarity</h3>
              <p className='text-gray-300 mb-4'>Each piece in the collection is a unique artwork signed by C-la. Take advantage of an exceptional opportunity with our special raffle system: for every 5 UniQ purchased, you have a chance to win a rare ViT UniQ from the UT Collection.</p>
              <p className='text-primary-300 font-semibold'>Physical artwork conversion available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionDetailsPage 