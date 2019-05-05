import { GraphQLServer } from 'graphql-yoga'
import uuid from 'uuid/v4'

//Demo User data
let users = [
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
    id: '3',
    name: 'Satan',
    email: 'lucifer@memelordpavilion.com',
    age: 2700
  }
]

let posts = [
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
    author: '3'
  }
]

let comments = [
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
    author: '3',
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

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    deleteUser(id: ID!): User!
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
  Mutation: {
    createUser: (parent, args, ctx, info) => {
      if (users.some(user => user.email === args.email)) {
        throw new Error('email taken')
      }
      const newUser = {
        id: uuid(),
        ...args
      }
      users.push(newUser)
      return newUser
    },
    deleteUser: (parent, args, ctx, info) => {
      const userIndex = users.findIndex(user => user.id === args.id)

      if (userIndex === -1) {
        throw new Error('User not found')
      }

      const deletedUsers = users.splice(userIndex, 1)

      posts = posts.filter(post => {
        const match = post.author === args.id
        if (match) {
          comments = comments.filter(comment => comment.post !== post.id)
        }
        return !match
      })
      comments = comments.filter(comment => comment.author !== args.id)

      return deletedUsers[0]
    },
    createPost: (parent, args, ctx, info) => {
      if (!users.some(user => user.id === args.author)) {
        throw new Error('invalid user')
      }
      const newPost = {
        id: uuid(),
        ...args
      }
      posts.push(newPost)
      return newPost
    }
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
