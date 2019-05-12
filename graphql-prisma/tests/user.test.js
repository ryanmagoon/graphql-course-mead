import 'cross-fetch/polyfill'
import ApolloClient, { gql } from 'apollo-boost'
import bcrypt from 'bcryptjs'

import { prisma } from '../src/generated/prisma'

const client = new ApolloClient({
  uri: 'http://localhost:4000'
})

beforeEach(async () => {
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
})

test('should create a new user', async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Ryan"
          email: "ryan@example.com"
          password: "mypassword123"
        }
      ) {
        token
        user {
          id
        }
      }
    }
  `
  const response = await client.mutate({ mutation: createUser })
  expect(
    await prisma.$exists.user({ id: response.data.createUser.user.id })
  ).toBe(true)
})
