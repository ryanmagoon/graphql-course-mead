import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'

import { prisma } from '../src/generated/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, getUsers, login, getProfile } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('should create a new user', async () => {
  const variables = {
    data: {
      name: 'Ryan',
      email: 'ryan@example.com',
      password: 'mypassword123'
    }
  }

  const response = await client.mutate({ mutation: createUser, variables })
  expect(
    await prisma.$exists.user({ id: response.data.createUser.user.id })
  ).toBe(true)
})

test('should expose public author profiles', async () => {
  const response = await client.query({ query: getUsers })
  expect(response.data.users.length).toBe(1)
  expect(response.data.users[0].email).toBe(null)
  expect(response.data.users[0].name).toBe('Jen')
})

test('should not log in with bad credentials', async () => {
  const variables = { email: 'jeff@example.com', password: 'notgonnawork' }
  await expect(client.mutate({ mutation: login, variables })).rejects.toThrow()
})

test('should not sign up with short password', async () => {
  const variables = {
    data: { name: 'Ryan', email: 'ryan@example.com', password: 'nope' }
  }
  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow()
})

test('should fetch user profile', async () => {
  const authenticatedClient = getClient({ jwt: userOne.jwt })
  const { data } = await authenticatedClient.query({ query: getProfile })

  expect(data.me.id).toBe(userOne.user.id)
})
