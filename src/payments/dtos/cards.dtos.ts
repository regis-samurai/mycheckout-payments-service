import { IsString, IsNotEmpty } from 'class-validator'
import { PartialType, ApiProperty } from '@nestjs/swagger'

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly token: string
}

export class UpdateCardDto extends PartialType(CreateCardDto) {}
