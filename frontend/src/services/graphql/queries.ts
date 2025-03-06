import {gql} from '@apollo/client'

export const GET_FACTORY = gql`
  query UniqFactory($id: BigInt!) {
    uniqFactory(id: $id) {
      id
      metadata {
        content {
          name
          description
          medias {
            square {
              uri
            }
          }
        }
      }
      firsthandPurchases {
        price {
          amount
          currency {
            code
            symbol
          }
        }
      }
      stock {
        authorized
        existing
        maxMintable
        mintable
        minted
      }
      status
      type
    }
  }
`