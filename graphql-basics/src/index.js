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

const posts = [
  {
    id: '1',
    title: 'my first post',
    body: 'I like turtles',
    published: true,
    author: '2'
  },
  {
    id: '2',
    title: 'my second post',
    body: 'I like buffalo',
    published: false,
    author: '1'
  },
  {
    id: '3',
    title: 'my third post',
    body: 'I like turkeys',
    published: true,
    author: '666'
  }
]

// Type definitions (schemas)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
`

// Resolvers
const resolvers = {
  Query: {
    users: (parent, { query }, ctx, info) => {
      return query
        ? users.filter(({ name }) =>
            name.toLowerCase().includes(query.toLowerCase())
          )
        : users
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
  },
  Post: {
    author: ({ author }, { id }, ctx, info) =>
      users.find(({ id }) => id === author)
  },
  User: {
    posts: (parent, args, ctx, info) =>
      posts.filter(post => post.author === parent.id)
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('The server is up!')
})
