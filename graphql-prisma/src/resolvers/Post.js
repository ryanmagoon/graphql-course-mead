const Post = {
  author: ({ author }, args, { db: { users } }, info) =>
    users.find(({ id }) => id === author),
  comments: (parent, args, { prisma }, info) => {
    return prisma
      .post({
        id: parent.id
      })
      .comments()
  }
}

export default Post
