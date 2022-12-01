import { Body, Controller, Post, Headers } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreatePaymentDto } from '../dtos/payments.dtos'
import { PaymentsService } from '../services/payments.service'

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('')
  create(@Body() payload: CreatePaymentDto, @Headers() headers: any) {
    return this.paymentsService.create(payload, headers)
  }
}
