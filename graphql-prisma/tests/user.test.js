import 'cross-fetch/polyfill'
import ApolloClient, { gql } from 'apollo-boost'

import { prisma } from '../src/generated/prisma'

const client = new ApolloClient({
  uri: 'http://localhost:4000'
})

beforeEach(async () => {
  await prisma.deleteManyUsers()
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
