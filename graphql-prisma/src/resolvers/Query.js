import getUserId from '../utils/getUserId'

const Query = {
  users: (parent, { query, first, skip }, { prisma }, info) => {
    return query
      ? prisma.users({
          first,
          skip,
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
      : prisma.users({ first, skip })
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
  posts: (parent, { query }, { prisma }, info) => {
    return query
      ? prisma.posts({
          where: {
            published: true,
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
      : prisma.posts({ where: { published: true } })
  },
  myPosts: async (parent, { query }, { prisma, request }, info) => {
    const userId = await getUserId(request)

    return query
      ? prisma.posts({
          where: {
            author: {
              id: userId
            },
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
      : prisma.posts({
          where: {
            author: {
              id: userId
            }
          }
        })
  }
}

export default Query
