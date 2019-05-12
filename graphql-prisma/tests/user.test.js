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

test('should expose public author profiles', async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `
  const response = await client.query({ query: getUsers })
  expect(response.data.users.length).toBe(1)
  expect(response.data.users[0].email).toBe(null)
  expect(response.data.users[0].name).toBe('Jen')
})

test('should return only published posts from public posts query', async () => {
  const getPosts = gql`
    query {
      posts {
        id
        published
      }
    }
  `
  const response = await client.query({ query: getPosts })
  expect(response.data.posts.length).toBe(1)
  expect(response.data.posts[0].published).toBe(true)
})

test('should not log in with bad credentials', async () => {
  const login = gql`
    mutation {
      login(email: "jeff@example.com", password: "notgonnawork") {
        token
      }
    }
  `
  await expect(client.mutate({ mutation: login })).rejects.toThrow()
})

test('should not sign up with short password', async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: { name: "Ryan", email: "ryan@example.com", password: "nope" }
      ) {
        token
        user {
          id
        }
      }
    }
  `
  await expect(client.mutate({ mutation: createUser })).rejects.toThrow()
})
