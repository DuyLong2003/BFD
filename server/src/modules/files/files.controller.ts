import { Controller, Post, UploadedFile, UseInterceptors, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../../auth/passport/jwt-auth.guard';

@Controller('files')
@UseGuards(JwtAuthGuard) // Chỉ user đã login mới được up ảnh
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        // Validate file 
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
}