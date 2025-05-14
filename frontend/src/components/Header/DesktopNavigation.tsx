import {Link} from 'react-router-dom'
import {DesktopNavigationProps} from '../../types/header.types'

const DesktopNavigation = ({t, closeMenu}: DesktopNavigationProps) => (
  <nav className='hidden lg:flex items-center justify-center flex-1 px-8 font-quicksand'>
    <div className='flex space-x-8'>
      {(['home', 'collections', 'contact'] as const).map(item => (
        <Link key={item} to={`/${item === 'home' ? '' : item}`} className='text-white hover:text-primary-300 transition-colors px-2' onClick={closeMenu}>
          {t(item)}
        </Link>
      ))}
    </div>
  </nav>
)

export default DesktopNavigation
