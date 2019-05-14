module.exports = () => {
  global.httpServer.close(() => console.log('test server shut down'))
}
