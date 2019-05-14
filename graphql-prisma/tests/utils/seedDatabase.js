import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../src/generated/prisma'

const userOne = {
  input: {
    name: 'Jen',
    email: 'jen@example.com',
    password: bcrypt.hashSync('buttnugget')
  },
  user: undefined,
  jwt: undefined
}

const userTwo = {
  input: {
    name: 'Brad',
    email: 'brad@example.com',
    password: bcrypt.hashSync('buttnugget')
  },
  user: undefined,
  jwt: undefined
}

const postOne = {
  input: {
    title: 'my first post!',
    body: 'look at my first post',
    published: false
  },
  post: undefined
}

const postTwo = {
  input: {
    title: 'my second post!',
    body: 'look at my second post',
    published: true
  },
  post: undefined
}

const commentOne = {
  input: {
    text: 'I love this post'
  }
}

const commentTwo = {
  input: {
    text: 'Thanks brochacho'
  }
}

const seedDatabase = async () => {
  // delete test data
  await prisma.deleteManyPosts()
  await prisma.deleteManyUsers()

  // create user one
  userOne.user = await prisma.createUser(userOne.input)
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

  // create user two
  userTwo.user = await prisma.createUser(userTwo.input)
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)

  // create post one
  postOne.post = await prisma.createPost({
    ...postOne.input,
    author: {
      connect: {
        id: userOne.user.id
      }
    }
  })

  //create post two
  postTwo.post = await prisma.createPost({
    ...postTwo.input,
    author: {
      connect: {
        id: userOne.user.id
      }
    }
  })

  // create comment one
  commentOne.comment = await prisma.createComment({
    ...commentOne.input,
    author: { connect: { id: userTwo.user.id } },
    post: { connect: { id: postOne.post.id } }
  })

  // create comment two
  commentTwo.comment = await prisma.createComment({
    ...commentTwo.input,
    author: { connect: { id: userOne.user.id } },
    post: { connect: { id: postOne.post.id } }
  })
}

export { userOne, postOne, postTwo, userTwo, commentOne, commentTwo }
export default seedDatabase
