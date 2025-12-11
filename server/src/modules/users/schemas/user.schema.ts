import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true }) // Tự động tạo createdAt, updatedAt
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 'admin' })
    role: string;

    @Prop({ default: true }) // Thêm trạng thái hoạt động (để khóa nick thay vì xóa)
    isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);