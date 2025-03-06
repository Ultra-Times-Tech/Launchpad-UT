import {useState, useEffect} from 'react'
import Mint from '../Card/MintActivity'

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCollectionIndex(current => (current + 1) % latestCollections.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [latestCollections.length])

  const currentCollection = latestCollections[currentCollectionIndex]

  return (
    <div className='container mx-auto px-4 py-12 mb-12'>
      <h2 className='text-2xl font-cabin font-bold mb-8 text-center text-primary-300'>Latest Collections</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='md:col-span-2'>
          <div className='bg-dark-800 text-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300'>
            <div className='relative' style={{height: '500px'}}>
              <img src={currentCollection.image} alt={currentCollection.name} className='w-full h-full object-cover' />
              <div className='absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent flex items-end justify-center'>
                <div className='text-center p-6 w-full'>
                  <h3 className='text-2xl md:text-3xl font-cabin font-bold mb-2 text-primary-300'>{currentCollection.name}</h3>
                  <p className='text-gray-300 mb-2 font-quicksand'>{currentCollection.description}</p>
                  <p className='text-sm text-primary-300'>by {currentCollection.artist}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='h-[500px] bg-dark-900 rounded-2xl p-6 backdrop-blur-sm bg-opacity-50 shadow-xl'>
          <h3 className='text-xl font-cabin font-bold mb-6 text-primary-300 px-2'>Mint Activities</h3>
          <div className='space-y-4 h-[calc(100%-3.5rem)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-transparent hover:scrollbar-thumb-primary-500/50'>
            {mintActivities.map(activity => (
              <Mint key={activity.id} {...activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LatestCollections