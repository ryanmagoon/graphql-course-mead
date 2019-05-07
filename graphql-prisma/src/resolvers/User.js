const User = {
  posts: (parent, args, { db: { posts } }, info) =>
    posts.filter(post => post.author === parent.id),
  comments: (parent, args, { db: { comments } }, info) =>
    comments.filter(comment => comment.author === parent.id)
}

export default User
