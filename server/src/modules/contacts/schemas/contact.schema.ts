import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({ timestamps: true })
export class Contact {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    message: string;

    @Prop({ default: 'Pending', enum: ['Pending', 'Processed', 'Failed'] })
    status: string; // Trạng thái xử lý job
}

export const ContactSchema = SchemaFactory.createForClass(Contact);