import {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import Mint from '../components/Card/MintActivity'

interface MintItem {
  id: number
  name: string
  image: string
  price: string
  timestamp: string
}

interface MintPhase {
  name: string
  active: boolean
  date: string
}

interface Factory {
  id: number
  name: string
  description: string
  mintPrice: string
  supply: number
  minted: number
  collectionName: string
}

function MintPage() {
  const {category, id} = useParams<{category: string; id: string}>()
  const [loading, setLoading] = useState(true)
  const [factory, setFactory] = useState<Factory | null>(null)
  const [mintedItems, setMintedItems] = useState<MintItem[]>([])
  const [phases, setPhases] = useState<MintPhase[]>([])
  const [mintAmount, setMintAmount] = useState(1)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        setTimeout(() => {
          const factoryNames: Record<string, string> = {
            '1': 'Personnages',
            '2': 'Arsenal',
            '3': 'Artifacts',
            '4': 'Power boosters',
          }

          const collectionNames: Record<string, string> = {
            '1': 'Vox-in-Time',
            '2': 'Ultra Street-Cubism Discover',
            '3': 'Crypto Punks Edition',
          }

          setFactory({
            id: Number(category),
            name: factoryNames[category || '1'] || 'Personnages',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.',
            mintPrice: '0.5 UOS',
            supply: 100,
            minted: 45,
            collectionName: collectionNames[id || '1'] || 'Vox-in-Time',
          })

          setPhases([
            {name: 'Phase private', active: true, date: 'Public: 11 janvier 2025'},
            {name: 'Phase private', active: false, date: 'Public: 11 janvier 2025'},
            {name: 'Phase publique', active: false, date: 'Public: 21 mars 2025'},
          ])

          setMintedItems([
            {id: 1, name: 'Personnage #45', image: 'https://picsum.photos/200/200?random=1', price: '0.5 UOS', timestamp: '2 minutes ago'},
            {id: 2, name: 'Personnage #46', image: 'https://picsum.photos/200/200?random=2', price: '0.5 UOS', timestamp: '5 minutes ago'},
            {id: 3, name: 'Personnage #47', image: 'https://picsum.photos/200/200?random=3', price: '0.5 UOS', timestamp: '8 minutes ago'},
            {id: 4, name: 'Personnage #48', image: 'https://picsum.photos/200/200?random=4', price: '0.5 UOS', timestamp: '12 minutes ago'},
            {id: 5, name: 'Personnage #49', image: 'https://picsum.photos/200/200?random=5', price: '0.5 UOS', timestamp: '15 minutes ago'},
            {id: 6, name: 'Personnage #50', image: 'https://picsum.photos/200/200?random=6', price: '0.5 UOS', timestamp: '18 minutes ago'},
            {id: 7, name: 'Personnage #51', image: 'https://picsum.photos/200/200?random=7', price: '0.5 UOS', timestamp: '20 minutes ago'},
            {id: 8, name: 'Personnage #52', image: 'https://picsum.photos/200/200?random=8', price: '0.5 UOS', timestamp: '25 minutes ago'},
          ])

          setLoading(false)
        }, 800)
      } catch (error) {
        console.error('Error loading mint data:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [category, id])

  const handleMint = () => {
    alert(`Minting ${mintAmount} items for ${parseFloat(factory?.mintPrice || '0') * mintAmount} UOS`)
  }

  const incrementMintAmount = () => {
    if (factory && mintAmount < factory.supply - factory.minted) {
      setMintAmount(mintAmount + 1)
    }
  }

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1)
    }
  }

  if (loading || !factory) {
    return (
      <div className='min-h-screen bg-dark-950 text-white flex items-center justify-center'>
        <div className='flex flex-col items-center'>
          <div className='w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin'></div>
          <p className='mt-4 text-xl'>Loading mint page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white'>
      {/* Hero Banner */}
      <div className='relative h-80 w-full'>
        <img src='https://picsum.photos/1920/600?random=5' alt='Mint Banner' className='w-full h-full object-cover' />
        <div className='absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent flex flex-col items-center justify-center'>
          <h1 className='text-5xl font-cabin font-bold mb-4 text-primary-300'>{factory.name}</h1>
          <p className='text-xl max-w-2xl text-center font-quicksand'>from {factory.collectionName} by Ultra Times</p>
        </div>
      </div>

      {/* Navigation Breadcrumb */}
      <div className='bg-dark-900 py-4 border-b border-dark-700'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center text-sm'>
            <Link to='/' className='text-gray-400 hover:text-primary-300 transition-colors'>
              Homepage
            </Link>
            <span className='mx-2 text-gray-600'>/</span>
            <Link to={`/collection/${id}`} className='text-gray-400 hover:text-primary-300 transition-colors'>
              Collection {factory.collectionName}
            </Link>
            <span className='mx-2 text-gray-600'>/</span>
            <span className='text-primary-300'>{factory.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Left Column - Image */}
          <div className='bg-dark-800 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm border border-dark-700'>
            <div className='aspect-w-1 aspect-h-1 w-full'>
              <img src='https://picsum.photos/600/600?random=10' alt={factory.name} className='w-full h-full object-cover' />
            </div>
          </div>

          {/* Right Column - Mint Info */}
          <div className='bg-dark-800 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-dark-700'>
            {/* Progress Bar */}
            <div className='mb-6'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-gray-300 font-medium'>Mint Progress</span>
                <span className='text-primary-300 font-medium'>
                  {factory.minted}/{factory.supply}
                </span>
              </div>
              <div className='w-full bg-dark-700 rounded-full h-3 mb-2'>
                <div className='bg-gradient-to-r from-primary-400 to-primary-600 h-3 rounded-full transition-all duration-500' style={{width: `${(factory.minted / factory.supply) * 100}%`}}></div>
              </div>
              <div className='text-center text-gray-400 text-sm mt-2'>
                <span className='bg-primary-600/30 text-primary-300 px-3 py-1 rounded-full text-xs font-medium'>Phase private active</span>
              </div>
            </div>

            {/* Mint Amount Selector */}
            <div className='bg-dark-700/50 rounded-xl p-5 mb-6 backdrop-blur-sm border border-dark-600'>
              <div className='flex justify-between items-center mb-4'>
                <span className='text-gray-300 font-medium'>Mint Amount</span>
                <div className='flex items-center space-x-3'>
                  <button onClick={decrementMintAmount} className='w-8 h-8 flex items-center justify-center bg-dark-600 hover:bg-dark-500 rounded-lg text-white transition-colors'>
                    -
                  </button>
                  <span className='text-white font-bold text-lg w-8 text-center'>{mintAmount}</span>
                  <button onClick={incrementMintAmount} className='w-8 h-8 flex items-center justify-center bg-dark-600 hover:bg-dark-500 rounded-lg text-white transition-colors'>
                    +
                  </button>
                </div>
              </div>

              <div className='flex justify-between items-center mb-4'>
                <span className='text-gray-400'>Price per item:</span>
                <span className='text-primary-300 font-medium'>{factory.mintPrice}</span>
              </div>

              <div className='flex justify-between items-center mb-4'>
                <span className='text-gray-400'>Total price:</span>
                <span className='text-primary-300 font-bold text-xl'>{parseFloat(factory.mintPrice) * mintAmount} UOS</span>
              </div>

              <button onClick={handleMint} className='w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 shadow-lg transform hover:translate-y-[-2px]'>
                MINT NOW
              </button>
            </div>

            {/* Mint Phases */}
            <div className='bg-dark-700/50 rounded-xl p-5 mb-6 backdrop-blur-sm border border-dark-600'>
              <h3 className='font-bold text-lg text-primary-300 mb-4'>Mint Phases</h3>
              <div className='space-y-4'>
                {phases.map((phase, index) => (
                  <div key={index} className='flex items-center'>
                    <div className={`w-4 h-4 rounded-full mr-3 ${phase.active ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                    <div>
                      <h4 className={`font-medium ${phase.active ? 'text-white' : 'text-gray-400'}`}>{phase.name}</h4>
                      <p className='text-gray-400 text-sm'>{phase.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Marketing Info */}
            <div className='bg-dark-700/50 rounded-xl p-5 backdrop-blur-sm border border-dark-600'>
              <h3 className='font-bold text-lg text-primary-300 mb-2'>Details</h3>
              <p className='text-gray-300 text-sm'>{factory.description}</p>
            </div>
          </div>
        </div>

        {/* Marketing & Roadmap Section */}
        <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-dark-800 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-dark-700 transform hover:translate-y-[-2px] transition-all duration-300'>
            <div className='relative h-48 mb-4 rounded-lg overflow-hidden'>
              <img src='https://picsum.photos/500/300?random=20' alt='Marketing' className='w-full h-full object-cover' />
              <div className='absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent'></div>
            </div>
            <h3 className='text-xl font-bold text-primary-300 mb-2'>Exclusive Benefits</h3>
            <p className='text-gray-300'>Discover the exclusive benefits reserved for holders of this factory.</p>
          </div>

          <div className='bg-dark-800 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-dark-700 transform hover:translate-y-[-2px] transition-all duration-300'>
            <h3 className='text-xl font-bold text-primary-300 mb-4'>Roadmap</h3>
            <div className='relative pl-8 before:content-[""] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary-600'>
              <div className='mb-6 relative'>
                <div className='absolute left-[-30px] top-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>1</span>
                </div>
                <h4 className='text-white font-bold mb-1'>Collection Launch</h4>
                <p className='text-gray-400 text-sm'>January 2025</p>
              </div>
              <div className='mb-6 relative'>
                <div className='absolute left-[-30px] top-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>2</span>
                </div>
                <h4 className='text-white font-bold mb-1'>Game Integration</h4>
                <p className='text-gray-400 text-sm'>March 2025</p>
              </div>
              <div className='mb-6 relative'>
                <div className='absolute left-[-30px] top-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>3</span>
                </div>
                <h4 className='text-white font-bold mb-1'>Exclusive Events</h4>
                <p className='text-gray-400 text-sm'>June 2025</p>
              </div>
              <div className='relative'>
                <div className='absolute left-[-30px] top-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>4</span>
                </div>
                <h4 className='text-white font-bold mb-1'>New Features</h4>
                <p className='text-gray-400 text-sm'>September 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Minted Section */}
        <div className='mt-12'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-primary-300'>Recently Minted</h2>
            <button className='text-primary-300 hover:text-primary-400 text-sm font-medium'>View all →</button>
          </div>
          <div className='space-y-4'>
            {mintedItems.map(item => (
              <Mint key={item.id} {...item} collectionName={factory.collectionName} itemName={factory.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MintPage