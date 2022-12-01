import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PaymentsModule } from './payments/payments.module'
// import { DatabaseModule } from './database/database.module'
import { environments } from './common/environments'
import config from './common/config'
import { APP_GUARD } from '@nestjs/core'

export const isContainer = process.env.CONTAINER == 'docker'
console.log(isContainer)

@Module({
  imports: [
    PaymentsModule,
    // DatabaseModule,
    ConfigModule.forRoot({
      ...(isContainer
        ? {
            envFilePath: ['/config/.env'],
          }
        : {
            envFilePath: '.env.local',
          }),
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        PROXY_SERVICE_TOKEN: Joi.string().required(),
        PROXY_SERVICE_PULL: Joi.string().required(),
        PROXY_SERVICE_AUTHORIZATION: Joi.string().required(),
        PROXY_SERVICE_MERCHANT: Joi.number().required(),
        PROXY_SERVICE_API_KEY: Joi.string().required(),
      }),
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5000,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
