import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CardsController } from './controllers/cards.controller'
import { CardsService } from './services/cards.service'
import { Card, CardSchema } from './entities/card.entity'
import { PaymentsController } from './controllers/payments.controller'
import { PaymentsService } from './services/payments.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   {
    //     name: Card.name,
    //     schema: CardSchema,
    //   },
    // ]),
    HttpModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
