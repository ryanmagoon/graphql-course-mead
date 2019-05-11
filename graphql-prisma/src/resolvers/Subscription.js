import getUserId from '../utils/getUserId'

const Subscription = {
  comment: {
    subscribe: async (parent, { postId }, { prisma }, info) =>
      prisma.$subscribe.comment({
        node: {
          post: { id: postId }
        }
      }),
    resolve: payload => payload
  },
  post: {
    subscribe: (parent, args, { prisma }, info) =>
      prisma.$subscribe.post({
        node: {
          published: true
        }
      }),
    resolve: payload => payload
  },
  myPost: {
    subscribe: (parent, args, { prisma, request }, info) => {
      const userId = getUserId(request)

      return prisma.$subscribe.post({
        node: {
          author: { id: userId }
        }
      })
    },
    resolve: payload => payload
  }
}

export default Subscription
