import { GraphQLServer } from 'graphql-yoga'

// Type definitions (schemas)
const typeDefs = `
  type Query {
    id: ID!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float
  }
`

// Resolvers
const resolvers = {
  Query: {
    id: () => 'abc123',
    name: () => 'bilbo',
    age: () => 26,
    employed: () => true,
    gpa: () => 1.7
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('The server is up!')
})
