import {Link} from 'react-router-dom'
import {useTranslation} from '../../hooks/useTranslation'
import {AppRouteKey} from '../../contexts/TranslationContext'

function TermsOfServicePage() {
  const {t, generateLocalizedPath} = useTranslation()

  return (
    <div className="min-h-screen bg-dark-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-300 mb-8">{t('terms_title')}</h1>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">{t('terms_intro_title')}</h3>
              <p className="text-gray-300">
                {t('terms_intro_description')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">{t('terms_service_title')}</h3>
              <p className="text-gray-300">
                {t('terms_service_description')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">{t('terms_pricing_title')}</h3>
              <p className="text-gray-300">
                {t('terms_pricing_description')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">{t('terms_delivery_title')}</h3>
              <p className="text-gray-300">
                {t('terms_delivery_description')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">{t('terms_warranty_title')}</h3>
              <p className="text-gray-300">
                {t('terms_warranty_description')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">{t('terms_law_title')}</h3>
              <p className="text-gray-300">
                {t('terms_law_description')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">{t('terms_consumer_title')}</h3>
              <p className="text-gray-300">
                {t('terms_consumer_description')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">{t('terms_contact_title')}</h3>
              <p className="text-gray-300">
                {t('terms_contact_description')}
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

export default TermsOfServicePage 