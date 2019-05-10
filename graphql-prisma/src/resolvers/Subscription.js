import { prisma } from '../generated/prisma'

const Subscription = {
  comment: {
    subscribe: async (parent, { postId }, { prisma }, info) =>
      prisma.$subscribe.comment({
        node: {
          post: { id: postId }
        }
      }),
    resolve: payload => {
      console.log({ payload })
      return payload
    }
  },
  post: {
    subscribe: (parent, args, { pubsub }, info) =>
      prisma.$subscribe.post({
        node: {
          published: true
        }
      }),
    resolve: payload => {
      console.log({ payload })
      return payload
    }
  }
}

export default Subscription
