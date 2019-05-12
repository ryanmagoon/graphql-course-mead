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

export default server
