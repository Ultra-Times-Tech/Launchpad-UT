import {Link} from 'react-router-dom'
import {getAssetUrl} from '../utils/imageHelper'
import {useTranslation} from '../contexts/TranslationContext'
import {getTwitterLink} from '../utils/generalHelper'

function Footer() {
  const {t, currentLang} = useTranslation()

  return (
    <footer className='bg-dark-900 text-white py-12 border-t border-dark-700'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='text-center md:text-left'>
            <div className='flex items-center justify-center md:justify-start space-x-2 mb-4'>
              <img src={getAssetUrl('/logos/logo-ut.png')} alt='Ultra Times Logo' className='h-8 w-auto' />
              <span className='text-xl font-cabin font-semibold text-primary-300'>Ultra Times</span>
            </div>
            <p className='text-sm mb-4 font-quicksand text-gray-300'>{t('footer_about_description')}</p>
            <p className='text-xs text-gray-400'>
              © {new Date().getFullYear()} Ultra Times - {t('footer_rights_reserved')}
            </p>
          </div>

          <div className='text-center md:text-left'>
            <h3 className='font-cabin font-semibold mb-4 text-primary-300'>{t('footer_quick_links')}</h3>
            <div className='flex flex-wrap gap-2 justify-center md:justify-start'>
              <Link to='/' className='bg-dark-800 px-3 py-1 rounded-full text-xs text-primary-300 hover:bg-dark-700 transition-colors'>
                {t('home')}
              </Link>
              <Link to='/collections' className='bg-dark-800 px-3 py-1 rounded-full text-xs text-primary-300 hover:bg-dark-700 transition-colors'>
                {t('collections')}
              </Link>
              <Link to='/contact' className='bg-dark-800 px-3 py-1 rounded-full text-xs text-primary-300 hover:bg-dark-700 transition-colors'>
                {t('contact')}
              </Link>
            </div>
          </div>

          <div className='text-center md:text-left'>
            <h3 className='font-cabin font-semibold mb-4 text-primary-300'>{t('footer_legal')}</h3>
            <div className='space-y-2 font-quicksand flex flex-col items-center md:items-start'>
              <Link to='/legal' className='text-gray-300 hover:text-primary-300 transition-colors'>
                {t('footer_legal')}
              </Link>
              <Link to='/terms' className='text-gray-300 hover:text-primary-300 transition-colors'>
                {t('footer_terms')}
              </Link>
              <Link to='/privacy' className='text-gray-300 hover:text-primary-300 transition-colors'>
                {t('footer_privacy')}
              </Link>
            </div>
          </div>

          <div className='text-center md:text-left'>
            <h3 className='font-cabin font-semibold mb-4 text-primary-300'>{t('footer_social')}</h3>
            <div className='space-y-3 font-quicksand flex flex-col items-center md:items-start'>
              <a href='https://discord.gg/AQAAjF8vBJ' target='_blank' rel='noopener noreferrer' className='flex items-center space-x-2 text-gray-300 hover:text-primary-300 transition-colors'>
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z' />
                </svg>
                <span>Discord</span>
              </a>
              <a href={getTwitterLink(currentLang)} target='_blank' rel='noopener noreferrer' className='flex items-center space-x-2 text-gray-300 hover:text-primary-300 transition-colors'>
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
                </svg>
                <span>Twitter</span>
              </a>
              <a href='https://www.linkedin.com/company/ultra-times/' target='_blank' rel='noopener noreferrer' className='flex items-center space-x-2 text-gray-300 hover:text-primary-300 transition-colors'>
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer