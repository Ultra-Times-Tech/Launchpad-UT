import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './views/HomePage';
import CollectionsPage from './views/CollectionsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/collections" element={<CollectionsPage />} />
    </Routes>
  );
}

export default App;