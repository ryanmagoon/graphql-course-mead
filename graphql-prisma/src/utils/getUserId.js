import jwt from 'jsonwebtoken'

const getUserId = ({
  request: {
    headers: { authorization }
  }
}) => {
  if (!authorization) {
    throw new Error('Authentication required')
  }

  const token = authorization.replace('Bearer ', '')
  const decodedData = jwt.verify(token, 'thisismysecret')

  return decodedData.userId
}

export default getUserId
