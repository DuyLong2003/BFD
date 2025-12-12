import {
    Controller, Post, UploadedFile, UseInterceptors,
    UseGuards, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../../auth/passport/jwt-auth.guard';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                return callback(new BadRequestException('Chỉ cho phép upload ảnh!'), false);
            }
            callback(null, true);
        },
    }))
    async upload(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('Vui lòng chọn file');
        return this.filesService.uploadFile(file);
    }

    // Endpoint riêng cho TinyMCE (trả về format chuẩn)
    @Post('upload-tinymce')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                return callback(new BadRequestException('Chỉ cho phép upload ảnh!'), false);
            }
            callback(null, true);
        },
    }))
    async uploadForTinyMCE(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('Vui lòng chọn file');
        const result = await this.filesService.uploadFile(file);

        return { location: result.url };
    }
}