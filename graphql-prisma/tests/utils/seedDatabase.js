import bcrypt from 'bcryptjs'

import { prisma } from '../../src/generated/prisma'

const seedDatabase = async () => {
  await prisma.deleteManyPosts()
  await prisma.deleteManyUsers()
  const myUser = await prisma.createUser({
    name: 'Jen',
    email: 'jen@example.com',
    password: bcrypt.hashSync('buttnugget')
  })
  await prisma.createPost({
    title: 'my first post!',
    body: 'look at my first post',
    author: {
      connect: {
        id: myUser.id
      }
    },
    published: false
  })
  await prisma.createPost({
    title: 'my second post!',
    body: 'look at my second post',
    author: {
      connect: {
        id: myUser.id
      }
    },
    published: true
  })
}

export default seedDatabase
