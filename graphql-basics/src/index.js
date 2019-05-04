import { GraphQLServer } from 'graphql-yoga'

// Type definitions (schemas)
const typeDefs = `
  type Query {
    me: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
`

// Resolvers
const resolvers = {
  Query: {
    me: () => ({
      id: '8675309',
      name: 'Ryan',
      email: 'mr.magoon5@gmail.com'
    })
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('The server is up!')
})
