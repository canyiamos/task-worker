import { AbstractDocument, STATUS } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongoSchema } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class TaskDocument extends AbstractDocument {
  @Prop({ type: String, enum: STATUS, required: false, default: STATUS.wait })
  status?: string;

  @Prop({ type: Number, required: false })
  result?: number;

  @Prop({ type: Number, required: false, default: 0 })
  progress?: number;

  @Prop({ type: String, required: true })
  taskType: string;

  @Prop({ type: Map, of: MongoSchema.Types.Mixed })
  payload: Record<string, any>;
}

export const TaskSchema = SchemaFactory.createForClass(TaskDocument);
