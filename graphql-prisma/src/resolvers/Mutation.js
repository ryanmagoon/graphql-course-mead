import bcrypt from 'bcryptjs'

import generateToken from '../utils/generateToken'
import getUserId from '../utils/getUserId'
import hashPassword from '../utils/hashPassword'

const Mutation = {
  login: async (parent, { email, password }, { prisma }, info) => {
    const user = await prisma.user({ email })

    if (user === null) {
      throw new Error('User does not exist')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new Error('Invalid password')
    }

    return {
      user,
      token: generateToken({ userId: user.id })
    }
  },
  createUser: async (parent, { data }, { prisma }, info) => {
    const password = await hashPassword({ password: data.password })

    const user = await prisma.createUser({
      ...data,
      password
    })

    return {
      user,
      token: generateToken({ userId: user.id })
    }
  },
  updateUser: async (parent, { data }, { prisma, request }, info) => {
    const userId = getUserId(request)

    const newData =
      typeof data.password === 'string'
        ? {
            ...data,
            password: await hashPassword({ password: data.password })
          }
        : data

    return prisma.updateUser({ data: newData, where: { id: userId } })
  },
  deleteUser: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)

    return prisma.deleteUser({ id: userId })
  },
  createPost: (parent, { data }, { prisma, request }, info) => {
    const userId = getUserId(request)

    return prisma.createPost({
      ...data,
      author: {
        connect: {
          id: userId
        }
      }
    })
  },
  updatePost: async (parent, { id, data }, { prisma, request }, info) => {
    const userId = getUserId(request)
    const postExists = await prisma.$exists.post({
      id,
      author: {
        id: userId
      }
    })

    if (!postExists) throw new Error('Unable to update post')

    const post = await prisma.post({ id })
    if (post.published && !data.published) {
      await prisma.deleteManyComments({
        post: { id }
      })
    }

    return prisma.updatePost({ data, where: { id } })
  },
  createComment: async (parent, { data }, { prisma, request }, info) => {
    const userId = await getUserId(request)

    const post = await prisma.post({ id: data.post })
    if (!post.published) throw new Error('Invalid post')

    return prisma.createComment({
      ...data,
      author: {
        connect: {
          id: userId
        }
      },
      post: {
        connect: {
          id: data.post
        }
      }
    })
  },
  updateComment: async (parent, { id, data }, { prisma, request }, info) => {
    const userId = getUserId(request)
    const commentExists = await prisma.$exists.comment({
      id,
      author: {
        id: userId
      }
    })

    if (!commentExists) throw new Error('Unable to update comment')

    return prisma.updateComment({ data, where: { id } })
  },
  deleteComment: async (parent, { id }, { prisma, request }, info) => {
    const userId = getUserId(request)
    const commentExists = await prisma.$exists.comment({
      id,
      author: {
        id: userId
      }
    })

    if (!commentExists) throw new Error('Unable to delete comment')

    return prisma.deleteComment({ id })
  },
  deletePost: async (parent, { id }, { prisma, request }, info) => {
    const userId = getUserId(request)
    const postExists = await prisma.$exists.post({
      id,
      author: {
        id: userId
      }
    })

    if (!postExists) throw new Error('Unable to delete post')

    return prisma.deletePost({ id })
  }
}

export default Mutation
