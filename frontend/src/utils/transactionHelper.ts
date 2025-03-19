interface PurchaseTransactionParams {
  blockchainId: string;
  tokenFactoryId: string;
  index: string;
  maxPrice: string;
  memo?: string;
}

export const createMintTransaction = ({
  blockchainId,
  tokenFactoryId,
  index,
  maxPrice,
  memo = ""
}: PurchaseTransactionParams) => {
  return [
    {
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
    }
  ]
} 