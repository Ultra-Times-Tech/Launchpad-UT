import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SliderManager from '../components/Admin/SliderManager';
import UserManager from '../components/Admin/UserManager';
import { FaImages, FaUsers, FaCog } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  const menuItems: MenuItem[] = [
    { id: 'slider', label: t('admin_slider_management'), icon: <FaImages /> },
    { id: 'users', label: t('admin_users'), icon: <FaUsers /> },
    { id: 'settings', label: t('admin_settings'), icon: <FaCog /> },
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
            {activeTab === 'users' && <UserManager />}
            {activeTab === 'settings' && (
              <div className="text-gray-300 p-4 rounded-lg bg-gray-800">
                {t('admin_settings_coming_soon')}
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
      <div className="w-full md:w-64 bg-gray-800 text-gray-100" data-aos="fade-right">
        <div className="p-6 border-b border-gray-700" data-aos="fade-down" data-aos-delay="100">
          <h1 className="text-2xl font-cabin font-bold text-primary-300">{t('admin_title')}</h1>
        </div>
        <nav className="mt-6" role="navigation" aria-label="Menu principal">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              data-aos="fade-right"
              data-aos-delay={100 * (index + 1)}
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
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <motion.h2 
              className="text-2xl font-cabin font-bold text-gray-100 mb-6"
              key={activeTab}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              data-aos="fade-down"
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