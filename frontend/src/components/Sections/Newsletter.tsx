import {useState} from 'react'
import {useTranslation} from '../../hooks/useTranslation'
import useAlerts from '../../hooks/useAlert'
import axios, { AxiosError } from 'axios'
import { ApiErrorResponse, ApiSuccessResponse } from '../../types/api.types'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const {showAlert} = useAlerts()
  const {t} = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      showAlert(t('newsletter_error_empty') || 'Please enter your email.', 'error')
      return
    }
    setIsLoading(true)
    try {
      // Typer la réponse attendue pour axios.post
      const response = await axios.post<ApiSuccessResponse>('/api/emails/subscribe', {email})
      
      if (response.status === 200) {
        showAlert(t('newsletter_success') || 'Successfully subscribed!', 'success', 5000)
        setEmail('')
      } else {
        // Utiliser response.data.message si disponible, sinon texte par défaut
        showAlert(response.data?.message || t('newsletter_error_generic') || 'Subscription failed. Please try again.', 'error')
      }
    } catch (err: unknown) { // Changer 'any' pour 'unknown' pour un typage plus sûr
      console.error('Newsletter subscription error:', err)
      let errorMessage = t('newsletter_error_generic') || 'Subscription failed. Please try again.'
      
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ApiErrorResponse>; // Assertion de type après vérification
        if (error.response && error.response.data && error.response.data.message) {
          if (Array.isArray(error.response.data.message)) {
            errorMessage = error.response.data.message.join(', ');
          } else if (typeof error.response.data.message === 'string'){
            errorMessage = error.response.data.message;
          }
        }
      } 
      // Si ce n'est pas une AxiosError ou ne correspond pas à la structure attendue, le message générique est utilisé.
      showAlert(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
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
            className={`bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/20 active:bg-primary-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (t('newsletter_loading') || 'Subscribing...') : (t('newsletter_button') || 'Subscribe')}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Newsletter