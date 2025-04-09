import {Routes, Route} from 'react-router-dom'
import './App.css'
import HomePage from './views/HomePage'
import CollectionsPage from './views/CollectionsPage'
import CollectionDetailsPage from './views/CollectionDetailsPage'
import MintPage from './views/MintPage'
import FactoryTestPage from './views/FactoryTestPage'
import MintTestPage from './views/MintTestPage'
import CollectionsTestPage from './views/CollectionsTestPage'
import Header from './components/Header'
import Footer from './components/Footer'
import {AlertContainer} from './components/Alert/Alert'
import ProfilePage from './views/Profile/ProfilePage'
import MyCollectionsPage from './views/Profile/MyCollectionsPage'
import MainContent from './components/MainContent'
import MentionsLegalesPage from './views/Legal/LegalPage'
import PrivacyPolicyPage from './views/Legal/PrivacyPolicyPage'
import TermsOfServicePage from './views/Legal/TermsOfServicePage'
import ContactPage from './views/ContactPage'
import AdminDashboard from './views/AdminDashboard'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <div className='flex flex-col min-h-screen bg-dark-950 text-white'>
      <Header />
      <MainContent>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/collections' element={<CollectionsPage />} />
          <Route path='/collection/:id' element={<CollectionDetailsPage />} />
          <Route path='/mint/:category/:id' element={<MintPage />} />
          {/* Profile */}
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/my-collections' element={<MyCollectionsPage />} />
          {/* Admin */}
          <Route path='/admin-ut' element={<AdminDashboard />} />
          {/* Legal and contact */}
          <Route path='/legal' element={<MentionsLegalesPage />} />
          <Route path='/privacy' element={<PrivacyPolicyPage />} />
          <Route path='/terms' element={<TermsOfServicePage />} />
          <Route path='/contact' element={<ContactPage />} />
          {/* Test */}
          <Route path='/factory-test' element={<FactoryTestPage />} />
          <Route path='/mint-test' element={<MintTestPage />} />
          <Route path='/collections-test' element={<CollectionsTestPage />} />
        </Routes>
      </MainContent>
      <Footer />
      <AlertContainer position='top-right' />
    </div>
  )
}

export default App
