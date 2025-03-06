import { useQuery } from '@apollo/client'
import { GET_FACTORY } from '../services/graphql/queries'
import type { FactoryResponse, FactoryVars } from '../types/factory'

export const useFactory = (factoryId: string) => {
  const { data, loading, error } = useQuery<FactoryResponse, FactoryVars>(
    GET_FACTORY,
    {
      variables: { id: factoryId },
    }
  )

  return {
    factory: data?.uniqFactory,
    loading,
    error,
  }
}