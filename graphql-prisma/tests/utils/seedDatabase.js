import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../src/generated/prisma'

const userOne = {
  input: {
    name: 'Jen',
    email: 'jen@example.com',
    password: bcrypt.hashSync('buttnugget')
  },
  user: undefined
}

const postOne = {
  input: {
    title: 'my first post!',
    body: 'look at my first post',
    published: false
  },
  post: undefined
}

const seedDatabase = async () => {
  // delete test data
  await prisma.deleteManyPosts()
  await prisma.deleteManyUsers()

  // create user one
  userOne.user = await prisma.createUser(userOne.input)
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

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
  await prisma.createPost({
    title: 'my second post!',
    body: 'look at my second post',
    author: {
      connect: {
        id: userOne.user.id
      }
    },
    published: true
  })
}

export { userOne, postOne }
export default seedDatabase
