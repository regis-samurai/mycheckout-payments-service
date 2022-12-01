import { registerAs } from '@nestjs/config'

export default registerAs('config', () => {
  return {
    mongo: {
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      password: process.env.MONGO_INITDB_ROOT_PASSWORD,
      name: process.env.MONGO_DB,
      port: parseInt(process.env.MONGO_PORT, 10),
      host: process.env.MONGO_HOST,
      connection: process.env.MONGO_CONNECTION,
    },
    proxy: {
      token: process.env.PROXY_SERVICE_TOKEN,
      pull: process.env.PROXY_SERVICE_PULL,
      authorization: process.env.PROXY_SERVICE_AUTHORIZATION,
      merchant: process.env.PROXY_SERVICE_MERCHANT,
      key: process.env.PROXY_SERVICE_API_KEY,
    },
  }
})
