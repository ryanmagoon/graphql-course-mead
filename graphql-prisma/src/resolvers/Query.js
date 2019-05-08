const Query = {
  users: (parent, { query }, { db: { users }, prisma }, info) => {
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
    // return query
    //   ? users.filter(({ name }) =>
    //       name.toLowerCase().includes(query.toLowerCase())
    //     )
    //   : users
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
  comments: (parent, args, { db: { comments } }, info) => comments,
  posts: (parent, args, { db: { posts }, prisma }, info) => prisma.posts()
}

export default Query
