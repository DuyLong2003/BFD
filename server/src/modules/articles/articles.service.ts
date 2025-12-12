import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { isValidObjectId, Model } from 'mongoose';
import slugify from 'slugify';
import { EventsGateway } from 'src/events/events.gateway';
import { User } from '../users/schemas/user.schema';
import { FilesService } from '../files/files.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: Model<ArticleDocument>,
    private eventsGateway: EventsGateway,
    private filesService: FilesService, // 
  ) { }

  async create(createArticleDto: CreateArticleDto, user: User & { _id: string }) {
    // Nếu user không gửi slug, tự tạo từ title
    if (!createArticleDto.slug) {
      createArticleDto.slug = slugify(createArticleDto.title, { lower: true, locale: 'vi' });
    }

    // Xử lý trùng lặp Slug
    const slugExists = await this.articleModel.findOne({ slug: createArticleDto.slug });
    if (slugExists) {
      createArticleDto.slug = `${createArticleDto.slug}-${Date.now()}`;
    }

    // Move thumbnail từ temp/ → articles/
    if (createArticleDto.thumbnail) {
      try {
        createArticleDto.thumbnail = await this.filesService.moveFromTemp(
          createArticleDto.thumbnail
        );
      } catch (error) {
        console.error('Error moving thumbnail:', error);
      }
    }

    // Extract và move tất cả ảnh trong content
    if (createArticleDto.content) {
      try {
        const imageUrls = this.filesService.extractImageUrls(createArticleDto.content);

        for (const url of imageUrls) {
          const newUrl = await this.filesService.moveFromTemp(url);
          createArticleDto.content = createArticleDto.content.replace(url, newUrl);
        }
      } catch (error) {
        console.error('Error moving content images:', error);
      }
    }

    const createdArticle = new this.articleModel({
      ...createArticleDto,
      author: user._id
    });

    const newArticle = await createdArticle.save();

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

    if (query.category) filter.category = query.category;
    if (query.status) filter.status = query.status;
    if (query.q) {
      filter.title = { $regex: query.q, $options: 'i' };
    }
    if (query.startDate && query.endDate) {
      filter.createdAt = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate),
      };
    }

    let sortConfig: any = { createdAt: -1 };

    if (query.sort) {
      const isDesc = query.sort.startsWith('-');
      const field = query.sort.replace('-', '');

      if (field === 'category') {
        sortConfig = { 'category': isDesc ? -1 : 1 };
      } else {
        sortConfig = { [field]: isDesc ? -1 : 1 };
      }
    }

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
      .populate('category', 'name slug')
      .exec();

    if (!article) throw new NotFoundException('Bài viết không tồn tại');
    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const existingArticle = await this.articleModel.findById(id);
    if (!existingArticle) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Auto-generate slug nếu có title mới
    if (updateArticleDto.title && !updateArticleDto.slug) {
      updateArticleDto.slug = slugify(updateArticleDto.title, { lower: true, locale: 'vi' });
    }

    // Xử lý thumbnail
    if (updateArticleDto.thumbnail && updateArticleDto.thumbnail !== existingArticle.thumbnail) {
      try {
        // Move thumbnail mới từ temp/ → articles/
        updateArticleDto.thumbnail = await this.filesService.moveFromTemp(
          updateArticleDto.thumbnail
        );

        // Xóa thumbnail cũ
        if (existingArticle.thumbnail) {
          await this.filesService.deleteFileByUrl(existingArticle.thumbnail);
        }
      } catch (error) {
        console.error('Error updating thumbnail:', error);
      }
    }

    // Xử lý ảnh trong content
    if (updateArticleDto.content) {
      try {
        // Lấy ảnh mới trong content
        const newImageUrls = this.filesService.extractImageUrls(updateArticleDto.content);

        // Move ảnh mới từ temp/ → articles/
        for (const url of newImageUrls) {
          const newUrl = await this.filesService.moveFromTemp(url);
          updateArticleDto.content = updateArticleDto.content.replace(url, newUrl);
        }

        // Lấy ảnh cũ trong content
        const oldImageUrls = this.filesService.extractImageUrls(existingArticle.content || '');

        // Xóa ảnh cũ không còn dùng nữa
        const urlsToDelete = oldImageUrls.filter(
          oldUrl => !newImageUrls.some(newUrl =>
            newUrl === oldUrl || newUrl.replace('articles/', 'temp/') === oldUrl
          )
        );

        for (const url of urlsToDelete) {
          await this.filesService.deleteFileByUrl(url);
        }
      } catch (error) {
        console.error('Error updating content images:', error);
      }
    }

    const updated = await this.articleModel
      .findByIdAndUpdate(id, updateArticleDto, { new: true })
      .exec();

    return updated;
  }

  async remove(id: string) {
    const article = await this.articleModel.findById(id);
    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Xóa thumbnail
    if (article.thumbnail) {
      try {
        await this.filesService.deleteFileByUrl(article.thumbnail);
      } catch (error) {
        console.error('Error deleting thumbnail:', error);
      }
    }

    // Xóa tất cả ảnh trong content
    if (article.content) {
      try {
        const imageUrls = this.filesService.extractImageUrls(article.content);
        for (const url of imageUrls) {
          await this.filesService.deleteFileByUrl(url);
        }
      } catch (error) {
        console.error('Error deleting content images:', error);
      }
    }

    const deleted = await this.articleModel.findByIdAndDelete(id).exec();

    this.eventsGateway.emitDeletedArticle(id);

    return deleted;
  }
}
