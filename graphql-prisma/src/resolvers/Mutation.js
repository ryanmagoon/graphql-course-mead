import uuid from 'uuid/v4'

const Mutation = {
  createUser: async (parent, { data }, { prisma }, info) => {
    return prisma.createUser(data)
  },
  updateUser: (parent, { id, data }, { prisma }, info) => {
    return prisma.updateUser({ data, where: { id } })
  },
  deleteUser: async (parent, args, { prisma }, info) => {
    return prisma.deleteUser({ id: args.id })
  },
  createPost: (parent, { data }, { prisma }, info) => {
    return prisma.createPost({
      ...data,
      author: {
        connect: {
          id: data.author
        }
      }
    })
  },
  updatePost: (parent, { id, data }, { prisma }, info) =>
    prisma.updatePost({ data, where: { id } }),
  createComment: (parent, { data }, { prisma }, info) =>
    prisma.createComment({
      ...data,
      author: {
        connect: {
          id: data.author
        }
      },
      post: {
        connect: {
          id: data.post
        }
      }
    }),
  updateComment: (parent, { id, data }, { prisma }, info) =>
    prisma.updateComment({ data, where: { id } }),
  deleteComment: (parent, { id }, { db: { comments }, pubsub }, info) => {
    const commentIndex = comments.findIndex(comment => comment.id === id)

    if (commentIndex === -1) {
      throw new Error('comment not found')
    }

    const [deletedComment] = comments.splice(commentIndex, 1)

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment
      }
    })

    return deletedComment
  },
  deletePost: (parent, { id }, { prisma }, info) => prisma.deletePost({ id })
}

export default Mutation
