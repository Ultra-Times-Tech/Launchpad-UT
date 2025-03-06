import { useState } from 'react'
import { useFactory } from '../hooks/useFactory'

function FactoryTestPage() {
  const [factoryId, setFactoryId] = useState('4315')
  const { factory, loading, error } = useFactory(factoryId)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newId = formData.get('factoryId') as string
    setFactoryId(newId)
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white p-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold text-primary-300 mb-8'>Factory Test Page</h1>

        <form onSubmit={handleSubmit} className='mb-8 flex gap-4'>
          <input
            type='text'
            name='factoryId'
            defaultValue={factoryId}
            placeholder='Enter factory ID'
            className='flex-1 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-primary-500'
          />
          <button
            type='submit'
            className='px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors'
          >
            Fetch Factory
          </button>
        </form>

        {loading && (
          <div className='flex items-center justify-center p-8'>
            <div className='w-8 h-8 border-t-2 border-primary-500 rounded-full animate-spin'></div>
          </div>
        )}

        {error && (
          <div className='bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-300'>
            <h3 className='font-bold mb-2'>Error</h3>
            <p>{error.message}</p>
          </div>
        )}

        {factory && (
          <div className='bg-dark-800 rounded-lg p-6 border border-dark-700'>
            <h2 className='text-xl font-bold text-primary-300 mb-4'>Factory Details</h2>
            
            <div className='space-y-4'>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>ID</label>
                <p className='text-lg'>{factory.id}</p>
              </div>

              <div>
                <label className='block text-sm text-gray-400 mb-1'>Name</label>
                <p className='text-lg'>{factory.metadata.content.name}</p>
              </div>

              <div>
                <label className='block text-sm text-gray-400 mb-1'>Description</label>
                <p className='text-lg'>{factory.metadata.content.description}</p>
              </div>

              <div>
                <label className='block text-sm text-gray-400 mb-1'>Status</label>
                <p className='text-lg'>{factory.status}</p>
              </div>

              <div>
                <label className='block text-sm text-gray-400 mb-1'>Type</label>
                <p className='text-lg'>{factory.type}</p>
              </div>

              <div>
                <label className='block text-sm text-gray-400 mb-1'>Stock</label>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <p className='text-gray-400'>Minted</p>
                    <p className='text-lg'>{factory.stock.minted}</p>
                  </div>
                  <div>
                    <p className='text-gray-400'>Total Supply</p>
                    <p className='text-lg'>{factory.stock.maxMintable}</p>
                  </div>
                  <div>
                    <p className='text-gray-400'>Available</p>
                    <p className='text-lg'>{factory.stock.mintable}</p>
                  </div>
                  <div>
                    <p className='text-gray-400'>Existing</p>
                    <p className='text-lg'>{factory.stock.existing}</p>
                  </div>
                </div>
              </div>

              {factory.firsthandPurchases?.[0] && (
                <div>
                  <label className='block text-sm text-gray-400 mb-1'>Price</label>
                  <p className='text-lg'>
                    {factory.firsthandPurchases[0].price.amount} {factory.firsthandPurchases[0].price.currency.symbol}
                    <span className='text-sm text-gray-400 ml-2'>
                      ({factory.firsthandPurchases[0].price.currency.code})
                    </span>
                  </p>
                </div>
              )}

              {factory.metadata.content.medias?.square?.uri && (
                <div>
                  <label className='block text-sm text-gray-400 mb-1'>Image</label>
                  <img 
                    src={factory.metadata.content.medias.square.uri} 
                    alt={factory.metadata.content.name}
                    className='w-32 h-32 object-cover rounded-lg'
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FactoryTestPage