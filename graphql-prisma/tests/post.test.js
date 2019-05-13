import 'cross-fetch/polyfill'
import ApolloClient, { gql } from 'apollo-boost'

import { prisma } from '../src/generated/prisma'
import seedDatabase from './utils/seedDatabase'

const client = new ApolloClient({
  uri: 'http://localhost:4000'
})

beforeEach(seedDatabase)

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
