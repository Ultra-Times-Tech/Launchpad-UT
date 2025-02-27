import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './views/HomePage';
import CollectionsPage from './views/CollectionsPage';
import CollectionDetailsPage from './views/CollectionDetailsPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionDetailsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;