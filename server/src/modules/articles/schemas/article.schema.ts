import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true })
export class Article {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({ required: true })
    content: string;

    @Prop()
    thumbnail: string;

    // Liên kết sang bảng Category
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    category: Category;

    @Prop({ default: 'Draft' }) // Trạng thái: Draft hoặc Published
    status: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);