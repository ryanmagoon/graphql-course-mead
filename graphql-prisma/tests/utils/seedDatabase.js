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

const seedDatabase = async () => {
  // delete test data
  await prisma.deleteManyPosts()
  await prisma.deleteManyUsers()

  // create user one
  userOne.user = await prisma.createUser(userOne.input)
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

  await prisma.createPost({
    title: 'my first post!',
    body: 'look at my first post',
    author: {
      connect: {
        id: userOne.user.id
      }
    },
    published: false
  })
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

export { userOne }
export default seedDatabase
