import { Controller, Post, UseGuards, Request, HttpCode, HttpStatus, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public, ResponseMessage } from '../decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './passport/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post("login")
    @Public()
    @UseGuards(LocalAuthGuard)
    @ResponseMessage("Fetch login")
    handleLogin(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    // @UseGuards(JwtAuthGuard)
    @Public()
    @Post('register')
    register(@Body() registerDto: CreateAuthDto) {
        return this.authService.handleRegister(registerDto);
    }
}