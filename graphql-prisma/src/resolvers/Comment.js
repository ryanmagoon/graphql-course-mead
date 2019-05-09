const Comment = {
  author: (parent, args, { prisma }, info) => {
    return prisma.comment({ id: parent.id }).author()
  },
  post: (parent, args, { prisma }, info) => {
    return prisma.comment({ id: parent.id }).post()
  }
}

export default Comment
