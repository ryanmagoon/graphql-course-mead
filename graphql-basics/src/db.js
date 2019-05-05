const users = [
  {
    id: '1',
    name: 'Ryan',
    email: 'ryan@memelordpavilion.com',
    age: 26
  },
  {
    id: '2',
    name: 'Chuck',
    email: 'chuck@memelordpavilion.com',
    age: 74
  },
  {
    id: '3',
    name: 'Satan',
    email: 'lucifer@memelordpavilion.com',
    age: 2700
  }
]

const posts = [
  {
    id: '1',
    title: 'my first post',
    body: 'I like turtles',
    published: true,
    author: '2'
  },
  {
    id: '2',
    title: 'my second post',
    body: 'I like buffalo',
    published: false,
    author: '1'
  },
  {
    id: '3',
    title: 'my third post',
    body: 'I like turkeys',
    published: true,
    author: '3'
  }
]

const comments = [
  {
    id: '1',
    text: 'hello!',
    author: '1',
    post: '3'
  },
  {
    id: '2',
    text: 'celery man!',
    author: '1',
    post: '3'
  },
  {
    id: '3',
    text: 'potatoes!',
    author: '3',
    post: '1'
  },
  {
    id: '4',
    text: 'caribou!',
    author: '2',
    post: '2'
  }
]

const db = {
  users,
  posts,
  comments
}

export default db
