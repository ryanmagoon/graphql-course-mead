import uuid from 'uuid/v4'

const Mutation = {
  createUser: (parent, args, { db: { users } }, info) => {
    if (users.some(user => user.email === args.email)) {
      throw new Error('email taken')
    }
    const newUser = {
      id: uuid(),
      ...args
    }
    users.push(newUser)
    return newUser
  },
  deleteUser: (parent, args, { db: { users, posts, comments } }, info) => {
    const userIndex = users.findIndex(user => user.id === args.id)

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const deletedUsers = users.splice(userIndex, 1)

    posts = posts.filter(post => {
      const match = post.author === args.id
      if (match) {
        comments = comments.filter(comment => comment.post !== post.id)
      }
      return !match
    })
    comments = comments.filter(comment => comment.author !== args.id)

    return deletedUsers[0]
  },
  createPost: (parent, args, { db: { users, posts } }, info) => {
    if (!users.some(user => user.id === args.author)) {
      throw new Error('invalid user')
    }
    const newPost = {
      id: uuid(),
      ...args
    }
    posts.push(newPost)
    return newPost
  },
  createComment: (parent, args, { db: { users, posts, comments } }, info) => {
    if (!users.some(user => user.id === args.author)) {
      throw new Error('invalid user')
    }

    if (!posts.some(post => post.id === args.post)) {
      throw new Error('invalid post')
    }
    const newComment = {
      id: uuid(),
      ...args
    }
    comments.push(newComment)
    return newComment
  },
  deleteComment: (parent, args, { db: { comments } }, info) => {
    const commentIndex = comments.findIndex(comment => comment.id === args.id)

    if (commentIndex === -1) {
      throw new Error('comment not found')
    }

    const deletedComments = comments.splice(commentIndex, 1)

    return deletedComments[0]
  },
  deletePost: (parent, args, { db: { posts, comments } }, info) => {
    const postIndex = posts.findIndex(post => post.id === args.id)

    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    const deletedPosts = posts.splice(postIndex, 1)

    comments = comments.filter(comment => comment.post !== args.id)

    return deletedPosts[0]
  }
}

export default Mutation
