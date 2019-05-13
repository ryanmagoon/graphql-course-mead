import { gql } from 'apollo-boost'

export const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser(data: $data) {
      token
      user {
        id
      }
    }
  }
`

export const getUsers = gql`
  query {
    users {
      id
      name
      email
    }
  }
`

export const login = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

export const getProfile = gql`
  query {
    me {
      id
      name
      email
    }
  }
`
