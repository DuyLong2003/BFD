import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';
import { User } from '../../users/schemas/user.schema';

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

    // Liên kết sang bảng Category, Một bài viết thuộc một Category
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    category: Category;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: User;

    @Prop({ default: 'Draft', enum: ['Draft', 'Published'] }) // Trạng thái: Draft hoặc Published
    status: string;
}

const ArticleSchema = SchemaFactory.createForClass(Article);

// TẠO INDEX TÌM KIẾM 
// Cho phép tìm kiếm theo Title (trọng số cao) và Content (trọng số thấp hơn)
ArticleSchema.index({ title: 'text', content: 'text' });

export { ArticleSchema };