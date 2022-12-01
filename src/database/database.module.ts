import { Module, Global } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { MongoClient } from 'mongodb'
import { MongooseModule } from '@nestjs/mongoose'

import config from '../common/config'

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const { connection, user, password, host, port, name } =
          configService.mongo
        return {
          uri: `${connection}://${host}:${port}`,
          user,
          pass: password,
          dbName: name,
        }
      },
      inject: [config.KEY],
    }),
  ],
  providers: [
    {
      provide: 'MONGO',
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { connection, user, password, host, port, name } =
          configService.mongo
        const uri = `${connection}://${user}:${password}@${host}:${port}/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false`

        const client = new MongoClient(uri)

        await client.connect()

        const database = client.db(name)

        return database
      },
      inject: [config.KEY],
    },
  ],
  exports: ['MONGO', MongooseModule],
})
export class DatabaseModule {}
