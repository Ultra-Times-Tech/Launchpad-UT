import {Link} from 'react-router-dom'
import {useTranslation} from '../../hooks/useTranslation'
import {AppRouteKey} from '../../contexts/TranslationContext'

function LegalPage() {
  const {t, generateLocalizedPath} = useTranslation()

  return (
    <div className="min-h-screen bg-dark-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-300 mb-8">{t('legal_title')}</h1>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">{t('legal_info_title')}</h3>
              <p className="text-gray-300">
                {t('legal_info_description')}
              </p>
              <p className="text-gray-300 mt-2">
                {t('legal_company_info')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">{t('legal_director_title')}</h3>
              <p className="text-gray-300">
                {t('legal_director_info')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">{t('legal_hosting_title')}</h3>
              <p className="text-gray-300">
                {t('legal_hosting_info')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">{t('legal_data_title')}</h3>
              <p className="text-gray-300">
                {t('legal_data_info')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400">
          <p>
            {t('need_help')}{' '}
            <Link 
              to={generateLocalizedPath('contact' as AppRouteKey)} 
              className="text-primary-300 hover:text-primary-400"
            >
              {t('contact_us')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LegalPage 