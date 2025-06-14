import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useUltraWallet } from '../../utils/ultraWalletHelper';
import { getAssetUrl } from '../../utils/imageHelper';
import { FaWallet, FaCreditCard } from 'react-icons/fa';

interface PaymentSelectorProps {
  amount: string;
  quantity?: number;
  onPaymentComplete: (success: boolean, paymentMethod: 'wallet' | 'card') => void;
}

// Composant pour le formulaire de carte bancaire
const CardPaymentForm: React.FC<{ onSubmit: (success: boolean) => void; onCancel: () => void }> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatage automatique pour le numéro de carte
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }
    
    // Formatage automatique pour la date d'expiration
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }
    
    // Limitation du CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulation d'un traitement de paiement
    setTimeout(() => {
      setIsProcessing(false);
      onSubmit(true); // Simuler un succès pour la démo
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">{t('card_payment_details')}</h3>
        <p className="text-gray-400 text-sm">{t('enter_card_information')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('cardholder_name')}</label>
          <input
            type="text"
            name="cardholderName"
            value={formData.cardholderName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors hover:border-primary-500/50"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('card_number')}</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors hover:border-primary-500/50"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('expiry_date')}</label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors hover:border-primary-500/50"
              placeholder="MM/YY"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('cvv')}</label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors hover:border-primary-500/50"
              placeholder="123"
              required
            />
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 rounded-lg font-medium bg-dark-600 hover:bg-dark-500 text-white transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              isProcessing
                ? 'bg-dark-600 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-500 text-white'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{t('processing_payment')}</span>
              </div>
            ) : (
              t('confirm_payment')
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const PaymentSelector: React.FC<PaymentSelectorProps> = ({ amount, quantity = 1, onPaymentComplete }) => {
  const { t } = useTranslation();
  const { isConnected, blockchainId } = useUltraWallet();
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'card'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  // Fonction pour convertir UOS en EUR approximatif (taux fictif pour la démo)
  const convertToEur = (uosAmount: string): string => {
    const numericAmount = parseFloat(uosAmount.split(' ')[0]);
    const eurAmount = (numericAmount * 0.85).toFixed(2); // Taux fictif 1 UOS = 0.85 EUR
    return `~${eurAmount} €`;
  };

  const handleWalletPayment = async () => {
    if (!isConnected || !blockchainId) {
      onPaymentComplete(false, 'wallet');
      return;
    }

    // Pour le paiement wallet, on laisse MintPage gérer la transaction
    // On confirme juste que l'utilisateur est connecté et prêt
    onPaymentComplete(true, 'wallet');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      if (selectedMethod === 'wallet') {
        await handleWalletPayment();
      } else {
        // Afficher le formulaire de carte
        setShowCardForm(true);
      }
    } catch (error) {
      console.error('Erreur de paiement:', error);
      onPaymentComplete(false, selectedMethod);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPaymentComplete = (success: boolean) => {
    setShowCardForm(false);
    onPaymentComplete(success, 'card');
  };

  // Afficher le formulaire de carte si sélectionné
  if (showCardForm) {
    return (
      <CardPaymentForm 
        onSubmit={handleCardPaymentComplete}
        onCancel={() => setShowCardForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{t('payment_method')}</h3>
        <p className="text-gray-400">{t('choose_payment_method')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Option de paiement par wallet Ultra */}
        <div 
          className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
            selectedMethod === 'wallet' 
              ? 'border-primary-500 bg-primary-500/10 shadow-lg' 
              : 'border-dark-600 hover:border-primary-500/50 bg-dark-700/50 hover:bg-dark-700'
          }`}
          onClick={() => setSelectedMethod('wallet')}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                selectedMethod === 'wallet' ? 'border-primary-500 bg-primary-500' : 'border-dark-500'
              }`}>
                {selectedMethod === 'wallet' && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="p-3 rounded-lg bg-primary-500/20">
                <FaWallet className="w-6 h-6 text-primary-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-white">{t('ultra_wallet_payment')}</h4>
              <p className="text-gray-400 text-sm">{t('ultra_wallet_payment_description')}</p>
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-xs">{t('wallet_connected')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Option de paiement par carte bancaire */}
        <div 
          className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
            selectedMethod === 'card' 
              ? 'border-primary-500 bg-primary-500/10 shadow-lg' 
              : 'border-dark-600 hover:border-primary-500/50 bg-dark-700/50 hover:bg-dark-700'
          }`}
          onClick={() => setSelectedMethod('card')}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                selectedMethod === 'card' ? 'border-primary-500 bg-primary-500' : 'border-dark-500'
              }`}>
                {selectedMethod === 'card' && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="p-3 rounded-lg bg-blue-500/20">
                <FaCreditCard className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-white">{t('card_payment')}</h4>
              <p className="text-gray-400 text-sm">{t('card_payment_description')}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-xs">{t('secure_payment')}</span>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-white rounded-lg p-2 shadow-md">
                    <img src={getAssetUrl('/payment/visa.svg')} alt="Visa" className="h-8 w-auto" />
                  </div>
                  <div className="bg-white rounded-lg p-2 shadow-md">
                    <img src={getAssetUrl('/payment/mastercard.svg')} alt="Mastercard" className="h-8 w-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Résumé du paiement */}
      <div className="bg-dark-700 rounded-xl p-6 border border-dark-600">
        <div className="text-center space-y-3">
          <div className="text-gray-400 font-medium">{t('total_amount')}</div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-white">
              {amount}
            </div>
            <div className="text-lg text-gray-400">{convertToEur(amount)}</div>
          </div>
        </div>
      </div>

      {/* Bouton de paiement */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
          isProcessing
            ? 'bg-dark-600 text-gray-500 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-white font-medium">
              {selectedMethod === 'wallet' ? t('opening_wallet') : t('processing_payment')}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>{selectedMethod === 'wallet' ? t('pay_with_wallet') : t('pay_with_card')}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        )}
      </button>


    </div>
  );
};

export default PaymentSelector; 
