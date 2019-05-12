import '@babel/polyfill'
import { GraphQLServer, PubSub } from 'graphql-yoga'

import resolvers from './resolvers'
import { prisma } from './generated/prisma'

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => ({
    prisma,
    pubsub,
    request
  })
})

server.start({ port: process.env.PORT || 4000 }, () => {
  console.log('The server is up!')
})
