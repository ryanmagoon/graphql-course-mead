import 'cross-fetch/polyfill'

import { prisma } from '../src/generated/prisma'
import seedDatabase, {
  userOne,
  commentOne,
  commentTwo,
  postOne
} from './utils/seedDatabase'
import { deleteComment, subscribeToComments } from './utils/operations'
import getClient from './utils/getClient'

beforeEach(seedDatabase)

test('should delete own comment', async () => {
  const client = getClient({ jwt: userOne.jwt })
  const variables = { id: commentTwo.comment.id }

  await client.mutate({ mutation: deleteComment, variables })
  const exists = await prisma.$exists.comment({ id: commentTwo.comment.id })
  expect(exists).toBe(false)
})

test('should not delete other users comment', async () => {
  const client = getClient({ jwt: userOne.jwt })
  const variables = { id: commentOne.comment.id }

  await expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow()
})

test('should subscribe to comments for a post', async done => {
  const client = getClient({ jwt: userOne.jwt })
  const variables = { postId: postOne.post.id }

  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    next: ({ data }) => {
      expect(data.comment.mutation).toBe('DELETED')
      done()
    }
  })

  // change comment
  await prisma.deleteComment({ id: commentOne.comment.id })
})
