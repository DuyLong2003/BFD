import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class FilesService {
    private minioClient: Minio.Client;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        this.bucketName = this.configService.get<string>('MINIO_BUCKET', 'bfd-news');

        this.minioClient = new Minio.Client({
            endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
            port: parseInt(this.configService.get<string>('MINIO_PORT', '9000')),
            useSSL: this.configService.get<string>('MINIO_USE_SSL') === 'true',
            accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
            secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
        });

        this.initBucket();
    }

    private async initBucket() {
        const exists = await this.minioClient.bucketExists(this.bucketName);
        if (!exists) {
            await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        }
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { AWS: ['*'] },
                    Action: ['s3:GetObject'],
                    Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                },
            ],
        };
        await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
    }

    async uploadFile(file: Express.Multer.File) {
        try {
            // Tạo tên file ngẫu nhiên
            const fileExt = path.extname(file.originalname);
            const randomName = crypto.randomUUID();
            const fileName = `${randomName}${fileExt}`;

            // 2. Upload lên MinIO
            await this.minioClient.putObject(
                this.bucketName,
                fileName,
                file.buffer,
                file.size,
                { 'Content-Type': file.mimetype },
            );

            // Trả về URL công khai
            const protocol = this.configService.get('MINIO_USE_SSL') === 'true' ? 'https' : 'http';
            const publicHost = this.configService.get<string>('MINIO_PUBLIC_ENDPOINT', 'localhost');
            const port = this.configService.get<string>('MINIO_PORT', '9000');

            const url = `${protocol}://${publicHost}:${port}/${this.bucketName}/${fileName}`;

            return {
                url: url,
                fileName: fileName,
            };
        } catch (error) {
            console.error('MinIO Upload Error:', error);
            throw new InternalServerErrorException('Lỗi upload file');
        }
    }
}