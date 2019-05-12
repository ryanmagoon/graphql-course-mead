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
      author {
        name
      }
    }
  }
`

client
  .query({
    query: getUsers
  })
  .then(({ data: { users } }) => {
    let html = '<h2>users</h2>'

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
    let html = '<h2>posts</h2>'

    for (const {
      title,
      body,
      author: { name }
    } of posts) {
      html += `
        <div>
          <h3>${title}</h3>
          <h5>author: ${name}</h5>
          <p>${body}</p>
        </div>
      `
    }

    document.getElementById('posts').innerHTML = html
  })
