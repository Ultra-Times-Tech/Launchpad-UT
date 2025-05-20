import {useState, useEffect} from 'react'
import {useUltraWallet} from '../utils/ultraWalletHelper'
import {createMintTransaction} from '../utils/transactionHelper'
import {useTranslation} from '../hooks/useTranslation'

interface UltraError {
  message?: string;
  data?: {
    error?: {
      what?: string;
      code?: number;
      name?: string;
    };
  };
  code?: number;
}

function MintTestPage() {
  const {isInstalled, isConnected, isLoading, error: walletError, blockchainId, connect} = useUltraWallet()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected) {
      setError(null)
      setSuccess(null)
      setTxHash(null)
    }
  }, [isConnected])

  const handleMint = async () => {
    setError(null)
    setSuccess(null)
    setTxHash(null)

    if (!isConnected || !blockchainId) {
      setError('Portefeuille non connecté')
      return
    }

    try {
      const ultra = window.ultra
      if (!ultra) {
        setError('Ultra wallet non disponible')
        return
      }

      const transactionMint = createMintTransaction({
        blockchainId,
        tokenFactoryId: "4337",
        index: "2",
        maxPrice: "1.00000000 UOS"
      })

      try {
        const response = await ultra.signTransaction(transactionMint)
        
        if (response?.data?.transactionHash) {
          setSuccess(`Transaction réussie! Hash: `)
          setTxHash(response.data.transactionHash)
        } else {
          console.error('Réponse invalide:', response)
          setError('La transaction n\'a pas retourné de hash')
        }
      } catch (err: unknown) {
        const ultraError = err as UltraError
        console.error('Détails de l\'erreur:', {
          message: ultraError?.message,
          data: ultraError?.data,
          code: ultraError?.code
        })

        switch (ultraError?.message) {
          case 'Transaction rejected':
          case 'Transaction declined':
            setError("L'utilisateur a refusé la transaction.")
            break
          case 'Wallet window closed':
            setError("La fenêtre du portefeuille a été fermée.")
            break
          case 'purchase limit reached':
            setError("Limite d'achat atteinte pour cette option.")
            break
          case 'unauthorized buyer':
            setError('Acheteur non autorisé pour cette option.')
            break
          case 'purchase window closed':
            setError("La fenêtre d'achat est fermée.")
            break
          case 'insufficient UOS payment':
            setError("Paiement UOS insuffisant.")
            break
          case 'invalid factory ID':
            setError("ID de factory invalide.")
            break
          case 'insufficient balance for maximum payment':
            setError("Solde insuffisant pour le paiement maximum.")
            break
          case 'Network error':
            setError("Erreur réseau.")
            break
          case 'Invalid transaction data':
            setError("Données de transaction invalides.")
            break
          case 'Contract execution error':
            setError("Erreur d'exécution du contrat.")
            break
          default:
            if (ultraError?.data?.error?.what) {
              setError(`Erreur blockchain: ${ultraError.data.error.what}`)
            } else {
              setError(`Erreur: ${ultraError?.message || 'Erreur inconnue'}`)
            }
        }
      }
    } catch (err) {
      console.error('Erreur globale:', err)
      setError('Erreur inattendue lors de la transaction')
    }
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-primary-300 mb-8'>Test de Mint - Factory #4337</h1>

        <div className='space-y-6'>
          {/* Wallet Status */}
          <div className='bg-dark-800 rounded-lg p-6 border border-dark-700'>
            <h2 className='text-xl font-bold text-primary-300 mb-4'>Statut du Portefeuille</h2>
            <div className='space-y-2'>
              <p>Installation: {isInstalled ? '✅' : '❌'}</p>
              <p>Connexion: {isConnected ? '✅' : '❌'}</p>
              <p>Adresse: {blockchainId || 'Non connecté'}</p>
            </div>

            {!isConnected && (
              <button 
                onClick={() => connect()} 
                className='mt-4 px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors' 
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Connecter le Portefeuille'}
              </button>
            )}
          </div>

          {/* Mint Section */}
          <div className='bg-dark-800 rounded-lg p-6 border border-dark-700'>
            <h2 className='text-xl font-bold text-primary-300 mb-4'>Mint Uniq</h2>
            
            <div className='space-y-4'>
              <p className='text-sm text-gray-400'>
                Prix: 0.1 UOS<br/>
                Factory ID: 4337<br/>
                Index: 2
              </p>

              <button 
                onClick={handleMint} 
                disabled={!isConnected || isLoading} 
                className='w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? 'Transaction en cours...' : 'Mint'}
              </button>
            </div>

            {error && (
              <div className='mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300'>
                {error}
              </div>
            )}

            {success && (
              <div className='mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300'>
                {success}
                <a 
                  href={`https://explorer.testnet.ultra.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-300 hover:text-primary-400 underline"
                >
                  {txHash}
                </a>
              </div>
            )}

            {walletError && (
              <div className='mt-4 p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-300'>
                Erreur portefeuille: {walletError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MintTestPage