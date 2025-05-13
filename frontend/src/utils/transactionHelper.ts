interface PurchaseTransactionParams {
  blockchainId: string;
  tokenFactoryId: string;
  index: string;
  maxPrice: string;
  memo?: string;
  quantity?: number;
}

/**
 * Calcule le prix total en fonction de la quantité et du prix unitaire
 * @param unitPrice - Prix unitaire (peut être au format '10.00000000 UOS')
 * @param quantity - Quantité désirée
 * @returns Le prix total formaté (ex: '20.00000000 UOS')
 */
export const calculateTotalPrice = (unitPrice: string, quantity: number = 1): string => {
  const [priceValue, currency] = unitPrice.split(' ');
  const numericPrice = parseFloat(priceValue);
  const totalPrice = (numericPrice * quantity).toFixed(8);
  return `${totalPrice} ${currency}`;
};

export const createMintTransaction = ({
  blockchainId,
  tokenFactoryId,
  index,
  maxPrice,
  memo = "",
  quantity = 1
}: PurchaseTransactionParams) => {
  // Crée un tableau de transactions identiques basé sur la quantité
  const transactions = Array(quantity).fill(null).map(() => ({
    contract: "eosio.nft.ft",
    action: "purchase.a",
    data: {
      purchase: {
        token_factory_id: tokenFactoryId,
        index: index,
        max_price: maxPrice,
        buyer: blockchainId,
        receiver: blockchainId,
        promoter_id: null,
        user_uniqs: null,
        memo: memo
      }
    },
    authorization: [
      {
        actor: blockchainId,
        permission: "active"
      }
    ]
  }));

  return transactions;
} 