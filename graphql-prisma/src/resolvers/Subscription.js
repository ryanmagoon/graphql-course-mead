import { prisma } from '../generated/prisma'

const Subscription = {
  comment: {
    subscribe: async (parent, { postId }, { prisma }, info) =>
      postId
        ? prisma.$subscribe.comment({
            node: {
              post: { id: postId }
            }
          })
        : prisma.$subscribe.comment(),
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
