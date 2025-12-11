import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { isValidObjectId, Model } from 'mongoose';
import slugify from 'slugify';
import { EventsGateway } from 'src/events/events.gateway';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: Model<ArticleDocument>,
    private eventsGateway: EventsGateway,
  ) { }

  async create(createArticleDto: CreateArticleDto, user: User & { _id: string }) {
    // Nếu user không gửi slug, tự tạo từ title
    if (!createArticleDto.slug) {
      createArticleDto.slug = slugify(createArticleDto.title, { lower: true, locale: 'vi' });
    }

    // Xử lý trùng lặp Slug -> thêm timestamp -> VD: tin-tuc -> tin-tuc-170123456
    const slugExists = await this.articleModel.findOne({ slug: createArticleDto.slug });
    if (slugExists) {
      createArticleDto.slug = `${createArticleDto.slug}-${Date.now()}`;
    }

    const createdArticle = new this.articleModel({
      ...createArticleDto,
      // Nếu schema có trường author/user thì gán vào đây
      author: user._id
    });

    const newArticle = await createdArticle.save();

    // Bắn socket
    this.eventsGateway.emitNewArticle(newArticle);

    return newArticle;
  }

  async findAll(query: {
    page?: string | number;
    limit?: string | number;
    category?: string;
    q?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    sort?: string;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    //LỌC
    // Lọc theo chuyên mục
    if (query.category) filter.category = query.category;
    // Lọc trạng thái
    if (query.status) filter.status = query.status;
    // Tìm kiếm tiêu đề (Regex)
    if (query.q) {
      filter.title = { $regex: query.q, $options: 'i' };
    }
    // Lọc theo ngày
    if (query.startDate && query.endDate) {
      filter.createdAt = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate),
      };
    }

    //SORT
    // Mặc định sort ngày tạo giảm dần
    let sortConfig: any = { createdAt: -1 };

    if (query.sort) {
      // query.sort gửi lên dạng: "title" (tăng dần) hoặc "-title" (giảm dần)
      const isDesc = query.sort.startsWith('-');
      const field = query.sort.replace('-', '');

      if (field === 'category') {
        sortConfig = { 'category': isDesc ? -1 : 1 };
      } else {
        sortConfig = { [field]: isDesc ? -1 : 1 };
      }
    }

    // Đếm tổng số bản ghi
    const total = await this.articleModel.countDocuments(filter);

    const data = await this.articleModel
      .find(filter)
      .select('-content')
      .populate('category', 'name slug')
      .sort(sortConfig)
      .skip(skip)
      .limit(limit)
      .exec();

    return { data, total };
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

    this.eventsGateway.emitDeletedArticle(id);

    return deleted;
  }
}
