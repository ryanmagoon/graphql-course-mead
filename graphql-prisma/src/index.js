import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Comment from './resolvers/Comment'
import { prisma } from './generated/prisma'

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Post,
    User,
    Comment
  },
  context: { db, prisma, pubsub }
})

server.start(async () => {
  const data = await prisma.createPost({
    title: 'my new post',
    body: 'look at my new post',
    published: true,
    author: {
      connect: {
        id: 'cjvcqr5ck003k0865lql3m1ap'
      }
    }
  })
  console.log(data)
  console.log('The server is up!')
})
