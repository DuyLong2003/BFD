import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'Tên chuyên mục không được để trống' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'Slug không được để trống' })
    @IsString()
    slug: string;

    @IsOptional()
    @IsString()
    description?: string;
}