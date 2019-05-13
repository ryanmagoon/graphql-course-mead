import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'

import { prisma } from '../src/generated/prisma'
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import {
  getPosts,
  getMyPosts,
  updatePost,
  createPost,
  deletePost
} from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('should return only published posts from public posts query', async () => {
  const response = await client.query({ query: getPosts })
  expect(response.data.posts.length).toBe(1)
  expect(response.data.posts[0].published).toBe(true)
})

test('should return all users posts for authenticated user', async () => {
  const authenticatedClient = getClient({ jwt: userOne.jwt })
  const { data } = await authenticatedClient.query({ query: getMyPosts })

  expect(data.myPosts.length).toBe(2)
})

test('Should be able to update own post', async () => {
  const authenticatedClient = getClient({ jwt: userOne.jwt })
  const variables = {
    id: '${postOne.post.id}',
    data: {
      published: false
    }
  }

  const { data } = await authenticatedClient.mutate({
    mutation: updatePost,
    variables
  })
  const exists = await prisma.$exists.post({
    id: postOne.post.id,
    published: false
  })

  expect(data.updatePost.published).toBe(false)
  expect(exists).toBe(true)
})

test('Should be able to create a post', async () => {
  const authenticatedClient = getClient({ jwt: userOne.jwt })
  const variables = {
    data: {
      title: 'this is the third post',
      body: 'I tell you what',
      published: true
    }
  }

  const { data } = await authenticatedClient.mutate({
    mutation: createPost,
    variables
  })
  const exists = await prisma.$exists.post({
    id: data.createPost.id,
    title: 'this is the third post',
    body: 'I tell you what',
    published: true
  })

  expect(exists).toBe(true)
})

test('should be able to delete own post', async () => {
  const authenticatedClient = getClient({ jwt: userOne.jwt })
  const variables = {
    id: '${postTwo.post.id}'
  }

  const { data } = await authenticatedClient.mutate({
    mutation: deletePost,
    variables
  })

  const exists = await prisma.$exists.post({ id: postTwo.post.id })
  expect(exists).toBe(false)
})
