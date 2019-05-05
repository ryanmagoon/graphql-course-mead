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
    },
    createComment: (parent, args, ctx, info) => {
      if (!users.some(user => user.id === args.author)) {
        throw new Error('invalid user')
      }

      if (!posts.some(post => post.id === args.post)) {
        throw new Error('invalid post')
      }
      const newComment = {
        id: uuid(),
        ...args
      }
      comments.push(newComment)
      return newComment
    },
    deleteComment: (parent, args, ctx, info) => {
      const commentIndex = comments.findIndex(comment => comment.id === args.id)

      if (commentIndex === -1) {
        throw new Error('comment not found')
      }

      const deletedComments = comments.splice(commentIndex, 1)

      return deletedComments[0]
    },
    deletePost: (parent, args, ctx, info) => {
      const postIndex = posts.findIndex(post => post.id === args.id)

      if (postIndex === -1) {
        throw new Error('Post not found')
      }

      const deletedPosts = posts.splice(postIndex, 1)

      comments = comments.filter(comment => comment.post !== args.id)

      return deletedPosts[0]
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
  typeDefs: './src/schema.graphql',
  resolvers
})

server.start(() => {
  console.log('The server is up!')
})
