import getUserId from '../utils/getUserId'

const Query = {
  users: (parent, { query, first, skip, after, orderBy }, { prisma }, info) => {
    return query
      ? prisma.users({
          first,
          skip,
          after,
          orderBy,
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
      : prisma.users({ first, skip, after, orderBy })
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
  comments: (parent, { first, skip, after }, { prisma }, info) =>
    prisma.comments({ first, skip, after }),
  posts: (parent, { query, first, skip, after }, { prisma }, info) => {
    return query
      ? prisma.posts({
          first,
          skip,
          after,
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
      : prisma.posts({ first, skip, where: { published: true } })
  },
  myPosts: async (
    parent,
    { query, first, skip, after },
    { prisma, request },
    info
  ) => {
    const userId = await getUserId(request)

    return query
      ? prisma.posts({
          first,
          skip,
          after,
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
          first,
          skip,
          after,
          where: {
            author: {
              id: userId
            }
          }
        })
  }
}

export default Query
