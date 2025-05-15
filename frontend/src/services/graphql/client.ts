import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const httpLink = createHttpLink({
  uri: '/api/auth/graphql',
  credentials: 'include',
})

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})