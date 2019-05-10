import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import getUserId from '../utils/getUserId'

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
      token: jwt.sign({ userId: user.id }, 'thisismysecret')
    }
  },
  createUser: async (parent, { data }, { prisma }, info) => {
    if (data.password.length < 8) {
      throw new Error('password must be 8 characters or longer')
    }

    const password = await bcrypt.hash(data.password, 10)

    const user = await prisma.createUser({
      ...data,
      password
    })

    return {
      user,
      token: jwt.sign({ userId: user.id }, 'thisismysecret')
    }
  },
  updateUser: (parent, { data }, { prisma, request }, info) => {
    const userId = getUserId(request)

    return prisma.updateUser({ data, where: { id: userId } })
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

    return prisma.updatePost({ data, where: { id } })
  },
  createComment: async (parent, { data }, { prisma, request }, info) => {
    const userId = await getUserId(request)

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
  updateComment: (parent, { id, data }, { prisma }, info) =>
    prisma.updateComment({ data, where: { id } }),
  deleteComment: (parent, { id }, { prisma }, info) =>
    prisma.deleteComment({ id }),
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
