import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';
import { EventsGateway } from 'src/events/events.gateway';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    private eventsGateway: EventsGateway,
  ) { }


  async create(createCategoryDto: CreateCategoryDto) {
    // 1. Auto Slug
    if (!createCategoryDto.slug) {
      createCategoryDto.slug = slugify(createCategoryDto.name, { lower: true, locale: 'vi' });
    }
    // 2. Check trùng tên hoặc slug
    const exists = await this.categoryModel.findOne({
      $or: [{ slug: createCategoryDto.slug }, { name: createCategoryDto.name }]
    });
    if (exists) throw new BadRequestException('Chuyên mục đã tồn tại');

    const createdCategory = await this.categoryModel.create(createCategoryDto);

    this.eventsGateway.emitNewCategory(createdCategory);

    return createdCategory.save();
  }

  async findAll(query: { page?: string; limit?: string; q?: string; sort?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (query.q) {
      filter.name = { $regex: query.q, $options: 'i' }; // Tìm gần đúng theo tên
    }

    // Xử lý sort dynamic
    let sortConfig: any = { createdAt: -1 };
    if (query.sort) {
      const isDesc = query.sort.startsWith('-');
      const field = query.sort.replace('-', '');
      sortConfig = { [field]: isDesc ? -1 : 1 };
    }

    const total = await this.categoryModel.countDocuments(filter);
    const data = await this.categoryModel
      .find(filter)
      .sort(sortConfig)
      .skip(skip)
      .limit(limit)
      .exec();

    return { data, total };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('ID không hợp lệ');
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Không tìm thấy chuyên mục');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (updateCategoryDto.name && !updateCategoryDto.slug) {
      updateCategoryDto.slug = slugify(updateCategoryDto.name, { lower: true, locale: 'vi' });
    }
    const updated = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
    if (!updated) throw new NotFoundException('Không tìm thấy');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.categoryModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Không tìm thấy');

    // Realtime
    this.eventsGateway.emitDeletedCategory(id);
    return deleted;
  }
}