import { GraphQLServer } from 'graphql-yoga'

// Type definitions (schemas)
const typeDefs = `
  type Query {
    greeting(name: String): String!
    me: User!
    post: Post!
    add(a: Float!, b: Float!): Float!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`

// Resolvers
const resolvers = {
  Query: {
    add: (parent, { a = 0, b = 0 }, ctx, info) => {
      return a + b
    },
    greeting: (parent, { name }, ctx, info) => {
      return `Hello ${name || 'Stranger'}!`
    },
    me: () => ({
      id: '8675309',
      name: 'Ryan',
      email: 'mr.magoon5@gmail.com'
    }),
    post: () => ({
      id: '21',
      title: 'hi there I am a post',
      body: 'get posted on',
      published: false
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
