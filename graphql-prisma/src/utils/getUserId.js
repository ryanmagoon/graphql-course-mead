import jwt from 'jsonwebtoken'

const getUserId = (
  {
    request: {
      headers: { authorization }
    }
  },
  requireAuth = true
) => {
  if (authorization) {
    const token = authorization.replace('Bearer ', '')
    const decodedData = jwt.verify(token, 'thisismysecret')

    return decodedData.userId
  }

  if (requireAuth) throw new Error('Authentication required')

  return null
}

export default getUserId
