import '@babel/polyfill'

import server from './server'

const main = async () => {
  await server.start({ port: process.env.PORT || 4000 })
  console.log('The server is up!')
}

main()
