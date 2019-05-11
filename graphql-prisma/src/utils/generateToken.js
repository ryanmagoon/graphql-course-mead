import jwt from 'jsonwebtoken'

const generateToken = ({ userId }) =>
  jwt.sign({ userId }, 'thisismysecret', {
    expiresIn: '7 days'
  })

export default generateToken
