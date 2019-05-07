const Query = {
  users: async (parent, { query }, { db: { users }, prisma }, info) => {
    const prismaUsers = await prisma.users()
    console.log('hello from resolver')
    console.log(prismaUsers)
    return query
      ? users.filter(({ name }) =>
          name.toLowerCase().includes(query.toLowerCase())
        )
      : users
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
  posts: (parent, args, { db: { posts } }, info) => posts
}

export default Query
