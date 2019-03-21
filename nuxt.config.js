module.exports = {
  serverMiddleware: ['~/server/api'],
  env: {
    base_url: `https://${process.env.BASE_URL}`
  },
  plugins: ['~/plugins/global']
}
