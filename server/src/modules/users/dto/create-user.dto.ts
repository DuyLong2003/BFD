import { IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'Username không được để trống' })
    @IsString()
    username: string;

    @IsNotEmpty({ message: 'Password không được để trống' })
    @IsString()
    @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
    password: string;

    @IsOptional()
    @IsEnum(['admin', 'user']) // Giới hạn các quyền cho phép
    role?: string;
}