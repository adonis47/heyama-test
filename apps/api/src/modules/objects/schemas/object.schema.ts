import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ObjectItemDocument = ObjectItem & Document;

@Schema({ timestamps: true, collection: 'objects' })
export class ObjectItem {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, trim: true })
  description!: string;

  @Prop({ required: true })
  imageUrl!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId!: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const ObjectItemSchema = SchemaFactory.createForClass(ObjectItem);

ObjectItemSchema.index({ ownerId: 1 });
ObjectItemSchema.index({ createdAt: -1 });
