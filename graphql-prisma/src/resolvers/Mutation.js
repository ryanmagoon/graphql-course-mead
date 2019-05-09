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
  createComment: (
    parent,
    { data },
    { db: { users, posts, comments }, pubsub },
    info
  ) => {
    if (!users.some(user => user.id === data.author)) {
      throw new Error('invalid user')
    }

    if (!posts.some(post => post.id === data.post)) {
      throw new Error('invalid post')
    }
    const comment = {
      id: uuid(),
      ...data
    }
    comments.push(comment)
    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    })

    return comment
  },
  updateComment: (parent, { id, data }, { db, pubsub }, info) => {
    const comment = db.comments.find(comment => comment.id === id)

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (typeof data.text === 'string') {
      comment.text = data.text
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })

    return comment
  },
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
