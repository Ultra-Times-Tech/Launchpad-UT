import {Link} from 'react-router-dom'
import {DesktopNavigationProps} from '../../types/header.types'
import {useTranslation} from '../../contexts/TranslationContext'

const DesktopNavigation = ({t, closeMenu}: DesktopNavigationProps) => {
  const {generateLocalizedPath} = useTranslation()

  return (
    <nav className='hidden lg:flex items-center justify-center flex-1 px-8 font-quicksand'>
      <div className='flex space-x-8'>
        {(['home', 'collections', 'contact'] as const).map(item => (
          <Link key={item} to={generateLocalizedPath(item as any)} className='text-white hover:text-primary-300 transition-colors px-2' onClick={closeMenu}>
            {t(item)}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default DesktopNavigation
