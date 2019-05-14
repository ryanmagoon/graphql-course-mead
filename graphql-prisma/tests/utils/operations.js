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
export const getPosts = gql`
  query {
    posts {
      id
      published
    }
  }
`

export const getMyPosts = gql`
  query {
    myPosts {
      id
      title
      body
      published
    }
  }
`

export const updatePost = gql`
  mutation($id: ID!, $data: UpdatePostInput!) {
    updatePost(id: $id, data: $data) {
      id
      title
      body
      published
    }
  }
`

export const createPost = gql`
  mutation($data: CreatePostInput!) {
    createPost(data: $data) {
      id
      title
      body
      published
    }
  }
`
export const deletePost = gql`
  mutation($id: ID!) {
    deletePost(id: $id) {
      id
      title
      body
    }
  }
`
