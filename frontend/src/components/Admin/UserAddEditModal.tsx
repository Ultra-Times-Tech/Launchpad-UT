import { useState, useEffect } from 'react';
import { apiRequestor } from '../../utils/axiosInstanceHelper';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAlerts from '../../hooks/useAlert';

interface UserWallet {
  field2: string;
}

interface UserData {
  name: string;
  username: string;
  email: string;
  state: string;
  password?: string;
  password2?: string;
  groups: string[];
  'wallet-id'?: string;
  wallets?: { [key: string]: UserWallet };
}

interface UserAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onSuccess: () => void;
}

const UserAddEditModal = ({ isOpen, onClose, userId, onSuccess }: UserAddEditModalProps) => {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    username: '',
    email: '',
    state: '0',
    password: '',
    password2: '',
    groups: ['2'], // Groupe utilisateur par défaut
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [availableGroups, setAvailableGroups] = useState<{id: string, name: string}[]>([
    { id: '2', name: 'Utilisateurs enregistrés' },
    { id: '6', name: 'Managers' },
    { id: '8', name: 'Super Users' }
  ]);
  const { success, error: showError } = useAlerts();

  // Gérer l'ouverture/fermeture de la modal
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      
      // Réinitialiser le formulaire d'abord
      if (!userId) {
        setFormData({
          name: '',
          username: '',
          email: '',
          state: '0',
          password: '',
          password2: '',
          groups: ['2'],
        });
        setIsLoading(false);
      } else {
        // Charger les données utilisateur en mode édition
        fetchUserData(userId);
      }
      
      // Afficher la modal seulement après 50ms pour s'assurer que les données sont prêtes
      setTimeout(() => {
        setIsVisible(true);
      }, 50);
    } else {
      // Masquer immédiatement la modal lors de la fermeture
      setIsVisible(false);
    }
  }, [isOpen, userId]);

  const fetchUserData = async (id: string) => {
    try {
      const response = await apiRequestor.get(`/users/${id}`);
      if (response.data && response.data.data) {
        const userData = response.data.data.attributes;
        
        // Convertir les groupes en array de strings si nécessaire
        let groups = ['2']; // Valeur par défaut
        if (userData.groups) {
          groups = Object.keys(userData.groups).map(id => id.toString());
        }
        
        setFormData({
          name: userData.name || '',
          username: userData.username || '',
          email: userData.email || '',
          state: userData.block.toString() || '0',
          groups: groups,
          'wallet-id': userData['wallet-id'] || '',
          wallets: userData.wallets || {},
          password: '',
          password2: '',
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
      showError('Impossible de charger les données de l\'utilisateur.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleGroup = (groupId: string) => {
    setFormData(prev => {
      if (prev.groups.includes(groupId)) {
        // Ne pas permettre de désélectionner tous les groupes
        if (prev.groups.length === 1) {
          return prev;
        }
        return { ...prev, groups: prev.groups.filter(id => id !== groupId) };
      } else {
        return { ...prev, groups: [...prev.groups, groupId] };
      }
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.username || !formData.email) {
      showError('Veuillez remplir tous les champs obligatoires.');
      return false;
    }

    if (!userId && (!formData.password || formData.password.length < 8)) {
      showError('Le mot de passe doit contenir au moins 8 caractères.');
      return false;
    }

    if (!userId && formData.password !== formData.password2) {
      showError('Les mots de passe ne correspondent pas.');
      return false;
    }

    if (userId && formData.password && formData.password.length > 0 && formData.password.length < 8) {
      showError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return false;
    }

    if (userId && formData.password && formData.password !== formData.password2) {
      showError('Les mots de passe ne correspondent pas.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const payload = { ...formData };
      
      // Si c'est une mise à jour sans changement de mot de passe
      if (userId && (!payload.password || payload.password === '')) {
        delete payload.password;
        delete payload.password2;
      }
      
      if (userId) {
        // Mode édition
        await apiRequestor.patch(`/users/${userId}`, payload);
        success('Utilisateur mis à jour avec succès !');
      } else {
        // Mode création
        await apiRequestor.post('/users', payload);
        success('Utilisateur créé avec succès !');
      }
      
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      showError('Impossible d\'enregistrer l\'utilisateur.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    // Un petit délai avant d'appeler onClose pour que l'animation de fermeture soit visible
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si l'utilisateur clique sur le fond (et non sur le contenu de la modal), fermer la modal
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 bg-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {userId ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-600 transition-colors"
            aria-label="Fermer"
          >
            <FaTimes className="text-gray-300" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-400">Chargement des données...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                  Nom d'utilisateur *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">
                  Statut
                </label>
                <div className="relative">
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                  >
                    <option value="0">Actif</option>
                    <option value="1">Bloqué</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {!userId && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                      Mot de passe *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required={!userId}
                      minLength={8}
                    />
                  </div>

                  <div>
                    <label htmlFor="password2" className="block text-sm font-medium text-gray-300 mb-1">
                      Confirmer le mot de passe *
                    </label>
                    <input
                      type="password"
                      id="password2"
                      name="password2"
                      value={formData.password2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required={!userId}
                    />
                  </div>
                </div>
              )}

              {userId && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Laisser vide pour ne pas changer"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      minLength={8}
                    />
                  </div>

                  <div>
                    <label htmlFor="password2" className="block text-sm font-medium text-gray-300 mb-1">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      id="password2"
                      name="password2"
                      value={formData.password2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Groupes d'utilisateurs
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableGroups.map(group => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className={`flex items-center px-3 py-2 rounded-full border transition-all ${
                        formData.groups.includes(group.id) 
                          ? 'bg-primary-600 border-primary-500 text-white' 
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {formData.groups.includes(group.id) && (
                        <FaCheck className="mr-2 h-3 w-3" />
                      )}
                      <span>{group.name}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Cliquez sur un groupe pour le sélectionner/désélectionner
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </span>
                ) : (
                  'Enregistrer'
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default UserAddEditModal; 