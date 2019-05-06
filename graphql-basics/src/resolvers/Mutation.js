import uuid from 'uuid/v4'

const Mutation = {
  createUser: (parent, { data }, { db: { users } }, info) => {
    if (users.some(user => user.email === data.email)) {
      throw new Error('email taken')
    }
    const newUser = {
      id: uuid(),
      ...data
    }
    users.push(newUser)
    return newUser
  },
  updateUser: (parent, { id, data }, { db }, info) => {
    const user = db.users.find(user => user.id === id)

    if (!user) {
      throw new Error('User not found')
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email)
      if (emailTaken) {
        throw new Error('Email taken')
      }
    }

    if (typeof data.name === 'string') {
      user.name = data.name
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age
    }

    return user
  },
  deleteUser: (parent, args, { db: { users, posts, comments } }, info) => {
    const userIndex = users.findIndex(user => user.id === args.id)

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const [deletedUser] = users.splice(userIndex, 1)

    posts = posts.filter(post => {
      const match = post.author === args.id
      if (match) {
        comments = comments.filter(comment => comment.post !== post.id)
      }
      return !match
    })
    comments = comments.filter(comment => comment.author !== args.id)

    return deletedUser
  },
  createPost: (parent, { data }, { db: { users, posts }, pubsub }, info) => {
    if (!users.some(user => user.id === data.author)) {
      throw new Error('invalid user')
    }
    const newPost = {
      id: uuid(),
      ...data
    }
    posts.push(newPost)
    if (data.published === true) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: newPost
        }
      })
    }

    return newPost
  },
  updatePost: (parent, { id, data }, { db, pubsub }, info) => {
    const post = db.posts.find(post => post.id === id)
    const originalPost = { ...post }

    if (!post) {
      throw new Error('Post not found')
    }

    if (typeof data.title === 'string') {
      post.title = data.title
    }

    if (typeof data.body === 'string') {
      post.body = data.body
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published

      if (originalPost.published && !post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      } else if (!originalPost.published && post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
      } else if (post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'UPDATED',
            data: post
          }
        })
      }
    }

    return post
  },
  createComment: (
    parent,
    { data },
    { db: { users, posts, comments }, pubsub },
    info
  ) => {
    if (!users.some(user => user.id === data.author)) {
      throw new Error('invalid user')
    }

    if (!posts.some(post => post.id === data.post)) {
      throw new Error('invalid post')
    }
    const comment = {
      id: uuid(),
      ...data
    }
    comments.push(comment)
    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: 'CREATE',
        data: comment
      }
    })

    return comment
  },
  updateComment: (parent, { id, data }, { db, pubsub }, info) => {
    const comment = db.comments.find(comment => comment.id === id)

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (typeof data.text === 'string') {
      comment.text = data.text
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATE',
        data: comment
      }
    })

    return comment
  },
  deleteComment: (parent, { id }, { db: { comments }, pubsub }, info) => {
    const commentIndex = comments.findIndex(comment => comment.id === id)

    if (commentIndex === -1) {
      throw new Error('comment not found')
    }

    const [deletedComment] = comments.splice(commentIndex, 1)

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETE',
        data: deletedComment
      }
    })

    return deletedComment
  },
  deletePost: (parent, args, { db: { posts, comments }, pubsub }, info) => {
    const postIndex = posts.findIndex(post => post.id === args.id)

    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    const [deletedPost] = posts.splice(postIndex, 1)

    comments = comments.filter(comment => comment.post !== args.id)

    if (deletedPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: deletedPost
        }
      })
    }

    return deletedPost
  }
}

export default Mutation
