import getUserId from '../utils/getUserId'

const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve: ({ email, id }, args, { prisma, request }, info) => {
      const userId = getUserId(request, false)

      return id === userId ? email : null
    }
  },
  posts: (parent, args, { prisma }, info) =>
    prisma
      .user({
        id: parent.id
      })
      .posts(),
  comments: (parent, args, { prisma }, info) =>
    prisma
      .user({
        id: parent.id
      })
      .comments()
}

export default User
