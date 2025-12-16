import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { isValidObjectId, Model } from 'mongoose';
import slugify from 'slugify';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './schemas/article.schema';
import { EventsGateway } from 'src/events/events.gateway';
import { FilesService } from '../files/files.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ArticlesService {
  private listCacheKeys = new Set<string>();
  private readonly LIST_CACHE_TRACKING_KEY = 'articles:list:tracking';

  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
    private readonly eventsGateway: EventsGateway,
    private readonly filesService: FilesService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {
    this.loadTrackedKeys();
  }

  private async loadTrackedKeys() {
    try {
      const keys = await this.cache.get<string[]>(this.LIST_CACHE_TRACKING_KEY);
      if (keys && Array.isArray(keys)) {
        this.listCacheKeys = new Set(keys);
        console.log(`Loaded ${keys.length} tracked cache keys`);
      }
    } catch (error) {
      console.error('Error loading tracked keys:', error);
    }
  }

  private async saveTrackedKeys() {
    try {
      await this.cache.set(
        this.LIST_CACHE_TRACKING_KEY,
        Array.from(this.listCacheKeys),
        0
      );
    } catch (error) {
      console.error('Error saving tracked keys:', error);
    }
  }

  async create(dto: CreateArticleDto, user: User & { _id: string }) {
    if (!dto.slug) {
      dto.slug = slugify(dto.title, { lower: true, locale: 'vi' });
    }

    const slugExists = await this.articleModel.findOne({ slug: dto.slug });
    if (slugExists) {
      dto.slug = `${dto.slug}-${Date.now()}`;
    }

    if (dto.thumbnail) {
      dto.thumbnail = await this.filesService.moveFromTemp(dto.thumbnail);
    }

    if (dto.content) {
      const imageUrls = this.filesService.extractImageUrls(dto.content);
      for (const url of imageUrls) {
        const newUrl = await this.filesService.moveFromTemp(url);
        dto.content = dto.content.replace(url, newUrl);
      }
    }

    const article = await this.articleModel.create({
      ...dto,
      author: user._id,
    });

    this.eventsGateway.emitNewArticle(article);

    // Xóa cache khi tạo bài mới
    await this.invalidateListCache();

    return article;
  }

  async findAll(
    query: {
      page?: string | number;
      limit?: string | number;
      category?: string;
      q?: string;
      startDate?: string;
      endDate?: string;
      status?: string;
      sort?: string;
    },
    skipCache: boolean = false
  ) {
    const cacheKey = `articles:list:${JSON.stringify(query)}`;

    if (!skipCache) {
      const cached = await this.cache.get<{
        data: Article[];
        total: number;
      }>(cacheKey);

      if (cached) {
        console.log(' Cache hit:', cacheKey);
        return cached;
      }
    } else {
      console.log('Cache skipped (Admin request)');
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (query.category) filter.category = query.category;
    if (query.status) filter.status = query.status;
    if (query.q) filter.title = { $regex: query.q, $options: 'i' };
    if (query.startDate && query.endDate) {
      filter.createdAt = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate),
      };
    }

    const sort: any = query.sort
      ? { [query.sort.replace('-', '')]: query.sort.startsWith('-') ? -1 : 1 }
      : { createdAt: -1 };

    const [data, total] = await Promise.all([
      this.articleModel
        .find(filter)
        .select('-content')
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.articleModel.countDocuments(filter),
    ]);

    const result = { data, total };

    if (!skipCache) {
      await this.cache.set(cacheKey, result, 180_000); // 3 phút

      // Track cache key
      this.listCacheKeys.add(cacheKey);
      await this.saveTrackedKeys();

      console.log('Cached result:', cacheKey);
    }

    return result;
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

  async findBySlug(slug: string) {
    const cacheKey = `articles:detail:${slug}`;

    const cached = await this.cache.get<Article>(cacheKey);
    if (cached) {
      console.log('Cache hit (detail):', cacheKey);
      return cached;
    }

    const article = await this.articleModel
      .findOne({ slug, status: 'Published' })
      .populate('category', 'name slug')
      .populate('author', 'username')
      .exec();

    if (!article) throw new NotFoundException('Bài viết không tồn tại');

    await this.cache.set(cacheKey, article, 3_600_000); // 1 giờ
    console.log('Cached detail:', cacheKey);

    return article;
  }

  async update(id: string, dto: UpdateArticleDto) {
    const existing = await this.articleModel.findById(id);
    if (!existing) throw new NotFoundException('Không tìm thấy bài viết');

    if (dto.title && !dto.slug) {
      dto.slug = slugify(dto.title, { lower: true, locale: 'vi' });
    }

    if (dto.thumbnail && dto.thumbnail !== existing.thumbnail) {
      try {
        dto.thumbnail = await this.filesService.moveFromTemp(dto.thumbnail);
        if (existing.thumbnail) {
          await this.filesService.deleteFileByUrl(existing.thumbnail);
        }
      } catch (error) {
        console.error('Error updating thumbnail:', error);
      }
    }

    if (dto.content) {
      try {
        const newImageUrls = this.filesService.extractImageUrls(dto.content);
        for (const url of newImageUrls) {
          const newUrl = await this.filesService.moveFromTemp(url);
          dto.content = dto.content.replace(url, newUrl);
        }

        const oldImageUrls = this.filesService.extractImageUrls(existing.content || '');
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
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (updated) {
      await this.cache.del(`articles:detail:${existing.slug}`);
      if (dto.slug && dto.slug !== existing.slug) {
        await this.cache.del(`articles:detail:${dto.slug}`);
      }
      await this.invalidateListCache();
    }

    return updated;
  }

  async remove(id: string) {
    const article = await this.articleModel.findById(id);
    if (!article) throw new NotFoundException('Không tìm thấy bài viết');

    if (article.thumbnail) {
      try {
        await this.filesService.deleteFileByUrl(article.thumbnail);
      } catch (error) {
        console.error('Error deleting thumbnail:', error);
      }
    }

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

    await this.articleModel.findByIdAndDelete(id).exec();

    await this.cache.del(`articles:detail:${article.slug}`);
    await this.invalidateListCache();

    this.eventsGateway.emitDeletedArticle(id);

    return true;
  }

  private async invalidateListCache() {
    try {
      const keys = Array.from(this.listCacheKeys);

      if (keys.length > 0) {
        await Promise.all(keys.map(key => this.cache.del(key)));
        console.log(`Invalidated ${keys.length} list cache entries`);

        // Clear tracking
        this.listCacheKeys.clear();
        await this.cache.del(this.LIST_CACHE_TRACKING_KEY);
      }
    } catch (error) {
      console.error('Error invalidating cache:', error);
    }
  }

  async findRelated(slug: string) {
    const article = await this.articleModel.findOne({ slug });
    if (!article) throw new NotFoundException('Bài viết không tồn tại');

    const related = await this.articleModel
      .find({
        category: article.category,
        _id: { $ne: article._id },
        status: 'Published'
      })
      .select('title slug thumbnail createdAt')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(3)
      .exec();

    return related;
  }
}