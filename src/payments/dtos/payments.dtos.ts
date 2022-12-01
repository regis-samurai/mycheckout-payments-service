import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
  IsOptional,
} from 'class-validator'

class ProxyPCI {
  @IsString()
  @IsOptional()
  @ApiProperty()
  transactionId: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  aliasCC: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  aliasCVV: string
}

class Fields {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  holderName: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  dueDate: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  addressId: string
}

class Transaction {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  merchantName: string
}

export class Payment {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  paymentSystem: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  installments: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  installmentsInterestRate: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  installmentsValue: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  value: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  referenceValue: number

  @IsNotEmpty()
  @ApiProperty()
  fields: Fields

  @IsNotEmpty()
  @ApiProperty()
  transaction: Transaction

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  currencyCode: string
}

class Order {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accountName: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  hostname: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  VtexChkoAuth: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  orderGroup: string
}

class VTEX {
  @ValidateNested({ each: true })
  @Type(() => Payment)
  @ApiProperty()
  payment: Payment

  @ValidateNested({ each: true })
  @Type(() => Order)
  @ApiProperty()
  order: Order
}

export class CreatePaymentDto {
  @ValidateNested({ each: true })
  @Type(() => ProxyPCI)
  @ApiProperty()
  proxy: ProxyPCI

  @ValidateNested({ each: true })
  @Type(() => VTEX)
  @ApiProperty()
  vtex: VTEX
}
