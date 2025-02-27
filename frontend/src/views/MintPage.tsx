import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

interface MintItem {
  id: number
  name: string
  image: string
}

interface MintPhase {
  name: string
  active: boolean
  date: string
}

function MintPage() {
  const { category, id } = useParams<{ category: string; id: string }>()
  const [loading, setLoading] = useState(true)
  const [categoryName, setCategoryName] = useState('')
  const [mintedItems, setMintedItems] = useState<MintItem[]>([])
  const [collectionName, setCollectionName] = useState('')
  const [mintPrice, setMintPrice] = useState('0.5 UOS')
  const [phases, setPhases] = useState<MintPhase[]>([])

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          // Set category name based on the category param
          const categoryNames: Record<string, string> = {
            '1': 'Personnages',
            '2': 'Arsenal',
            '3': 'Artifacts',
            '4': 'Power boosters'
          }
          
          setCategoryName(categoryNames[category || '1'] || 'Personnages')
          
          // Set collection name based on the id param
          const collectionNames: Record<string, string> = {
            '1': 'Vox-in-Time',
            '2': 'Ultra Street-Cubism Discover',
            '3': 'Crypto Punks Edition'
          }
          
          setCollectionName(collectionNames[id || '1'] || 'Vox-in-Time')
          
          // Set mint price
          setMintPrice('0.5 UOS')
          
          // Set phases
          setPhases([
            { name: 'Phase private', active: true, date: 'Public: 11 janvier 2025' },
            { name: 'Phase private', active: false, date: 'Public: 11 janvier 2025' },
            { name: 'Phase publique', active: false, date: 'Public: 21 mars 2025' }
          ])
          
          // Set minted items
          setMintedItems([
            { id: 1, name: 'Personnage #45', image: 'https://picsum.photos/200/200?random=1' },
            { id: 2, name: 'Personnage #46', image: 'https://picsum.photos/200/200?random=2' },
            { id: 3, name: 'Personnage #47', image: 'https://picsum.photos/200/200?random=3' },
            { id: 4, name: 'Personnage #48', image: 'https://picsum.photos/200/200?random=4' }
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
    alert('Mint functionality would be implemented here')
  }

  if (loading) {
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
      {/* Navigation Breadcrumb */}
      <div className='bg-dark-900 py-4 border-b border-dark-700'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center text-sm'>
            <Link to='/' className='text-gray-400 hover:text-primary-300 transition-colors'>
              Main Page
            </Link>
            <span className='mx-2 text-gray-600'>/</span>
            <Link to={`/collection/${id}`} className='text-gray-400 hover:text-primary-300 transition-colors'>
              Collection {collectionName}
            </Link>
            <span className='mx-2 text-gray-600'>/</span>
            <span className='text-primary-300'>{categoryName}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-primary-300 mb-2'>{categoryName}</h1>
          <p className='text-gray-400'>by Ultra Times</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Left Column - Image */}
          <div className='bg-dark-800 rounded-lg overflow-hidden'>
            <div className='aspect-w-1 aspect-h-1 w-full'>
              <img 
                src='https://picsum.photos/600/600?random=10' 
                alt={categoryName} 
                className='w-full h-full object-cover'
              />
            </div>
          </div>

          {/* Right Column - Mint Info */}
          <div className='bg-dark-800 rounded-lg p-6'>
            {/* Progress Bar */}
            <div className='mb-6'>
              <div className='w-full bg-gray-700 rounded-full h-2.5 mb-2'>
                <div className='bg-primary-500 h-2.5 rounded-full' style={{width: '45%'}}></div>
              </div>
              <div className='text-center text-gray-400 text-sm'>Phase private</div>
            </div>

            {/* Price and Mint Button */}
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center'>
                <span className='text-gray-400 mr-2'>Prix:</span>
                <span className='text-primary-300 font-bold text-xl'>{mintPrice}</span>
              </div>
              <button 
                onClick={handleMint}
                className='bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-8 rounded-lg transition duration-200'
              >
                Mint
              </button>
            </div>

            {/* Mint Phases */}
            <div className='mb-6'>
              {phases.map((phase, index) => (
                <div key={index} className='mb-4'>
                  <h3 className='font-bold text-lg text-primary-300'>{phase.name}</h3>
                  <p className='text-gray-400 text-sm'>{phase.date}</p>
                </div>
              ))}
            </div>

            {/* Marketing Info */}
            <div className='bg-dark-700 p-4 rounded-lg mb-6'>
              <h3 className='font-bold text-primary-300 mb-2'>Info marketing sur la factory</h3>
              <p className='text-gray-300 text-sm'>Détails sur la rareté, les attributs et les avantages de cette collection.</p>
            </div>

            {/* Stats */}
            <div className='bg-dark-700 p-4 rounded-lg'>
              <h3 className='font-bold text-primary-300 mb-2'>Statistiques de répartition du Mint</h3>
              <p className='text-gray-300 text-sm'>Informations sur la distribution des NFTs et leur rareté.</p>
            </div>
          </div>
        </div>

        {/* Already Minted Section */}
        <div className='mt-12'>
          <h2 className='text-2xl font-bold text-primary-300 mb-6'>Already Minted</h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
            {mintedItems.map(item => (
              <div key={item.id} className='bg-dark-800 rounded-lg overflow-hidden'>
                <img src={item.image} alt={item.name} className='w-full aspect-square object-cover' />
                <div className='p-3'>
                  <p className='text-sm font-medium text-center'>{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Marketing Section */}
        <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-dark-800 p-6 rounded-lg'>
            <img 
              src='https://picsum.photos/500/300?random=20' 
              alt='Marketing' 
              className='w-full h-48 object-cover rounded-lg mb-4'
            />
            <h3 className='text-xl font-bold text-primary-300 mb-2'>Avantages exclusifs</h3>
            <p className='text-gray-300'>Découvrez les avantages exclusifs réservés aux détenteurs de cette collection.</p>
          </div>
          <div className='bg-dark-800 p-6 rounded-lg'>
            <h3 className='text-xl font-bold text-primary-300 mb-4'>Roadmap</h3>
            <ul className='space-y-3'>
              <li className='flex items-start'>
                <span className='bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5'>1</span>
                <p className='text-gray-300'>Lancement de la collection - Janvier 2025</p>
              </li>
              <li className='flex items-start'>
                <span className='bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5'>2</span>
                <p className='text-gray-300'>Intégration dans le jeu - Mars 2025</p>
              </li>
              <li className='flex items-start'>
                <span className='bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5'>3</span>
                <p className='text-gray-300'>Événements exclusifs - Juin 2025</p>
              </li>
              <li className='flex items-start'>
                <span className='bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5'>4</span>
                <p className='text-gray-300'>Nouvelles fonctionnalités - Septembre 2025</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MintPage