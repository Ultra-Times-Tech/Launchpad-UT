import { useState, useEffect } from 'react';
import { apiRequestor } from '../../utils/axiosInstanceHelper';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAlerts from '../../hooks/useAlert';
import { AxiosError } from 'axios';

interface UserWallet {
  field1: string;
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
  wallets?: { [key: string]: UserWallet } | string;
  registerDate?: string; // Format ISO pour datetime
  requireReset?: string;
  resetCount?: string;
  sendEmail?: string;
  sendnotif: string[];
  sendcomm: string[];
}

interface UserAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onSuccess: () => void;
}

// Définir une interface pour le payload de l'API
interface WalletData {
  [key: string]: {
    field1: string;
  };
}

interface ApiUserPayload {
  name: string;
  username: string;
  email: string;
  block: string;
  groups: string[];
  requireReset: string;
  resetCount: string;
  sendEmail: string;
  sendnotif: string[];
  sendcomm: string[];
  wallets: WalletData | string; // Peut être un objet ou une chaîne JSON
  password?: string;
  password2?: string;
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
    registerDate: '',
    requireReset: '0',
    resetCount: '0',
    sendEmail: '0',
    sendnotif: ['0'],
    sendcomm: ['0'],
    wallets: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const availableGroups = [
    { id: '2', name: 'Utilisateurs enregistrés' },
    { id: '6', name: 'Managers' },
    { id: '8', name: 'Super Users' }
  ];
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
          registerDate: '',
          requireReset: '0',
          resetCount: '0',
          sendEmail: '0',
          sendnotif: ['0'],
          sendcomm: ['0'],
          wallets: {},
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
      console.log('Récupération des données utilisateur via API pour ID:', id);
      const response = await apiRequestor.get(`/users/${id}`);
      
      // Afficher la réponse complète pour débogage
      console.log('Réponse API complète:', JSON.stringify(response.data, null, 2));
      
