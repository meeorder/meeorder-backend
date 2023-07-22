import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Collection, Types } from 'mongoose';

@Schema(
    {collection: 'categories'}
)
export class CategoryClass{
    _id: Types.ObjectId;

    @Prop()
    title: string;

    @Prop()
    description: string;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryClass);