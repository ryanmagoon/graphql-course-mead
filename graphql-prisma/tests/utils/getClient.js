import 'cross-fetch/polyfill'
import ApolloClient from 'apollo-boost'

const getClient = ({ jwt } = {}) =>
  new ApolloClient({
    uri: 'http://localhost:4000',
    request: operation => {
      if (jwt) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        })
      }
    }
  })

export default getClient
