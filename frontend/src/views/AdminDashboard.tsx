import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SliderManager from '../components/Admin/SliderManager';
import { FaImages, FaUsers, FaCog } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const contentVariants = {
  initial: { 
    opacity: 0,
    x: -20,
    transition: { duration: 0.3 }
  },
  animate: { 
    opacity: 1,
    x: 0,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    x: 20,
    transition: { duration: 0.2 }
  }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('slider');

  const menuItems: MenuItem[] = [
    { id: 'slider', label: 'Gestion des Sliders', icon: <FaImages /> },
    { id: 'users', label: 'Utilisateurs', icon: <FaUsers /> },
    { id: 'settings', label: 'Paramètres', icon: <FaCog /> },
  ];

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="h-full"
        >
          <DndProvider backend={HTML5Backend}>
            {activeTab === 'slider' && <SliderManager />}
            {activeTab === 'users' && (
              <div className="text-gray-300 p-4 rounded-lg bg-gray-800">
                Gestion des utilisateurs à venir
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="text-gray-300 p-4 rounded-lg bg-gray-800">
                Paramètres à venir
              </div>
            )}
          </DndProvider>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-800 text-gray-100">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-cabin font-bold text-primary-300">Administration</h1>
        </div>
        <nav className="mt-6" role="navigation" aria-label="Menu principal">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center gap-3 px-6 py-4 transition-colors duration-200
                focus-visible:outline-none focus-visible:bg-gray-700
                ${activeTab === item.id 
                  ? 'bg-gray-700 border-l-4 border-primary-400 shadow-lg' 
                  : 'border-l-4 border-transparent hover:bg-gray-700 hover:border-gray-600'}
              `}
            >
              <motion.span 
                className="text-xl" 
                aria-hidden="true"
                whileHover={{ rotate: 5 }}
              >
                {item.icon}
              </motion.span>
              <span className="font-quicksand">{item.label}</span>
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-800">
        <main className="p-4 md:p-8" role="main">
          <motion.div
            className="bg-gray-700 rounded-xl shadow-lg p-6"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2 
              className="text-2xl font-cabin font-bold text-gray-100 mb-6"
              key={activeTab}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {menuItems.find(item => item.id === activeTab)?.label}
            </motion.h2>
            
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 