import { IsNotEmpty, IsString, IsOptional, IsMongoId, IsEnum } from 'class-validator';

export class CreateArticleDto {
    @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
    @IsString()
    title: string;

    @IsOptional() // Slug có thể để trống, BE sẽ tự tạo
    @IsString()
    slug?: string;

    @IsNotEmpty({ message: 'Nội dung không được để trống' })
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    thumbnail?: string;

    @IsNotEmpty({ message: 'Chuyên mục không được để trống' })
    @IsMongoId({ message: 'Category ID không hợp lệ' }) // Kiểm tra xem có đúng định dạng ID MongoDB không
    category: string;

    @IsOptional()
    @IsEnum(['Draft', 'Published'], { message: 'Trạng thái không hợp lệ' })
    status?: string;
}