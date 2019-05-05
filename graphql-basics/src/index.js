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

const comments = [
  {
    id: '1',
    text: 'hello!',
    author: '1',
    post: '3'
  },
  {
    id: '2',
    text: 'celery man!',
    author: '1',
    post: '3'
  },
  {
    id: '3',
    text: 'potatoes!',
    author: '666',
    post: '1'
  },
  {
    id: '4',
    text: 'caribou!',
    author: '2',
    post: '2'
  }
]

// Type definitions (schemas)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    post: Post!
    comments: [Comment!]!
    posts: [Post!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post]!
    comments: [Comment]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    }),
    comments: () => comments,
    posts: () => posts
  },
  Post: {
    author: ({ author }, args, ctx, info) =>
      users.find(({ id }) => id === author),
    comments: (parent, args, ctx, info) =>
      comments.filter(comment => comment.post === parent.id)
  },
  User: {
    posts: (parent, args, ctx, info) =>
      posts.filter(post => post.author === parent.id),
    comments: (parent, args, ctx, info) =>
      comments.filter(comment => comment.author === parent.id)
  },
  Comment: {
    author: (parent, args, ctx, info) => {
      return users.find(user => user.id === parent.author)
    },
    post: (parent, args, ctx, info) => {
      return posts.find(post => post.id === parent.post)
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('The server is up!')
})
