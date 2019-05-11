import getUserId from '../utils/getUserId'

const Query = {
  users: (parent, { query }, { prisma }, info) => {
    return query
      ? prisma.users({
          where: {
            OR: [
              {
                name_contains: query
              },
              {
                email_contains: query
              }
            ]
          }
        })
      : prisma.users()
  },
  me: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)
    return prisma.user({ id: userId })
  },
  post: async (parent, { id }, { prisma, request }, info) => {
    const userId = getUserId(request, false)

    const posts = await prisma.posts({
      where: {
        id,
        OR: [{ published: true }, { author: { id: userId } }]
      }
    })

    if (posts.length === 0) throw new Error('post not found')

    return posts[0]
  },
  comments: (parent, args, { prisma }, info) => prisma.comments(),
  posts: (parent, { query }, { prisma }, info) =>
    query
      ? prisma.posts({
          where: {
            OR: [
              {
                title_contains: query
              },
              {
                body_contains: query
              }
            ]
          }
        })
      : prisma.posts()
}

export default Query
