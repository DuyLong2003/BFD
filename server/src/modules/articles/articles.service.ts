import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { isValidObjectId, Model } from 'mongoose';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) { }

  async create(createArticleDto: CreateArticleDto) {
    // Nếu user không gửi slug, tự tạo từ title
    if (!createArticleDto.slug) {
      createArticleDto.slug = slugify(createArticleDto.title, { lower: true, locale: 'vi' });
    }

    // Xử lý trùng lặp Slug -> thêm timestamp -> VD: tin-tuc -> tin-tuc-170123456
    const slugExists = await this.articleModel.findOne({ slug: createArticleDto.slug });
    if (slugExists) {
      createArticleDto.slug = `${createArticleDto.slug}-${Date.now()}`;
    }

    const createdArticle = new this.articleModel(createArticleDto);
    return createdArticle.save();
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, category, q } = query;
    const skip = (page - 1) * limit;

    // Filter
    const filter: any = {};
    if (category) filter.category = category; // Lọc theo ID Category

    // Tìm kiếm
    if (q) {
      filter.$text = { $search: q }; // Dùng index đã tạo ở Schema
    }

    return this.articleModel
      .find(filter)
      .select('-content') // bỏ trường content
      .populate('category', 'name slug') // join bảng Category lấy name, slug
      .sort({ createdAt: -1 }) // mới nhất lên đầu
      .skip(skip)
      .limit(Number(limit))
      .exec();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID bài viết không hợp lệ');
    }

    const article = await this.articleModel
      .findById(id)
      .populate('category', 'name slug') // join bảng Category
      .exec();

    if (!article) throw new NotFoundException('Bài viết không tồn tại');
    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    if (updateArticleDto.title && !updateArticleDto.slug) {
      updateArticleDto.slug = slugify(updateArticleDto.title, { lower: true, locale: 'vi' });
    }

    const updated = await this.articleModel
      .findByIdAndUpdate(id, updateArticleDto, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('Không tìm thấy bài viết');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.articleModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Không tìm thấy bài viết');
    return deleted;
  }
}
