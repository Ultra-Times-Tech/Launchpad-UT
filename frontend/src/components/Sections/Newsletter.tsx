import {useState} from 'react'
import useAlerts from '../../hooks/useAlert'

function Newsletter() {
  const [email, setEmail] = useState('')
  const {showAlert} = useAlerts()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription
    console.log('Subscribing with:', email)
    showAlert('Thank you for subscribing to our newsletter!', 'success', 5000)
    setEmail('')
  }

  return (
    <section className='container mx-auto px-4 py-16 text-center'>
      <h2 className='text-3xl font-cabin font-bold mb-4 text-primary-300'>Stay Updated with Our Newsletter</h2>
      <p className='text-dark-300 mb-8 max-w-md mx-auto'>Get the latest news and updates directly in your inbox</p>
      <div className='max-w-md mx-auto'>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row shadow-xl rounded-md overflow-hidden border border-dark-700/30'>
          <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Your email address' className='flex-grow px-4 py-3 bg-dark-800 text-white focus:outline-none font-quicksand shadow-inner' required />
          <button type='submit' className='bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/20 active:bg-primary-700'>
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}

export default Newsletter