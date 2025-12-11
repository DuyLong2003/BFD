import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { comparePasswordHelper } from 'src/helpers/util';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (!user) return null;

        const isValidPassword = await comparePasswordHelper(pass, user.password);
        if (!isValidPassword) return null;
        return user;
    }

    async login(user: any) {
        const payload = {
            username: user.username,
            role: user.role,
            sub: user._id
        };
        return {
            user: {
                username: user.username,
                _id: user._id,
            },
            access_token: this.jwtService.sign(payload),
        };
    }

    handleRegister = async (registerDto: CreateAuthDto) => {
        return await this.usersService.handleRegister(registerDto);

    }


}