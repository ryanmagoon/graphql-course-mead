import jwt from 'jsonwebtoken'

const getUserId = ({ connection, request }, requireAuth = true) => {
  const header = request
    ? request.headers.authorization
    : connection.context.Authorization

  if (header) {
    const token = header.replace('Bearer ', '')
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    return decodedData.userId
  }

  if (requireAuth) throw new Error('Authentication required')

  return null
}

export default getUserId
