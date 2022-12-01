import { Injectable, NotFoundException } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

import { Card } from '../entities/card.entity'
import { CreateCardDto } from '../dtos/cards.dtos'
import { encryptCard, decryptCard } from 'src/common/utils'

@Injectable()
export class CardsService {
  constructor(@InjectModel(Card.name) private cardModel: Model<Card>) {}

  create(payload: CreateCardDto) {
    // const newCard = {
    //   holderName: 'Brian Carmona',
    //   dueDate: '10/20',
    //   validationCode: '125',
    //   bin: '544151',
    //   cardNumber: '5375204437718566',
    // }
    const newCard = decryptCard(payload.token)
    console.log(`=>>>> Desencriptar`, newCard)

    const card = encryptCard(newCard)
    console.log(`=>>>> Volver a encriptar`, card)

    return newCard
  }

  async findOne(id: string) {
    const card = await this.cardModel.findById(id).exec()

    if (!card) {
      throw new NotFoundException()
    }

    return card
  }

  async delete(id: string) {
    const deletedCard = await this.cardModel.findByIdAndDelete(id)

    if (!deletedCard) {
      throw new NotFoundException()
    }

    return {
      message: 'Registry deleted successfully',
    }
  }
}
