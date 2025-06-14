import {Link} from 'react-router-dom'
import {getAssetUrl} from '../../utils/imageHelper'

const Logo = () => (
  <Link to='/' className='flex items-center space-x-2'>
    <img src={getAssetUrl('/logos/logo-ut.png')} alt='Ultra Times Logo' className='h-8 w-auto' />
    <span className='text-lg sm:text-xl font-bold text-white whitespace-nowrap'>
      <span className='hidden sm:inline'>UT Launchpad </span>
    </span>
  </Link>
)

export default Logo
