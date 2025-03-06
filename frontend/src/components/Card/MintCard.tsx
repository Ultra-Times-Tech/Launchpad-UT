import {Link} from 'react-router-dom'

export interface MintProps {
  id: number
  collectionName: string
  itemName: string
  price: string
  timestamp: string
  image: string
}

function MintCard({collectionName, itemName, price, timestamp, image}: MintProps) {
  return (
    <div className='group relative bg-dark-800 bg-opacity-50 p-5 rounded-2xl hover:bg-opacity-70 transition-all duration-300 backdrop-blur-sm border border-dark-700 hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/10'>
      <div className='flex items-center space-x-5'>
        {/* Image with hover effect */}
        <div className='relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-lg group-hover:shadow-primary-500/20'>
          <img src={image} alt={itemName} className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500' />
          <div className='absolute inset-0 bg-gradient-to-t from-dark-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        </div>

        {/* Content */}
        <div className='flex-grow min-w-0'>
          <Link to={`/collection/${itemName}`} className='block group-hover:transform group-hover:-translate-y-0.5 transition-transform duration-300'>
            <h4 className='font-cabin font-semibold text-primary-200 truncate text-lg group-hover:text-primary-300 transition-colors duration-300'>{itemName}</h4>
          </Link>

          <p className='text-sm text-gray-400 font-quicksand truncate mb-2 group-hover:text-gray-300 transition-colors duration-300'>
            from <span className='text-primary-400'>{collectionName}</span>
          </p>

          <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-2'>
              <span className='flex items-center space-x-1 text-sm font-medium bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full group-hover:bg-green-500/20 transition-colors duration-300'>
                <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z' clipRule='evenodd' />
                </svg>
                <span>{price}</span>
              </span>
            </div>
            <span className='text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300'>{timestamp}</span>
          </div>
        </div>
      </div>

      {/* Hover indicator */}
      <div className='absolute -inset-px rounded-2xl border border-primary-500/0 group-hover:border-primary-500/50 pointer-events-none transition-all duration-300' />
    </div>
  )
}

export default MintCard