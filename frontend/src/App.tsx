import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './views/HomePage';
import CollectionsPage from './views/CollectionsPage';
import CollectionDetailsPage from './views/CollectionDetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/collections/:id" element={<CollectionDetailsPage />} />
    </Routes>
  );
}

export default App;