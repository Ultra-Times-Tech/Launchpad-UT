import { useWallet } from "../../context/WalletContext";

interface WalletConnectButtonProps {
  className?: string;
  buttonText?: string;
  connectedText?: string;
  unavailableText?: string;
}

function WalletConnectButton({
  className = 'px-4 py-2 rounded-lg font-medium transition-colors',
  buttonText = 'Connect Ultra Wallet',
  connectedText = 'Disconnect Wallet',
  unavailableText = 'Ultra Wallet Not Found'
}: WalletConnectButtonProps) {
  const { isAvailable, isConnected, account, connect, disconnect } = useWallet();

  const handleClick = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      await connect();
    }
  };

  const getButtonText = () => {
    if (!isAvailable) return unavailableText;
    if (isConnected) {
      return account?.accountName 
        ? `${connectedText}: ${account.accountName.substring(0, 6)}...` 
        : connectedText;
    }
    return buttonText;
  };

  const getButtonClass = () => {
    const baseClass = className;
    if (!isAvailable) return `${baseClass} bg-gray-600 text-white cursor-not-allowed opacity-70`;
    if (isConnected) return `${baseClass} bg-green-600 text-white hover:bg-green-700`;
    return `${baseClass} bg-primary-500 text-white hover:bg-primary-600`;
  };

  return (
    <button
      onClick={handleClick}
      className={getButtonClass()}
      disabled={!isAvailable}
    >
      {getButtonText()}
    </button>
  );
}

export default WalletConnectButton;