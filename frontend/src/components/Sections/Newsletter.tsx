function Newsletter() {
  return (
    <div className='container mx-auto px-4 py-12 text-center'>
      <h2 className='text-2xl font-cabin font-bold mb-6 text-primary-300'>Subscribe to our Newsletter</h2>
      <div className='max-w-md mx-auto'>
        <div className='flex'>
          <input type='email' placeholder='Your email address' className='flex-grow px-4 py-3 bg-dark-800 border border-dark-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-quicksand' />
          <button className='bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-r-md transition duration-300'>Subscribe</button>
        </div>
      </div>
    </div>
  )
}

export default Newsletter