import {useState} from 'react'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simuler l'envoi du formulaire
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({name: '', email: '', subject: '', message: ''})
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name, value} = e.target
    setFormData(prev => ({...prev, [name]: value}))
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-primary-300 mb-8'>Contactez-nous</h1>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Informations de contact */}
          <div className='bg-dark-800 rounded-lg p-6 border border-dark-700'>
            <h2 className='text-2xl font-bold text-primary-300 mb-6'>Informations</h2>

            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold text-white mb-2'>Adresse</h3>
                <p className='text-gray-300'>
                  123 Rue de l'Innovation
                  <br />
                  75000 Paris
                  <br />
                  France
                </p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-white mb-2'>Email</h3>
                <p className='text-gray-300'>
                  <a href='mailto:contact@ultratimes.com' className='text-primary-300 hover:text-primary-400'>
                    contact@ultratimes.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-white mb-2'>Horaires</h3>
                <p className='text-gray-300'>
                  Lundi - Vendredi : 9h00 - 18h00
                  <br />
                  Samedi : 10h00 - 16h00
                  <br />
                  Dimanche : Fermé
                </p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-white mb-2'>Suivez-nous</h3>
                <div className='flex space-x-4'>
                  <a href='#' className='text-gray-400 hover:text-primary-300 transition-colors'>
                    <span className='sr-only'>Twitter</span>
                    <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
                    </svg>
                  </a>
                  <a href='#' className='text-gray-400 hover:text-primary-300 transition-colors'>
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
          <div className='bg-dark-800 rounded-lg p-6 border border-dark-700'>
            <h2 className='text-2xl font-bold text-primary-300 mb-6'>Envoyez-nous un message</h2>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-300 mb-1'>
                  Nom
                </label>
                <input type='text' id='name' name='name' value={formData.name} onChange={handleChange} required className='w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400' placeholder='Votre nom' />
              </div>

              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-300 mb-1'>
                  Email
                </label>
                <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} required className='w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400' placeholder='votre@email.com' />
              </div>

              <div>
                <label htmlFor='subject' className='block text-sm font-medium text-gray-300 mb-1'>
                  Sujet
                </label>
                <select id='subject' name='subject' value={formData.subject} onChange={handleChange} required className='w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white'>
                  <option value=''>Sélectionnez un sujet</option>
                  <option value='support'>Support technique</option>
                  <option value='billing'>Facturation</option>
                  <option value='partnership'>Partenariat</option>
                  <option value='other'>Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor='message' className='block text-sm font-medium text-gray-300 mb-1'>
                  Message
                </label>
                <textarea id='message' name='message' value={formData.message} onChange={handleChange} required rows={4} className='w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400' placeholder='Votre message...' />
              </div>

              <button type='submit' disabled={isSubmitting} className='w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>

              {submitStatus === 'success' && <div className='p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300'>Votre message a été envoyé avec succès !</div>}

              {submitStatus === 'error' && <div className='p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300'>Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
