const User = {
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
