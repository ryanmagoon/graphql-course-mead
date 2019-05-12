import Apollo, { gql } from 'apollo-boost'

const client = new Apollo({
  uri: 'http://localhost:4000'
})

const getUsers = gql`
  {
    users {
      id
      name
    }
  }
`

const getPosts = gql`
  {
    posts {
      id
      title
      body
    }
  }
`

client
  .query({
    query: getUsers
  })
  .then(({ data: { users } }) => {
    let html = ''

    for (const user of users) {
      html += `<h3>${user.name}</h3>`
    }

    document.getElementById('users').innerHTML = html
  })

client
  .query({
    query: getPosts
  })
  .then(({ data: { posts } }) => {
    let html = ''

    for (const post of posts) {
      html += `<h3>${post.title}</h3>`
    }

    document.getElementById('posts').innerHTML = html
  })
