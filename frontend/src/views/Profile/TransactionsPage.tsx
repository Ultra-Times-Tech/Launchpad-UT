import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useUltraWallet} from '../../utils/ultraWalletHelper'

interface Transaction {
  id: string
  type: 'mint' | 'transfer' | 'sale'
  itemName: string
  amount: string
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
  hash: string
}

function TransactionsPage() {
  const navigate = useNavigate()
  const {blockchainId} = useUltraWallet()
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'mint',
      itemName: 'Vox-in-Time #156',
      amount: '0.5 UOS',
      timestamp: '2024-03-15 14:30',
      status: 'completed',
      hash: '0x1234...5678',
    },
    {
      id: '2',
      type: 'transfer',
      itemName: 'Ultra Street-Cubism #89',
      amount: '0.0 UOS',
      timestamp: '2024-03-14 09:15',
      status: 'completed',
      hash: '0x8765...4321',
    },
    {
      id: '3',
      type: 'sale',
      itemName: 'Crypto Punks #2234',
      amount: '1.2 UOS',
      timestamp: '2024-03-13 16:45',
      status: 'completed',
      hash: '0x9876...5432',
    },
  ])

  useEffect(() => {
    if (!blockchainId) {
      navigate('/')
    }
  }, [blockchainId, navigate])

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'failed':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'mint':
        return (
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
        )
      case 'transfer':
        return (
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
          </svg>
        )
      case 'sale':
        return (
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
        )
    }
  }

  if (!blockchainId) {
    return null
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-3xl font-bold text-primary-300 mb-8'>Transaction History</h1>

          <div className='bg-dark-800 rounded-xl overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-dark-700'>
                    <th className='px-6 py-4 text-left text-sm font-medium text-gray-400'>Type</th>
                    <th className='px-6 py-4 text-left text-sm font-medium text-gray-400'>Item</th>
                    <th className='px-6 py-4 text-left text-sm font-medium text-gray-400'>Amount</th>
                    <th className='px-6 py-4 text-left text-sm font-medium text-gray-400'>Date</th>
                    <th className='px-6 py-4 text-left text-sm font-medium text-gray-400'>Status</th>
                    <th className='px-6 py-4 text-left text-sm font-medium text-gray-400'>Hash</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-dark-700'>
                  {transactions.map(transaction => (
                    <tr key={transaction.id} className='hover:bg-dark-700/50 transition-colors'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center space-x-2'>
                          <span className='p-2 bg-dark-700 rounded-lg text-primary-300'>{getTypeIcon(transaction.type)}</span>
                          <span className='capitalize'>{transaction.type}</span>
                        </div>
                      </td>
                      <td className='px-6 py-4'>{transaction.itemName}</td>
                      <td className='px-6 py-4 font-medium text-primary-300'>{transaction.amount}</td>
                      <td className='px-6 py-4 text-sm text-gray-400'>{transaction.timestamp}</td>
                      <td className='px-6 py-4'>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>{transaction.status}</span>
                      </td>
                      <td className='px-6 py-4'>
                        <a href={`https://explorer.ultra.io/tx/${transaction.hash}`} target='_blank' rel='noopener noreferrer' className='text-primary-300 hover:text-primary-400 transition-colors'>
                          {transaction.hash}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {transactions.length === 0 && (
              <div className='text-center py-12'>
                <div className='w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                  </svg>
                </div>
                <h2 className='text-xl font-semibold mb-2'>No Transactions Yet</h2>
                <p className='text-gray-400'>Your transaction history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionsPage