import { Controller, Post, Delete, Param, Body } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CardsService } from '../services/cards.service'
import { CreateCardDto } from '../dtos/cards.dtos'

@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Post('')
  create(@Body() payload: CreateCardDto) {
    return this.cardsService.create(payload)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cardsService.delete(id)
  }
}