      if (response.data && response.data.data) {
        const userData = response.data.data.attributes;
        
        console.log('Données utilisateur brutes:', userData);
        console.log('Wallets bruts:', userData.wallets);
        
        // Récupérer directement tous les champs pour vérifier s'ils existent
        console.log('Tous les champs disponibles:', Object.keys(userData));
        
        // Vérifier explicitement les champs de notification
        console.log('Champ sendnotif existant:', Object.prototype.hasOwnProperty.call(userData, 'sendnotif'));
        console.log('Valeur sendnotif:', userData.sendnotif);
        console.log('Champ sendcomm existant:', Object.prototype.hasOwnProperty.call(userData, 'sendcomm'));
        console.log('Valeur sendcomm:', userData.sendcomm);
        
        // Convertir les groupes en array de strings si nécessaire
        let groups = ['2']; // Valeur par défaut
        if (userData.groups) {
          groups = Object.keys(userData.groups).map(id => id.toString());
        }
        
        // Normaliser les wallets pour notre format à un seul wallet
        let wallets = {};
        if (userData.wallets) {
          try {
            // Si les wallets sont une chaîne, essayer de la parser
            const parsedWallets = typeof userData.wallets === 'string' 
              ? JSON.parse(userData.wallets) 
              : userData.wallets;
            
            console.log('Wallets après parsing:', parsedWallets);
            
            // Si des wallets existent, les convertir au format field1
            if (parsedWallets && Object.keys(parsedWallets).length > 0) {
              // Convertir tous les wallets au format field1
              const normalizedWallets: {[key: string]: {field1: string}} = {};
              
              for (const key of Object.keys(parsedWallets)) {
                const wallet = parsedWallets[key];
                // Si field1 existe, utiliser sa valeur
                // Si field2 existe, utiliser sa valeur pour field1
                if (wallet.field1) {
                  normalizedWallets[key] = { field1: wallet.field1 };
                } else if (wallet.field2) {
                  console.log(`Conversion de field2 '${wallet.field2}' en field1`);
                  normalizedWallets[key] = { field1: wallet.field2 };
                } else {
                  normalizedWallets[key] = { field1: '' };
                }
              }
              
              wallets = normalizedWallets;
              console.log('Wallets normalisés au format field1:', wallets);
            }
          } catch (err) {
            console.error('Erreur lors du parsing des wallets:', err);
            // En cas d'erreur, laisser wallets vide
          }
        }
        
        // Extraire les préférences de notification
        let sendnotif = ['0'];
        let sendcomm = ['0'];
        
        // GET: Traitement de sendnotif (format objet {1: "Yes"} ou {0: "No"})
        if (typeof userData.sendnotif === 'object' && userData.sendnotif !== null) {
          // Vérifier si la clé "1" existe et a une valeur
          if (userData.sendnotif["1"]) {
            sendnotif = ['1'];
          }
          console.log('sendnotif (format objet):', userData.sendnotif, '→ normalisé à:', sendnotif);
        } else if (Array.isArray(userData.sendnotif)) {
          // Format array ['1']
          sendnotif = userData.sendnotif.includes('1') ? ['1'] : ['0'];
          console.log('sendnotif (format array):', userData.sendnotif, '→ normalisé à:', sendnotif);
        } else if (typeof userData.sendNotif === 'string') {
          // Format chaîne directe
          sendnotif = userData.sendNotif === '1' ? ['1'] : ['0'];
          console.log('sendNotif (format chaîne):', userData.sendNotif, '→ normalisé à:', sendnotif);
        }
        
        // GET: Traitement de sendcomm (format objet {1: "Yes"} ou {0: "No"})
        if (typeof userData.sendcomm === 'object' && userData.sendcomm !== null) {
          // Vérifier si la clé "1" existe et a une valeur
          if (userData.sendcomm["1"]) {
            sendcomm = ['1'];
          }
          console.log('sendcomm (format objet):', userData.sendcomm, '→ normalisé à:', sendcomm);
        } else if (Array.isArray(userData.sendcomm)) {
          // Format array ['1']
          sendcomm = userData.sendcomm.includes('1') ? ['1'] : ['0'];
          console.log('sendcomm (format array):', userData.sendcomm, '→ normalisé à:', sendcomm);
        } else if (typeof userData.sendComm === 'string') {
          // Format chaîne directe
          sendcomm = userData.sendComm === '1' ? ['1'] : ['0'];
          console.log('sendComm (format chaîne):', userData.sendComm, '→ normalisé à:', sendcomm);
        }
        
        // Afficher les valeurs finales pour débogage
        console.log('Préférences de notification extraites:');
        console.log('- sendnotif (final):', sendnotif);
        console.log('- sendcomm (final):', sendcomm);
        
        const formattedData = {
          name: userData.name || '',
          username: userData.username || '',
          email: userData.email || '',
          state: userData.block !== undefined ? userData.block.toString() : '0',
          groups: groups,
          'wallet-id': userData['wallet-id'] || '',
          wallets: wallets,
          registerDate: userData.registerDate || '',
          requireReset: userData.requireReset || '0',
          resetCount: userData.resetCount || '0',
          sendEmail: userData.sendEmail || '0',
          sendnotif: sendnotif,
          sendcomm: sendcomm,
          password: '',
          password2: '',
        };
        
        console.log('Données formatées pour le formulaire:', formattedData);
        
        setFormData(formattedData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError;
        console.error('Détails de l\'erreur de réponse:', axiosError.response?.status, axiosError.response?.data);
      }
      showError('Impossible de charger les données de l\'utilisateur.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWalletChange = (rowKey: string, value: string) => {
    setFormData(prev => {
      const currentWallets = typeof prev.wallets === 'object' ? {...prev.wallets} : {};
      
      return { 
        ...prev, 
        wallets: { 
          ...currentWallets,
          [rowKey]: { field1: value }
        }
      };
    });
  };

  const addWalletRow = () => {
    // Cette fonction n'est plus nécessaire car nous limitons à un seul wallet
    // Mais on peut l'utiliser pour ajouter un wallet vide s'il n'y en a pas
    setFormData(prev => {
      if (prev.wallets && Object.keys(prev.wallets).length > 0) {
        return prev; // Ne rien faire si un wallet existe déjà
      }
      
      return { 
        ...prev, 
        wallets: { 
          row0: { field1: '' } 
        } 
      };
    });
  };

  const removeWalletRow = () => {
    // Supprime le wallet unique
    setFormData(prev => {
      return { 
        ...prev, 
        wallets: {} 
      };
    });
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

  const toggleNotification = (type: 'sendnotif' | 'sendcomm') => {
    setFormData(prev => {
      // S'assurer que la valeur actuelle est une chaîne '0' ou '1'
      const currentValue = prev[type][0] === '1' ? '1' : '0';
      // Basculer entre '0' et '1'
      const newValue = currentValue === '1' ? '0' : '1';
      
      console.log(`Toggle ${type}: ${currentValue} → ${newValue}`);
      
      return {
        ...prev,
        [type]: newValue === '1' ? ['1'] : ['0']
      };
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.username || !formData.email) {
      showError('Veuillez remplir tous les champs obligatoires.');
      return false;
    }

    // Vérification du mot de passe avec les nouvelles règles
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/;

    if (!userId && (!formData.password || !passwordRegex.test(formData.password))) {
      showError('Le mot de passe doit contenir au moins 12 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.');
      return false;
    }

    if (!userId && formData.password !== formData.password2) {
      showError('Les mots de passe ne correspondent pas.');
      return false;
    }

    if (userId && formData.password && formData.password.length > 0 && !passwordRegex.test(formData.password)) {
      showError('Le nouveau mot de passe doit contenir au moins 12 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.');
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
      // POST/PATCH: Toujours envoyer au format array ["1"] ou ["0"]
      // Normaliser les valeurs de notification pour s'assurer qu'elles sont toujours '0' ou '1'
      const normalizedSendnotif = formData.sendnotif[0] === '1' ? '1' : '0';
      const normalizedSendcomm = formData.sendcomm[0] === '1' ? '1' : '0';
      
      // Convertir les valeurs en arrays au format ["0"] ou ["1"] pour l'API
      const sendnotifArray = [normalizedSendnotif === '1' ? "1" : "0"];
      const sendcommArray = [normalizedSendcomm === '1' ? "1" : "0"];
      
      // Préparer les données pour l'API
      const userData: ApiUserPayload = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        block: formData.state,
        groups: formData.groups,
        requireReset: formData.requireReset || '0',
        resetCount: formData.resetCount || '0',
        sendEmail: formData.sendEmail || '0',
        sendnotif: sendnotifArray,
        sendcomm: sendcommArray,
        wallets: formData.wallets || {},
      };
      
      // Afficher les valeurs de notification pour débogage
      console.log('Valeurs de notification envoyées à l\'API:');
      console.log('- sendnotif:', sendnotifArray);
      console.log('- sendcomm:', sendcommArray);
      
      // Ajouter les mots de passe si nécessaire
      if (!userId || (formData.password && formData.password.length > 0)) {
        userData.password = formData.password;
        userData.password2 = formData.password;
      }
      
      // S'assurer que wallets est au bon format
      if (typeof userData.wallets === 'object' && Object.keys(userData.wallets).length > 0) {
        // Si c'est déjà un objet, ne pas le stringifier à nouveau
        console.log('Wallets avant envoi (objet):', userData.wallets);
      } else if (typeof userData.wallets === 'string') {
        try {
          // Si c'est une chaîne, vérifier que c'est un JSON valide
          JSON.parse(userData.wallets);
          console.log('Wallets avant envoi (chaîne JSON):', userData.wallets);
        } catch {
          // Si ce n'est pas un JSON valide, créer un wallet vide
          userData.wallets = {
            row0: {
              field1: ''
            }
          };
        }
      } else {
        // Si c'est vide ou invalide, créer un wallet vide en conservant le format
        userData.wallets = {
          row0: { field1: '' }
        };
      }
      
      console.log('Données complètes envoyées à l\'API:', userData);
      
      if (userId) {
        // Mode édition
        await apiRequestor.patch(`/users/${userId}`, userData);
        success('Utilisateur mis à jour avec succès !');
      } else {
        // Mode création
        await apiRequestor.post('/users', userData);
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
        className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        <div className="flex justify-between items-center p-4 bg-gray-700 sticky top-0 z-10">
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
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 flex-1">
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
                      minLength={12}
                    />
                    <div className="mt-2 text-xs text-gray-400 space-y-1">
                      <p>Le mot de passe doit contenir :</p>
                      <ul className="list-disc list-inside pl-2 space-y-1">
                        <li className={formData.password && formData.password.length >= 12 ? "text-green-500" : ""}>12 caractères minimum</li>
                        <li className={formData.password && /[A-Z]/.test(formData.password) ? "text-green-500" : ""}>1 lettre majuscule</li>
                        <li className={formData.password && /[a-z]/.test(formData.password) ? "text-green-500" : ""}>1 lettre minuscule</li>
                        <li className={formData.password && /\d/.test(formData.password) ? "text-green-500" : ""}>1 chiffre</li>
                        <li className={formData.password && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) ? "text-green-500" : ""}>1 caractère spécial</li>
                      </ul>
                    </div>
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
                      minLength={12}
                    />
                    <p className={`mt-2 text-xs ${formData.password && formData.password2 && formData.password === formData.password2 ? "text-green-500" : "text-gray-400"}`}>
                      Les mots de passe doivent correspondre
                    </p>
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
                      minLength={12}
                    />
                    {formData.password && formData.password.length > 0 && (
                      <div className="mt-2 text-xs text-gray-400 space-y-1">
                        <p>Le mot de passe doit contenir :</p>
                        <ul className="list-disc list-inside pl-2 space-y-1">
                          <li className={formData.password && formData.password.length >= 12 ? "text-green-500" : ""}>12 caractères minimum</li>
                          <li className={formData.password && /[A-Z]/.test(formData.password) ? "text-green-500" : ""}>1 lettre majuscule</li>
                          <li className={formData.password && /[a-z]/.test(formData.password) ? "text-green-500" : ""}>1 lettre minuscule</li>
                          <li className={formData.password && /\d/.test(formData.password) ? "text-green-500" : ""}>1 chiffre</li>
                          <li className={formData.password && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) ? "text-green-500" : ""}>1 caractère spécial</li>
                        </ul>
                      </div>
                    )}
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
                      minLength={12}
                    />
                    {formData.password && formData.password.length > 0 && (
                      <p className={`mt-2 text-xs ${formData.password && formData.password2 && formData.password === formData.password2 ? "text-green-500" : "text-gray-400"}`}>
                        Les mots de passe doivent correspondre
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wallet
                </label>
                <div className="space-y-3">
                  {formData.wallets && typeof formData.wallets === 'object' && Object.keys(formData.wallets).length > 0 ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={(formData.wallets as {[key: string]: UserWallet}).row0?.field1 || ''}
                        onChange={(e) => handleWalletChange('row0', e.target.value)}
                        placeholder="Identifiant du wallet"
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        onClick={removeWalletRow}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                        title="Supprimer le wallet"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={addWalletRow}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      + Ajouter un wallet
                    </button>
                  )}
                </div>
                {userId && (
                  <p className="mt-2 text-xs text-gray-400">
                    L'identifiant du wallet devrait être au format alphanumérique
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-primary-300 mb-4">Préférences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-dark-700">
                    <div>
                      <h4 className="font-medium">Notifications par e-mail</h4>
                      <p className="text-sm text-gray-400">Recevoir des mises à jour par e-mail concernant l'activité</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.sendnotif[0] === '1'} 
                        onChange={() => toggleNotification('sendnotif')} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-dark-700">
                    <div>
                      <h4 className="font-medium">Communications marketing</h4>
                      <p className="text-sm text-gray-400">Recevoir des mises à jour concernant les nouvelles collections</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.sendcomm[0] === '1'} 
                        onChange={() => toggleNotification('sendcomm')} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
              </div>

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