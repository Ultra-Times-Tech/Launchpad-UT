import {useEffect, useState, useRef} from 'react'
import {useParams, Link} from 'react-router-dom'
import MintCard from '../components/Card/MintCard'
import {getAssetUrl} from '../utils/imageHelper'
import {useUltraWallet} from '../utils/ultraWalletHelper'
import {createMintTransaction, calculateTotalPrice} from '../utils/transactionHelper'
import {useTranslation} from '../hooks/useTranslation'
import {useMintData, MintItem} from '../hooks/useMintData'
import {AppRouteKey} from '../contexts/TranslationContext'
import PaymentSelector from '../components/Payment/PaymentSelector'
import useAlerts from '../hooks/useAlert'
// AOS
import AOS from 'aos'
import 'aos/dist/aos.css'
import {FaWallet} from 'react-icons/fa'

// Fonction utilitaire pour précharger les images de paiement
const preloadPaymentImages = () => {
  const imageUrls = [
    getAssetUrl('/payment/visa.svg'),
    getAssetUrl('/payment/mastercard.svg')
  ]
  
  imageUrls.forEach(url => {
    const img = new Image()
    img.src = url
  })
}

interface UltraError {
  message?: string
  data?: {
    error?: {
      what?: string
      code?: number
      name?: string
    }
  }
  code?: number
}

// Les interfaces sont maintenant définies dans useMintData

interface MintDetailsModalProps {
  mint: MintItem | null
  onClose: () => void
}

