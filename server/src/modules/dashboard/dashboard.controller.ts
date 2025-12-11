import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Article } from '../articles/schemas/article.schema';
import { Category } from '../categories/schemas/category.schema';
import { JwtAuthGuard } from '../../auth/passport/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Article.name) private articleModel: Model<Article>,
        @InjectModel(Category.name) private categoryModel: Model<Category>,
    ) { }

    @Get('stats')
    async getStats() {
        // Chạy song song 3 lệnh đếm để tối ưu hiệu năng
        const [totalUsers, totalArticles, totalCategories] = await Promise.all([
            this.userModel.countDocuments(),
            this.articleModel.countDocuments(),
            this.categoryModel.countDocuments(),
        ]);

        return {
            totalUsers,
            totalArticles,
            totalCategories,
        };
    }
}