import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({ message: "username không được để trống" })
    username: string;

    @IsNotEmpty({ message: "password không được để trống" })
    password: string;

    @IsOptional()
    role: string;
}


export class CodeAuthDto {
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;

}
