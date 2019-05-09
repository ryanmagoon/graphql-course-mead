import { prisma } from '../generated/prisma'

const Subscription = {
  comment: {
    subscribe: async (parent, { postId }, { db, prisma }, info) =>
      prisma.$subscribe.comment({
        mutation_in: ['CREATED', 'UPDATED']
      }),
    resolve: payload => {
      console.log({ payload })
      return payload
    }
  },
  post: {
    subscribe: (parent, args, { pubsub }, info) => {
      return pubsub.asyncIterator('post')
    }
  }
}

export default Subscription
