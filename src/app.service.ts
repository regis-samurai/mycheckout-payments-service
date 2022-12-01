import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
// import { Db } from 'mongodb'

import config from './common/config'

@Injectable()
export class AppService {
  constructor(
    // @Inject('MONGO') private database: Db,
    @Inject(config.KEY) private configService: ConfigType<typeof config>
  ) {}

  getHello(): string {
    return `Hello World!`
  }
}
