import {Link} from 'react-router-dom'
import {useTranslation} from '../../hooks/useTranslation'
import {TranslationKey} from '../../types/translations.types'

function PrivacyPolicyPage() {
  const {t} = useTranslation()

  const renderList = (key: TranslationKey) => {
    const items = t(key)
    return Array.isArray(items) ? items.map((item, index) => <li key={index}>{item}</li>) : null
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-primary-300 mb-8'>{t('privacy_title')}</h1>

        <div className='bg-dark-800 rounded-lg p-6 border border-dark-700'>
          <div className='space-y-6'>
            <div>
              <h3 className='text-xl font-bold text-primary-300 mb-4'>{t('privacy_collection_title')}</h3>
              <p className='text-gray-300'>{t('privacy_collection_description')}</p>
              <ul className='list-disc list-inside text-gray-300 mt-2 space-y-2'>{renderList('privacy_collection_list')}</ul>
            </div>

            <div>
              <h3 className='text-xl font-bold text-primary-300 mb-4'>{t('privacy_data_title')}</h3>
              <p className='text-gray-300'>{t('privacy_data_description')}</p>
              <ul className='list-disc list-inside text-gray-300 mt-2 space-y-2'>{renderList('privacy_data_list')}</ul>
            </div>

            <div>
              <h3 className='text-xl font-bold text-primary-300 mb-4'>{t('privacy_protection_title')}</h3>
              <p className='text-gray-300'>{t('privacy_protection_description')}</p>
            </div>

            <div>
              <h3 className='text-xl font-bold text-primary-300 mb-4'>{t('privacy_retention_title')}</h3>
              <p className='text-gray-300'>{t('privacy_retention_description')}</p>
            </div>

            <div>
              <h3 className='text-xl font-bold text-primary-300 mb-4'>{t('privacy_rights_title')}</h3>
              <p className='text-gray-300'>{t('privacy_rights_description')}</p>
              <ul className='list-disc list-inside text-gray-300 mt-2 space-y-2'>{renderList('privacy_rights_list')}</ul>
            </div>

            <div>
              <h3 className='text-xl font-bold text-primary-300 mb-4'>{t('privacy_cookies_title')}</h3>
              <p className='text-gray-300'>{t('privacy_cookies_description')}</p>
              <p className='text-gray-300 mt-2'>{t('privacy_cookies_types')}</p>
              <ul className='list-disc list-inside text-gray-300 mt-2 space-y-2'>{renderList('privacy_cookies_list')}</ul>
              <p className='text-gray-300 mt-2'>{t('privacy_cookies_storage')}</p>
              <p className='text-gray-300 mt-2'>{t('privacy_cookies_options')}</p>
              <ul className='list-disc list-inside text-gray-300 mt-2 space-y-2'>{renderList('privacy_cookies_options_list')}</ul>
              <p className='text-gray-300 mt-2'>{t('privacy_cookies_warning')}</p>
            </div>

            <div>
              <h3 className='text-xl font-bold text-primary-300 mb-4'>{t('privacy_contact_title')}</h3>
              <p className='text-gray-300'>{t('privacy_contact_description')}</p>
            </div>
          </div>
        </div>

        <div className='mt-8 text-center text-gray-400'>
          <p>
            {t('need_help')}{' '}
            <Link to='/contact' className='text-primary-300 hover:text-primary-400'>
              {t('contact_us')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
