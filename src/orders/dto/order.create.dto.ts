import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderDto {
  @IsString()
  status: string;
  food: Types.ObjectId;
}
