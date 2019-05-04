import { GraphQLServer } from 'graphql-yoga'

// Type definitions (schemas)
const typeDefs = `
  type Query {
    hello: String!
    name: String!
  }
`

// Resolvers
const resolvers = {
  Query: {
    hello: () => 'This is my first query!',
    name: () => 'Ryan Magoon'
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('The server is up!')
})
