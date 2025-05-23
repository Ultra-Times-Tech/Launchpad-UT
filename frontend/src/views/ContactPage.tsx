import {useState, useEffect} from 'react'
import {useTranslation} from '../hooks/useTranslation'
import {getTwitterLink} from '../utils/generalHelper'
import AOS from 'aos'
import 'aos/dist/aos.css'
import axios, { AxiosError } from 'axios';
import { ApiErrorResponse, ApiSuccessResponse } from '../types/api.types';
import useAlerts from '../hooks/useAlert';

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

function ContactPage() {
  const {t, currentLang} = useTranslation()
  const { showAlert } = useAlerts();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic',
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await axios.post<ApiSuccessResponse>('/api/emails/contact', formData);
      
      if (response.status === 200) {
        setFormData({name: '', email: '', subject: '', message: ''});
        showAlert(t('contact_success') || 'Message sent successfully!', 'success');
      } else {
        const messageToShow = response.data?.message || t('contact_error') || 'Failed to send message.';
        showAlert(messageToShow, 'error');
      }
    } catch (err: unknown) {
      console.error("Erreur lors de l'envoi du message:", err);
      let finalErrorMessage = t('contact_error') || 'Failed to send message.';
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ApiErrorResponse>; 
        if (error.response && error.response.data && error.response.data.message) {
          if (Array.isArray(error.response.data.message)) {
            finalErrorMessage = error.response.data.message.join(', ');
          } else if (typeof error.response.data.message === 'string'){
            finalErrorMessage = error.response.data.message;
          }
        }
      }
      showAlert(finalErrorMessage, 'error');
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name, value} = e.target
    setFormData(prev => ({...prev, [name]: value}))
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white p-8 overflow-x-hidden'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-primary-300 mb-8' data-aos="fade-down">{t('contact_us')}</h1>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Informations de contact */}
          <div className='bg-dark-800 rounded-lg p-6 border border-dark-700' data-aos="fade-right" data-aos-delay="100">
            <h2 className='text-2xl font-bold text-primary-300 mb-6' data-aos="fade-down" data-aos-delay="200">{t('contact_info')}</h2>

            <div className='space-y-6'>
              <div data-aos="fade-up" data-aos-delay="300">
                <h3 className='text-lg font-semibold text-white mb-2'>{t('contact_address')}</h3>
                <p className='text-gray-300'>
                  123 Rue de l'Innovation
                  <br />
                  75000 Paris
                  <br />
                  France
                </p>
              </div>

              <div data-aos="fade-up" data-aos-delay="400">
                <h3 className='text-lg font-semibold text-white mb-2'>{t('contact_email')}</h3>
                <p className='text-gray-300'>
                  <a href='mailto:info@ultratimes.io' className='text-primary-300 hover:text-primary-400'>
                    info@ultratimes.io
                  </a>
                </p>
              </div>

              <div data-aos="fade-up" data-aos-delay="500">
                <h3 className='text-lg font-semibold text-white mb-2'>{t('contact_hours')}</h3>
                <p className='text-gray-300'>
                  {t('contact_hours_monday_friday')}
                  <br />
                  {t('contact_hours_saturday')}
                  <br />
                  {t('contact_hours_sunday')} {t('contact_hours_closed')}
                </p>
              </div>

              <div data-aos="fade-up" data-aos-delay="600">
                <h3 className='text-lg font-semibold text-white mb-2'>{t('contact_follow')}</h3>
                <div className='flex space-x-4'>
                  <a href='https://discord.gg/AQAAjF8vBJ' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-primary-300 transition-colors'>
                    <span className='sr-only'>Discord</span>
                    <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z' />
                    </svg>
                  </a>
                  <a href={getTwitterLink(currentLang)} target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-primary-300 transition-colors'>
                    <span className='sr-only'>Twitter</span>
                    <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
                    </svg>
                  </a>
                  <a href='https://www.linkedin.com/company/ultra-times/' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-primary-300 transition-colors'>
                    <span className='sr-only'>LinkedIn</span>
                    <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className='bg-dark-800 rounded-lg p-6 border border-dark-700' data-aos="fade-left" data-aos-delay="100">
            <h2 className='text-2xl font-bold text-primary-300 mb-6' data-aos="fade-down" data-aos-delay="200">{t('contact_send_message')}</h2>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div data-aos="fade-up" data-aos-delay="300">
                <label htmlFor='name' className='block text-sm font-medium text-gray-300 mb-1'>
                  {t('contact_name')}
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400'
                  placeholder={t('contact_name_placeholder')}
                />
              </div>

              <div data-aos="fade-up" data-aos-delay="400">
                <label htmlFor='email' className='block text-sm font-medium text-gray-300 mb-1'>
                  {t('contact_email')}
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400'
                  placeholder={t('contact_email_placeholder')}
                />
              </div>

              <div data-aos="fade-up" data-aos-delay="500">
                <label htmlFor='subject' className='block text-sm font-medium text-gray-300 mb-1'>
                  {t('contact_subject')}
                </label>
                <select
                  id='subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white'
                >
                  <option value=''>{t('contact_subject_placeholder')}</option>
                  <option value='support'>{t('contact_subject_support')}</option>
                  <option value='billing'>{t('contact_subject_billing')}</option>
                  <option value='partnership'>{t('contact_subject_partnership')}</option>
                  <option value='other'>{t('contact_subject_other')}</option>
                </select>
              </div>

              <div data-aos="fade-up" data-aos-delay="600">
                <label htmlFor='message' className='block text-sm font-medium text-gray-300 mb-1'>
                  {t('contact_message')}
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className='w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400'
                  placeholder={t('contact_message_placeholder')}
                />
              </div>

              <div data-aos="fade-up" data-aos-delay="700">
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? t('contact_sending') : t('contact_send')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
