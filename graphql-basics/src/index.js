import { GraphQLServer } from 'graphql-yoga'

//Demo User data
const users = [
  {
    id: '1',
    name: 'Ryan',
    email: 'ryan@memelordpavilion.com',
    age: 26
  },
  {
    id: '2',
    name: 'Chuck',
    email: 'chuck@memelordpavilion.com',
    age: 74
  },
  {
    id: '666',
    name: 'Satan',
    email: 'lucifer@memelordpavilion.com',
    age: 2700
  }
]

// Type definitions (schemas)
const typeDefs = `
  type Query {
    users: [User!]!
    me: User!
    post: Post!
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
    users: (parent, args, ctx, info) => {
      return users
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
