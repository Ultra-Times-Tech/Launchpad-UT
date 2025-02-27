import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './views/HomePage';
import CollectionsPage from './views/CollectionsPage';
import CollectionDetailsPage from './views/CollectionDetailsPage';
import MintPage from './views/MintPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-950 text-white">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collection/:id" element={<CollectionDetailsPage />} />
          <Route path="/mint/:category/:id" element={<MintPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;