const MintDetailsModal: React.FC<MintDetailsModalProps> = ({mint, onClose}) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0})
  const imageRef = useRef<HTMLImageElement>(null)
  const {t} = useTranslation()

  if (!mint) return null

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed)
  }

  const shortenHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  return (
    <div className='fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4' onClick={onClose}>
      <div className='bg-dark-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-dark-700 animate-fadeIn' onClick={e => e.stopPropagation()}>
        <div className='relative group'>
          <div className={`relative overflow-hidden ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`} onMouseMove={handleMouseMove} onClick={handleZoomToggle}>
            <img
              ref={imageRef}
              src={mint.image}
              alt={mint.name}
              className={`w-full h-auto max-h-[80vh] transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              style={{
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
              }}
            />
            {isZoomed && (
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='bg-dark-900/80 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' />
                  </svg>
                  <span>{t('click_to_zoom_out')}</span>
                </div>
              </div>
            )}
          </div>
          <div className='absolute top-4 right-4 flex space-x-2'>
            <button onClick={handleZoomToggle} className='bg-dark-900/80 hover:bg-dark-900 text-white p-2 rounded-full transition-colors group-hover:opacity-100 opacity-0'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={isZoomed ? 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' : 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4'} />
              </svg>
            </button>
            <button onClick={onClose} className='bg-dark-900/80 hover:bg-dark-900 text-white p-2 rounded-full transition-colors group-hover:opacity-100 opacity-0'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
          {mint.rarity && (
            <div className='absolute bottom-4 right-4'>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${mint.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-300' : mint.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'}`}>{mint.rarity}</span>
            </div>
          )}
        </div>
        {mint.transactionHash && (
          <div className='p-6 space-y-4'>
            <div>
              <h3 className='text-xl font-bold text-primary-300 mb-1'>{mint.name}</h3>
              <p className='text-sm text-gray-400'>
                {t('token_id')} {mint.tokenId}
              </p>
            </div>

            <div className='space-y-3'>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-400'>{t('price')}</span>
                <span className='text-white font-medium'>{mint.price}</span>
              </div>

              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-400'>{t('minted_by')}</span>
                <div className='flex items-center space-x-2'>
                  {mint.minter.username && mint.minter.username !== mint.minter.address.slice(0, 6) ? (
                    <>
                      <span className='text-primary-300'>{mint.minter.username}</span>
                      <a href={`https://explorer.testnet.ultra.io/account/${mint.minter.address}`} target='_blank' rel='noopener noreferrer' className='text-gray-500 hover:text-primary-300 transition-colors'>
                        ({mint.minter.address})
                      </a>
                    </>
                  ) : (
                    <a href={`https://explorer.testnet.ultra.io/account/${mint.minter.address}`} target='_blank' rel='noopener noreferrer' className='text-primary-300 hover:text-primary-400 transition-colors'>
                      {mint.minter.address}
                    </a>
                  )}
                </div>
              </div>

              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-400'>{t('time')}</span>
                <span className='text-white'>{mint.timestamp}</span>
              </div>

              <div className='pt-3 border-t border-dark-700'>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-400'>{t('transaction')}</span>
                  <a href={`https://explorer.testnet.ultra.io/tx/${mint.transactionHash}`} target='_blank' rel='noopener noreferrer' className='text-primary-300 hover:text-primary-400 transition-colors'>
                    {shortenHash(mint.transactionHash)} ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MintPage() {
  const {category, id} = useParams<{category: string; id: string}>()
  const {isConnected, isLoading: walletLoading, error: walletError, blockchainId, connect} = useUltraWallet()

  // Utiliser le hook optimisé pour les données de mint
  const {factory, mintedItems, phases, loading, updateFactoryAfterMint, setMintedItems} = useMintData(category || '', id || '')

  const [mintAmount, setMintAmount] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMint, setSelectedMint] = useState<MintItem | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false)
  const itemsPerPage = 6
  const {t, generateLocalizedPath} = useTranslation()
  const {showAlert} = useAlerts()

  useEffect(() => {
    if (!isConnected) {
      setError(null)
      setSuccess(null)
      setTxHash(null)
    }
  }, [isConnected])

  // L'ancien useEffect de chargement des données est maintenant géré par useMintData

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 0,
    })
    
    // Précharger les images de paiement dès le montage du composant
    preloadPaymentImages()
  }, [])

  useEffect(() => {
    if (!loading && factory) {
      // Délai pour s'assurer que les éléments sont rendus avant le refresh
      setTimeout(() => {
        AOS.refresh()
      }, 100)
    }
  }, [loading, factory])

  const handleMint = async () => {
    setError(null)
    setSuccess(null)
    setTxHash(null)

    if (!isConnected || !blockchainId) {
      setError(t('wallet_not_connected'))
      return
    }

    if (!factory?.mintPrice) {
      setError(t('mint_price_not_available'))
      return
    }

    // Afficher le modal de paiement au lieu d'ouvrir directement le wallet
    setShowPaymentModal(true)
  }

  const handlePaymentComplete = async (success: boolean, paymentMethod: 'wallet' | 'card') => {
    setShowPaymentModal(false)

    if (!success) {
      setError(t('payment_failed'))
      return
    }

    if (paymentMethod === 'card') {
      // Pour le paiement par carte, on simule juste le succès pour le design
      setSuccess(t('payment_card_success'))
      showAlert(t('payment_card_success_alert'), 'success')
      return
    }

    // Pour le paiement par wallet, on continue avec la logique existante
    setIsTransactionInProgress(true)
    try {
      const ultra = window.ultra
      if (!ultra) {
        setError(t('ultra_wallet_not_available'))
        setIsTransactionInProgress(false)
        return
      }

      if (!factory?.mintPrice) {
        setError(t('mint_price_not_available'))
        setIsTransactionInProgress(false)
        return
      }

      const totalPrice = calculateTotalPrice(factory.mintPrice, mintAmount)

      const transactionMint = createMintTransaction({
        blockchainId,
        tokenFactoryId: '4337',
        index: '2',
        maxPrice: totalPrice,
        quantity: mintAmount,
      })

      try {
        const response = await ultra.signTransaction(transactionMint)

        if (response?.data?.transactionHash) {
          setSuccess(t('transaction_success'))
          setTxHash(response.data.transactionHash)
          showAlert(t('mint_success_alert'), 'success')

          // Ajouter un nombre de mints correspondant à mintAmount avec les bons liens
          const newMints = Array.from({length: mintAmount}, (_, i) => ({
            id: mintedItems.length + i + 1,
            name: factory?.name || '',
            image: category === '1' ? getAssetUrl('/banners/uniq-counsellor.png') : getAssetUrl('/banners/phygital.png'),
            price: factory?.mintPrice || '',
            timestamp: 'just now',
            minter: {
              address: blockchainId,
              username: '',
            },
            transactionHash: response.data.transactionHash,
            tokenId: `#${1234 + mintedItems.length + i}`,
            rarity: 'Legendary',
          }))

          // Utiliser la fonction optimisée pour mettre à jour les données
          updateFactoryAfterMint(mintAmount, newMints)
        } else {
          console.error('Réponse invalide:', response)
          setError(t('unknown_error'))
        }
        setIsTransactionInProgress(false)
      } catch (err: unknown) {
        const ultraError = err as UltraError
        console.error("Détails de l'erreur:", {
          message: ultraError?.message,
          data: ultraError?.data,
          code: ultraError?.code,
        })

        switch (ultraError?.message) {
          case 'Transaction rejected':
          case 'Transaction declined':
            setError(t('transaction_rejected'))
            break
          case 'Wallet window closed':
            setError(t('wallet_window_closed'))
            break
          case 'purchase limit reached':
            setError(t('purchase_limit_reached'))
            break
          case 'unauthorized buyer':
            setError(t('unauthorized_buyer'))
            break
          case 'purchase window closed':
            setError(t('purchase_window_closed'))
            break
          case 'insufficient UOS payment':
            setError(t('insufficient_uos_payment'))
            break
          case 'invalid factory ID':
            setError(t('invalid_factory_id'))
            break
          case 'insufficient balance for maximum payment':
            setError(t('insufficient_balance'))
            break
          case 'Network error':
            setError(t('network_error'))
            break
          case 'Invalid transaction data':
            setError(t('invalid_transaction_data'))
            break
          case 'Contract execution error':
            setError(t('contract_execution_error'))
            break
          default:
            if (ultraError?.data?.error?.what) {
              setError(`${t('blockchain_error')} ${ultraError.data.error.what}`)
            } else {
              setError(`${t('unknown_error')}: ${ultraError?.message || ''}`)
            }
        }
        setIsTransactionInProgress(false)
      }
    } catch (err) {
      console.error('Erreur globale:', err)
      setError(t('unexpected_error'))
      setIsTransactionInProgress(false)
    }
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

  const handleConnect = () => {
    connect()
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white'>
      {/* Hero Banner */}
      <div className='relative h-80 w-full' data-aos='fade-down'>
        <img src={getAssetUrl('/banners/factory-1.png')} alt='Mint Banner' className='w-full h-full object-cover' />
        <div className='absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent flex flex-col items-center justify-center'>
          {loading || !factory ? (
            <div className='flex flex-col items-center'>
              <div className='w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin'></div>
              <p className='mt-4 text-xl'>{t('loading_mint_page')}</p>
            </div>
          ) : (
            <>
              <h1 className='text-5xl font-cabin font-bold mb-4 text-primary-300'>{factory.name}</h1>
              <p className='text-xl max-w-2xl text-center font-quicksand'>from {factory.collectionName} by Ultra Times</p>
            </>
          )}
        </div>
      </div>

      {/* Navigation Breadcrumb */}
      {factory && (
        <div className='bg-dark-900 py-3 border-b border-dark-700' data-aos='fade-up'>
          <div className='container mx-auto px-4'>
            <div className='flex items-center text-sm'>
              <Link to={generateLocalizedPath('home' as AppRouteKey)} className='text-gray-400 hover:text-primary-300 transition-colors'>
                Homepage
              </Link>
              <span className='mx-2 text-gray-600'>/</span>
              <Link to={generateLocalizedPath('collection_details' as AppRouteKey, {id: id || ''})} className='text-gray-400 hover:text-primary-300 transition-colors'>
                {factory.collectionName}
              </Link>
              <span className='mx-2 text-gray-600'>/</span>
              <span className='text-primary-300'>{factory.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {factory && (
        <div className='container mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
            {/* Left Column - Image */}
            <div className='lg:col-span-8' data-aos='fade-right'>
              <div className='bg-dark-800 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm border border-dark-700'>
                <div className='aspect-w-16 aspect-h-5'>
                  <img
                    src={category === '1' ? getAssetUrl('/banners/uniq-counsellor.png') : getAssetUrl('/banners/phygital.png')}
                    alt={factory.name}
                    className='w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity'
                    onClick={() =>
                      setSelectedMint({
                        id: 0,
                        name: factory.name,
                        image: category === '1' ? getAssetUrl('/banners/uniq-counsellor.png') : getAssetUrl('/banners/phygital.png'),
                        price: factory.mintPrice,
                        timestamp: '',
                        minter: {address: '', username: ''},
                        transactionHash: '',
                        tokenId: '',
                        rarity: 'Legendary',
                      })
                    }
                  />
                </div>
                <div className='p-6'>
                  <h2 className='text-2xl font-bold text-primary-300 mb-4'>{factory.name}</h2>
                  <p className='text-gray-300'>{factory.description}</p>
                </div>
              </div>
            </div>

          {/* Right Column - Mint Info */}
          <div className='lg:col-span-4' data-aos='fade-left'>
            <div className='bg-dark-800 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-dark-700 sticky top-4'>
              {/* Progress Bar */}
              <div className='mb-6' data-aos='fade-up' data-aos-delay='100'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-300 font-medium'>{t('mint_progress')}</span>
                  <span className='text-primary-300 font-medium'>
                    {factory.minted}/{factory.supply}
                  </span>
                </div>
                <div className='w-full bg-dark-700 rounded-full h-2.5'>
                  <div className='bg-gradient-to-r from-primary-400 to-primary-600 h-2.5 rounded-full transition-all duration-500' style={{width: `${(factory.minted / factory.supply) * 100}%`}}></div>
                </div>
                <div className='text-center mt-2'>
                  <span className='bg-primary-600/30 text-primary-300 px-3 py-1 rounded-full text-xs font-medium'>{t('phase_private_active')}</span>
                </div>
              </div>

              {/* Mint Amount Selector */}
              <div className='space-y-4' data-aos='fade-up' data-aos-delay='200'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-300'>{t('mint_amount')}</span>
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
                  <span className='text-gray-400'>{t('price_per_item')}</span>
                  <span className='text-primary-300 font-medium'>{factory.mintPrice}</span>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-gray-400'>{t('total_price')}</span>
                  <span className='text-primary-300 font-bold text-xl'>{factory.mintPrice ? calculateTotalPrice(factory.mintPrice, mintAmount) : '0 UOS'}</span>
                </div>

                <button onClick={handleMint} disabled={!isConnected || isTransactionInProgress || !factory} className='w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 shadow-lg transform hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed'>
                  {isTransactionInProgress ? t('transaction_in_progress') : t('mint_now')}
                </button>

                {!isConnected && (
                  <div className='mt-4 p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <FaWallet className='w-5 h-5 text-yellow-400' />
                      <span className='text-yellow-300 font-medium'>{t('wallet_connection_required')}</span>
                    </div>
                    <p className='text-yellow-200 text-sm mb-3'>{t('connect_wallet_to_mint')}</p>
                    <button onClick={handleConnect} className='w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2'>
                      <FaWallet className='w-4 h-4' />
                      {t('connect_wallet')}
                    </button>
                  </div>
                )}

                {error && <div className='mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300'>{error}</div>}

                {success && txHash && (
                  <div className='mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300'>
                    {success}
                    <div className='flex flex-col space-y-2 mt-2'>
                      <a
                        href={`https://explorer.testnet.ultra.io/tx/${txHash}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center justify-center gap-2 bg-primary-500/30 hover:bg-primary-500/40 border-2 border-primary-400 text-gray-200 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] group'>
                        <span>{t('view_transaction')}</span>
                        <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                        </svg>
                      </a>
                      {blockchainId && (
                        <Link to={generateLocalizedPath('my_uniqs' as AppRouteKey)} className='flex items-center justify-center gap-2 bg-primary-500/30 hover:bg-primary-500/40 border-2 border-primary-400 text-gray-200 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] group'>
                          <span>{t('view_my_uniqs')}</span>
                          <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {walletError && (
                  <div className='mt-4 p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-300'>
                    {t('wallet_error')} {walletError}
                  </div>
                )}
              </div>

              {/* Mint Phases */}
              <div className='mt-6 pt-6 border-t border-dark-700' data-aos='fade-up'>
                <h3 className='font-bold text-sm text-primary-300 mb-3'>{t('mint_phases')}</h3>
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
          <div className='bg-dark-800 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-dark-700 transform hover:translate-y-[-2px] transition-all duration-300' data-aos='fade-up' data-aos-delay='500'>
            <div className='relative h-48 mb-4 rounded-lg overflow-hidden'>
              <img src={category === '1' ? getAssetUrl('/banners/factory-1.png') : getAssetUrl('/banners/phygital.png')} alt='Marketing' className='w-full h-full object-cover' />
              <div className='absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent'></div>
            </div>
            <h3 className='text-xl font-bold text-primary-300 mb-2'>{t('exclusive_benefits')}</h3>
            <p className='text-gray-300'>
              {category === '1' ? 'Get a chance to win a high-rarity ViT UniQ through our special raffle system. Every 5 UniQ purchases (excluding Vouchers) enters you into a draw for exclusive rewards.' : 'Transform your digital artwork into a physical masterpiece. This voucher entitles you to receive a premium 60cm x 80cm dibond print of your UniQ, ensuring lasting quality and durability.'}
            </p>
          </div>

          <div className='bg-dark-800 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-dark-700 transform hover:translate-y-[-2px] transition-all duration-300' data-aos='fade-up' data-aos-delay='600'>
            <h3 className='text-xl font-bold text-primary-300 mb-4'>{t('collection_details')}</h3>
            <div className='relative pl-8 before:content-[""] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary-600'>
              <div className='mb-6 relative'>
                <div className='absolute left-[-30px] top-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>1</span>
                </div>
                <h4 className='text-white font-bold mb-1'>{t('limited_edition')}</h4>
                <p className='text-gray-400 text-sm'>Only 2 unique pieces available</p>
              </div>
              <div className='mb-6 relative'>
                <div className='absolute left-[-30px] top-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>2</span>
                </div>
                <h4 className='text-white font-bold mb-1'>{t('artist_signed')}</h4>
                <p className='text-gray-400 text-sm'>Each piece signed by C-la</p>
              </div>
              <div className='mb-6 relative'>
                <div className='absolute left-[-30px] top-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>3</span>
                </div>
                <h4 className='text-white font-bold mb-1'>{t('physical_conversion')}</h4>
                <p className='text-gray-400 text-sm'>Option to convert to physical artwork</p>
              </div>
              <div className='relative'>
                <div className='absolute left-[-30px] top-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>4</span>
                </div>
                <h4 className='text-white font-bold mb-1'>{t('special_raffle')}</h4>
                <p className='text-gray-400 text-sm'>Chance to win ViT UniQ rewards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Minted Section */}
        <div className='mt-12'>
          <div className='flex justify-between items-center mb-6' data-aos='fade-up' data-aos-delay='700'>
            <h2 className='text-2xl font-bold text-primary-300'>{t('recently_minted')}</h2>
            <div className='flex items-center space-x-2'>
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-primary-300 hover:bg-dark-800'}`}>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
              </button>
              <span className='text-gray-400 text-sm'>
                {t('page')} {currentPage} {t('of')} {totalPages}
              </span>
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-primary-300 hover:bg-dark-800'}`}>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </div>
          </div>
          <div className='space-y-4'>
            {currentMints.map((mint, index) => (
              <div key={mint.id} onClick={() => setSelectedMint(mint)} className='cursor-pointer' data-aos='fade-up' data-aos-delay={800 + index * 100}>
                <MintCard {...mint} collectionName={factory.collectionName} itemName={factory.name} transactionHash={mint.transactionHash} minter={mint.minter} />
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4' onClick={() => setShowPaymentModal(false)}>
          <div className='bg-dark-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-dark-600' onClick={e => e.stopPropagation()}>
            <div className='sticky top-0 bg-dark-800 p-6 border-b border-dark-600 flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold text-white mb-1'>{t('complete_purchase')}</h2>
                <p className='text-gray-400 text-sm'>{t('choose_payment_method')}</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className='p-2 rounded-full hover:bg-dark-700 transition-colors'>
                <svg className='w-6 h-6 text-gray-400 hover:text-white transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <div className='p-6'>
              <PaymentSelector amount={factory?.mintPrice ? calculateTotalPrice(factory.mintPrice, mintAmount) : '0 UOS'} quantity={mintAmount} onPaymentComplete={handlePaymentComplete} />
            </div>
          </div>
        </div>
      )}

      {/* Mint Details Modal */}
      {selectedMint && <MintDetailsModal mint={selectedMint} onClose={() => setSelectedMint(null)} />}
    </div>
  )
}

export default MintPage
