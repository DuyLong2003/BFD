import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateContactDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Nội dung không được để trống' })
    message: string;
}