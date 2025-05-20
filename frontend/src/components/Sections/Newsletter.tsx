import {useState} from 'react'
import {useTranslation} from '../../hooks/useTranslation'
import useAlerts from '../../hooks/useAlert'

function Newsletter() {
  const [email, setEmail] = useState('')
  const {showAlert} = useAlerts()
  const {t} = useTranslation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showAlert(t('newsletter_success'), 'success', 5000)
    setEmail('')
  }

  return (
    <section className='container mx-auto px-4 py-16 text-center'>
      <h2 className='text-3xl font-cabin font-bold mb-4 text-primary-300'>{t('newsletter_title')}</h2>
      <p className='text-dark-300 mb-8 max-w-md mx-auto'>{t('newsletter_description')}</p>
      <div className='max-w-md mx-auto'>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row shadow-xl rounded-md overflow-hidden border border-dark-700/30'>
          <input 
            type='email' 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder={t('newsletter_placeholder')} 
            className='flex-grow px-4 py-3 bg-dark-800 text-white focus:outline-none font-quicksand shadow-inner' 
            required 
          />
          <button 
            type='submit' 
            className='bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/20 active:bg-primary-700'
          >
            {t('newsletter_button')}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Newsletter