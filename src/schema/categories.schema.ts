import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Collection, Types } from 'mongoose';

@Schema(
    {collection: 'categories'}
)
export class CategoryClass{
    _id: Types.ObjectId;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryClass);