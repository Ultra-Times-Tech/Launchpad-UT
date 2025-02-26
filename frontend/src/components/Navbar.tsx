import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-white text-xl font-bold">Launchpad UT</Link>
          <div className="flex space-x-6">
            <Link to="/" className="text-white hover:text-blue-400 transition">Home</Link>
            <Link to="/collections" className="text-white hover:text-blue-400 transition">Collections</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;