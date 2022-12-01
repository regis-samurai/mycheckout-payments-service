import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Card extends Document {
  @Prop({ required: true })
  token: string
}

export const CardSchema = SchemaFactory.createForClass(Card)
