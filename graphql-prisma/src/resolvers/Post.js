const Post = {
  author: ({ id }, args, { prisma }, info) => prisma.post({ id }).author(),
  comments: ({ id }, args, { prisma }, info) => prisma.post({ id }).comments()
}

export default Post
