import {Routes, Route} from 'react-router-dom'
import './App.css'
import HomePage from './views/HomePage'
import CollectionsPage from './views/CollectionsPage'
import CollectionDetailsPage from './views/CollectionDetailsPage'
import MintPage from './views/MintPage'
import FactoryTestPage from './views/FactoryTestPage'
import MintTestPage from './views/MintTestPage'
import Header from './components/Header'
import Footer from './components/Footer'
import {AlertContainer} from './components/Alert/Alert'
import ProfilePage from './views/Profile/ProfilePage'
import MyCollectionsPage from './views/Profile/MyCollectionsPage'
import TransactionsPage from './views/Profile/TransactionsPage'
import MentionsLegalesPage from './views/Legal/LegalPage'
import PrivacyPolicyPage from './views/Legal/PrivacyPolicyPage'
import TermsOfServicePage from './views/Legal/TermsOfServicePage'
import ContactPage from './views/ContactPage'

function App() {
  return (
    <div className='flex flex-col min-h-screen bg-dark-950 text-white'>
      <Header />
      <main className='flex-grow'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/collections' element={<CollectionsPage />} />
          <Route path='/collection/:id' element={<CollectionDetailsPage />} />
          <Route path='/mint/:category/:id' element={<MintPage />} />
          {/* Profile */}
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/my-collections' element={<MyCollectionsPage />} />
          <Route path='/transactions' element={<TransactionsPage />} />
          {/* Legal and contact */}
          <Route path='/legal' element={<MentionsLegalesPage />} />
          <Route path='/privacy' element={<PrivacyPolicyPage />} />
          <Route path='/terms' element={<TermsOfServicePage />} />
          <Route path='/contact' element={<ContactPage />} />
          {/* Test */}
          <Route path='/factory-test' element={<FactoryTestPage />} />
          <Route path='/mint-test' element={<MintTestPage />} />
        </Routes>
      </main>
      <Footer />
      <AlertContainer position='top-right' />
    </div>
  )
}

export default App
