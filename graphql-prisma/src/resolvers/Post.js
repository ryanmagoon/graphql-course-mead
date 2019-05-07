const Post = {
  author: ({ author }, args, { db: { users } }, info) =>
    users.find(({ id }) => id === author),
  comments: (parent, args, { db: { comments } }, info) =>
    comments.filter(comment => comment.post === parent.id)
}

export default Post
