import {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import MintCard from '../components/Card/MintCard'
import {getAssetUrl} from '../utils/imageHelper'

interface MintItem {
  id: number
  name: string
  image: string
  price: string
  timestamp: string
  minter: {
    address: string
    username: string
  }
  transactionHash: string
  tokenId: string
  rarity: string
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

interface MintDetailsModalProps {
  mint: MintItem | null
  onClose: () => void
}

const MintDetailsModal: React.FC<MintDetailsModalProps> = ({mint, onClose}) => {
  if (!mint) return null

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const shortenHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-dark-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-dark-700 animate-fadeIn'>
        <div className='relative'>
          <img src={mint.image} alt={mint.name} className='w-full h-64 object-cover' />
          <button onClick={onClose} className='absolute top-4 right-4 bg-dark-900/80 hover:bg-dark-900 text-white p-2 rounded-full transition-colors'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
          <div className='absolute bottom-4 right-4'>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${mint.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-300' : mint.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'}`}>{mint.rarity}</span>
          </div>
        </div>
        <div className='p-6 space-y-4'>
          <div>
            <h3 className='text-xl font-bold text-primary-300 mb-1'>{mint.name}</h3>
            <p className='text-sm text-gray-400'>Token ID: {mint.tokenId}</p>
          </div>

          <div className='space-y-3'>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-400'>Price</span>
              <span className='text-white font-medium'>{mint.price}</span>
            </div>

            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-400'>Minted by</span>
              <div className='flex items-center space-x-2'>
                <span className='text-primary-300'>{mint.minter.username}</span>
                <span className='text-gray-500'>({shortenAddress(mint.minter.address)})</span>
              </div>
            </div>

            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-400'>Time</span>
              <span className='text-white'>{mint.timestamp}</span>
            </div>

            <div className='pt-3 border-t border-dark-700'>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-400'>Transaction</span>
                <a href={`https://explorer.ultra.io/tx/${mint.transactionHash}`} target='_blank' rel='noopener noreferrer' className='text-primary-300 hover:text-primary-400 transition-colors'>
                  {shortenHash(mint.transactionHash)} ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MintPage() {
  const {category, id} = useParams<{category: string; id: string}>()
  const [loading, setLoading] = useState(true)
  const [factory, setFactory] = useState<Factory | null>(null)
  const [mintedItems, setMintedItems] = useState<MintItem[]>([])
  const [phases, setPhases] = useState<MintPhase[]>([])
  const [mintAmount, setMintAmount] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMint, setSelectedMint] = useState<MintItem | null>(null)
  const itemsPerPage = 5

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        setTimeout(() => {
          const factoryNames: Record<string, string> = {
            '1': 'Dark Wisdom Counsellor',
            '2': 'Phygital Voucher',
          }

          const collectionNames: Record<string, string> = {
            '1': 'Ultra Street-Cubism',
            '2': 'Ultra Street-Cubism',
          }

          setFactory({
            id: Number(category),
            name: factoryNames[category || '1'] || 'Dark Wisdom Counsellor',
            description: category === '1' 
              ? 'A stunning Dark Street Cubism painting inspired by an Ultra\'s Movement Elder design. This exclusive creation is personally signed by C-la. By acquiring this Art, you\'re automatically entered into a special raffle that occurs every 5 UniQ purchases (excluding Vouchers), giving you a chance to win a high-rarity ViT UniQ from the UT Collection.'
              : 'Transform your digital Ultra Street-Cubism collection into a physical masterpiece. This voucher entitles you to receive a printed version of your UniQ on a premium 60cm x 80cm dibond support, ensuring durability and longevity. (Shipping costs not included) For more information, contact Ultra Times teams on Discord: https://discord.gg/R2zvShJAyh',
            mintPrice: '0 UOS',
            supply: 1,
            minted: 0,
            collectionName: collectionNames[id || '1'] || 'Ultra Street-Cubism',
          })

          setPhases([
            {name: 'Public Mint', active: true, date: 'Available now'},
          ])

          // Add more minted items
          const mockMintedItems = Array.from({length: 5}, (_, index) => ({
            id: index + 1,
            name: category === '1' ? 'Dark Wisdom Counsellor' : 'Phygital Voucher',
            image: category === '1' ? getAssetUrl('/banners/dark-counseller.png') : getAssetUrl('/banners/phygital.png'),
            price: '0 UOS',
            timestamp: `${index * 3 + 2} minutes ago`,
            minter: {
              address: `0x${Math.random().toString(16).slice(2)}abcdef${Math.random().toString(16).slice(2)}`,
              username: ['CryptoWhale', 'NFTHunter', 'PixelMaster', 'ArtCollector', 'CryptoArtist'][index],
            },
            transactionHash: `0x${Math.random().toString(16).slice(2)}abcdef${Math.random().toString(16).slice(2)}`,
            tokenId: `#${1234 + index}`,
            rarity: 'Legendary',
          }))

          setMintedItems(mockMintedItems)
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

  // Pagination
  const totalPages = Math.ceil(mintedItems.length / itemsPerPage)
  const currentMints = mintedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
      <div className='relative h-64 w-full'>
        <img src={getAssetUrl('/banners/dark-counseller.png')} alt='Mint Banner' className='w-full h-full object-cover' />
        <div className='absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent flex flex-col items-center justify-center'>
          <h1 className='text-4xl font-cabin font-bold mb-2 text-primary-300'>{factory.name}</h1>
          <p className='text-lg font-quicksand'>from {factory.collectionName} by Ultra Times</p>
        </div>
      </div>

      {/* Navigation Breadcrumb */}
      <div className='bg-dark-900 py-3 border-b border-dark-700'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center text-sm'>
            <Link to='/' className='text-gray-400 hover:text-primary-300 transition-colors'>
              Homepage
            </Link>
            <span className='mx-2 text-gray-600'>/</span>
            <Link to={`/collection/${id}`} className='text-gray-400 hover:text-primary-300 transition-colors'>
              {factory.collectionName}
            </Link>
            <span className='mx-2 text-gray-600'>/</span>
            <span className='text-primary-300'>{factory.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* Left Column - Image */}
          <div className='lg:col-span-8'>
            <div className='bg-dark-800 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm border border-dark-700'>
              <div className='aspect-w-16 aspect-h-9'>
                <img src={category === '1' ? getAssetUrl('/banners/uniq-counsellor.png') : getAssetUrl('/banners/uniqphygital.png')} alt={factory.name} className='w-full h-full object-cover' />
              </div>
              <div className='p-6'>
                <h2 className='text-2xl font-bold text-primary-300 mb-4'>{factory.name}</h2>
                <p className='text-gray-300'>{factory.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Mint Info */}
          <div className='lg:col-span-4'>
            <div className='bg-dark-800 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-dark-700 sticky top-4'>
              {/* Progress Bar */}
              <div className='mb-6'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-300 font-medium'>Mint Progress</span>
                  <span className='text-primary-300 font-medium'>
                    {factory.minted}/{factory.supply}
                  </span>
                </div>
                <div className='w-full bg-dark-700 rounded-full h-2.5'>
                  <div className='bg-gradient-to-r from-primary-400 to-primary-600 h-2.5 rounded-full transition-all duration-500' style={{width: `${(factory.minted / factory.supply) * 100}%`}}></div>
                </div>
                <div className='text-center mt-2'>
                  <span className='bg-primary-600/30 text-primary-300 px-3 py-1 rounded-full text-xs font-medium'>Phase private active</span>
                </div>
              </div>

              {/* Mint Amount Selector */}
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-300'>Mint Amount</span>
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

                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-400'>Price per item:</span>
                  <span className='text-primary-300 font-medium'>{factory.mintPrice}</span>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-gray-400'>Total price:</span>
                  <span className='text-primary-300 font-bold text-xl'>{parseFloat(factory.mintPrice) * mintAmount} UOS</span>
                </div>

                <button onClick={handleMint} className='w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 shadow-lg transform hover:translate-y-[-2px]'>
                  MINT NOW
                </button>
              </div>

              {/* Mint Phases */}
              <div className='mt-6 pt-6 border-t border-dark-700'>
                <h3 className='font-bold text-sm text-primary-300 mb-3'>Mint Phases</h3>
                <div className='space-y-3'>
                  {phases.map((phase, index) => (
                    <div key={index} className='flex items-center'>
                      <div className={`w-3 h-3 rounded-full mr-3 ${phase.active ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                      <div>
                        <h4 className={`text-sm font-medium ${phase.active ? 'text-white' : 'text-gray-400'}`}>{phase.name}</h4>
                        <p className='text-gray-400 text-xs'>{phase.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing & Roadmap Section */}
        <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-dark-800 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-dark-700 transform hover:translate-y-[-2px] transition-all duration-300'>
            <div className='relative h-48 mb-4 rounded-lg overflow-hidden'>
              <img src={category === '1' ? getAssetUrl('/banners/dark-counseller.png') : getAssetUrl('/banners/phygital.png')} alt='Marketing' className='w-full h-full object-cover' />
              <div className='absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent'></div>
            </div>
            <h3 className='text-xl font-bold text-primary-300 mb-2'>Exclusive Benefits</h3>
            <p className='text-gray-300'>
              {category === '1' 
                ? 'Get a chance to win a high-rarity ViT UniQ through our special raffle system. Every 5 UniQ purchases (excluding Vouchers) enters you into a draw for exclusive rewards.'
                : 'Transform your digital artwork into a physical masterpiece. This voucher entitles you to receive a premium 60cm x 80cm dibond print of your UniQ, ensuring lasting quality and durability.'}
            </p>
          </div>

          <div className='bg-dark-800 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-dark-700 transform hover:translate-y-[-2px] transition-all duration-300'>
            <h3 className='text-xl font-bold text-primary-300 mb-4'>Collection Details</h3>
            <div className='relative pl-8 before:content-[""] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary-600'>
              <div className='mb-6 relative'>
                <div className='absolute left-[-30px] top-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>1</span>
                </div>
                <h4 className='text-white font-bold mb-1'>Limited Edition</h4>
                <p className='text-gray-400 text-sm'>Only 2 unique pieces available</p>
              </div>
              <div className='mb-6 relative'>
                <div className='absolute left-[-30px] top-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>2</span>
                </div>
                <h4 className='text-white font-bold mb-1'>Artist Signed</h4>
                <p className='text-gray-400 text-sm'>Each piece signed by C-la</p>
              </div>
              <div className='mb-6 relative'>
                <div className='absolute left-[-30px] top-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>3</span>
                </div>
                <h4 className='text-white font-bold mb-1'>Physical Conversion</h4>
                <p className='text-gray-400 text-sm'>Option to convert to physical artwork</p>
              </div>
              <div className='relative'>
                <div className='absolute left-[-30px] top-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>4</span>
                </div>
                <h4 className='text-white font-bold mb-1'>Special Raffle</h4>
                <p className='text-gray-400 text-sm'>Chance to win ViT UniQ rewards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Minted Section */}
        <div className='mt-12'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-primary-300'>Recently Minted</h2>
            <div className='flex items-center space-x-2'>
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-primary-300 hover:bg-dark-800'}`}>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
              </button>
              <span className='text-gray-400 text-sm'>
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-primary-300 hover:bg-dark-800'}`}>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </div>
          </div>
          <div className='space-y-4'>
            {currentMints.map(mint => (
              <div key={mint.id} onClick={() => setSelectedMint(mint)} className='cursor-pointer'>
                <MintCard {...mint} collectionName={factory.collectionName} itemName={factory.name} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mint Details Modal */}
      {selectedMint && <MintDetailsModal mint={selectedMint} onClose={() => setSelectedMint(null)} />}
    </div>
  )
}

export default MintPage
