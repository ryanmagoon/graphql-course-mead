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
  me: () => ({
    id: '8675309',
    name: 'Ryan',
    email: 'mr.magoon5@gmail.com'
  }),
  post: () => ({
    id: '21',
    title: 'hi there I am a post',
    body: 'get posted on',
    published: false
  }),
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
