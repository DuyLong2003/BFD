import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'Tên chuyên mục không được để trống' })
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    slug: string;

    @IsOptional()
    @IsString()
    description?: string;
}