import {useState, useEffect} from 'react'
import axios from 'axios'

interface CollectionAttributes {
  id: number
  name: string
  state: number
  publish_up: string | null
  publish_down: string | null
  created: string
  modified: string
}

interface Collection {
  type: string
  id: string
  attributes: CollectionAttributes
}

interface CollectionsResponse {
  links: {
    self: string
  }
  data: Collection[]
  meta: {
    'total-pages': number
  }
}

function CollectionsTestPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchCollections = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const apiUrl = import.meta.env.VITE_APP_API_URL || 'https://launchpad-ut-backend.vercel.app'
      const response = await axios.get<CollectionsResponse>(`${apiUrl}collections`)
      setCollections(response.data.data)
    } catch (err) {
      console.error('Erreur lors de la récupération des collections:', err)
      setError('Erreur lors de la récupération des collections')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non défini'
    return new Date(dateString).toLocaleString('fr-FR')
  }

  const getStatusBadge = (state: number) => {
    if (state === 1) {
      return <span className='px-2 py-1 text-xs font-semibold text-green-300 bg-green-500/20 rounded-full'>Publié</span>
    }
    return <span className='px-2 py-1 text-xs font-semibold text-yellow-300 bg-yellow-500/20 rounded-full'>Brouillon</span>
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-primary-300 mb-8'>Collections Ultra Times</h1>

        <div className='space-y-6'>
          {/* Collections Section */}
          <div className='bg-dark-800 rounded-lg p-6 border border-dark-700'>
            <h2 className='text-xl font-bold text-primary-300 mb-4'>Collections Disponibles</h2>

            {isLoading && (
              <div className='text-center py-4'>
                <p className='text-primary-300'>Chargement des collections...</p>
              </div>
            )}

            {error && <div className='p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300'>{error}</div>}

            {!isLoading && !error && collections.length === 0 && (
              <div className='text-center py-4'>
                <p className='text-gray-400'>Aucune collection disponible</p>
              </div>
            )}

            {!isLoading && !error && collections.length > 0 && (
              <div className='grid gap-4'>
                {collections.map(collection => (
                  <div key={collection.id} className='bg-dark-700 rounded-lg p-4 border border-dark-600 hover:border-primary-500 transition-colors'>
                    <div className='flex justify-between items-start mb-2'>
                      <h3 className='text-lg font-semibold text-primary-300'>{collection.attributes.name}</h3>
                      {getStatusBadge(collection.attributes.state)}
                    </div>

                    <div className='grid grid-cols-2 gap-4 text-sm text-gray-400'>
                      <div>
                        <p className='font-medium text-gray-300'>ID</p>
                        <p>{collection.attributes.id}</p>
                      </div>
                      <div>
                        <p className='font-medium text-gray-300'>Date de création</p>
                        <p>{formatDate(collection.attributes.created)}</p>
                      </div>
                      <div>
                        <p className='font-medium text-gray-300'>Publication</p>
                        <p>{formatDate(collection.attributes.publish_up)}</p>
                      </div>
                      <div>
                        <p className='font-medium text-gray-300'>Expiration</p>
                        <p>{formatDate(collection.attributes.publish_down)}</p>
                      </div>
                      <div>
                        <p className='font-medium text-gray-300'>Dernière modification</p>
                        <p>{formatDate(collection.attributes.modified)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={fetchCollections} className='mt-4 px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors' disabled={isLoading}>
              {isLoading ? 'Actualisation...' : 'Actualiser les Collections'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionsTestPage
