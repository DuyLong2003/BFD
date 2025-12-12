import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
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

    // Upload file vào thư mục temp/ mặc định
    async uploadFile(file: Express.Multer.File, folder: string = 'temp/') {
        try {
            const fileExt = path.extname(file.originalname);
            const randomName = crypto.randomUUID();
            const fileName = `${folder}${randomName}${fileExt}`;

            await this.minioClient.putObject(
                this.bucketName,
                fileName,
                file.buffer,
                file.size,
                { 'Content-Type': file.mimetype },
            );

            const protocol = this.configService.get('MINIO_USE_SSL') === 'true' ? 'https' : 'http';
            const publicHost = this.configService.get<string>('MINIO_PUBLIC_ENDPOINT', 'localhost');
            const port = this.configService.get<string>('MINIO_PORT', '9000');

            const url = `${protocol}://${publicHost}:${port}/${this.bucketName}/${fileName}`;

            console.log(`Uploaded to temp: ${fileName}`);
            return { url, fileName };
        } catch (error) {
            console.error('MinIO Upload Error:', error);
            throw new InternalServerErrorException('Lỗi upload file');
        }
    }

    // Move file từ temp/ sang articles/
    async moveFromTemp(fileUrl: string): Promise<string> {
        try {
            if (!fileUrl) return fileUrl;

            // Parse URL để lấy object name
            const url = new URL(fileUrl);
            const pathParts = url.pathname.split('/').filter(Boolean);

            // pathParts: ['bfd-news', 'temp', 'abc123.jpg']
            // Bỏ bucket name (phần tử đầu), lấy phần còn lại
            const objectName = pathParts.slice(1).join('/'); // "temp/abc123.jpg"

            if (!objectName.startsWith('temp/')) {
                console.log('File already permanent:', objectName);
                return fileUrl;
            }

            const newObjectName = objectName.replace('temp/', 'articles/');

            console.log(`Moving: ${objectName} → ${newObjectName}`);

            // Copy object sang vị trí mới
            await this.minioClient.copyObject(
                this.bucketName,
                newObjectName,
                `/${this.bucketName}/${objectName}`,
            );

            // Xóa object cũ
            await this.minioClient.removeObject(this.bucketName, objectName);

            const protocol = this.configService.get('MINIO_USE_SSL') === 'true' ? 'https' : 'http';
            const publicHost = this.configService.get<string>('MINIO_PUBLIC_ENDPOINT', 'localhost');
            const port = this.configService.get<string>('MINIO_PORT', '9000');

            const newUrl = `${protocol}://${publicHost}:${port}/${this.bucketName}/${newObjectName}`;

            console.log(`Moved successfully: ${newUrl}`);
            return newUrl;
        } catch (error) {
            console.error('Move file error:', error);
            console.warn('Falling back to original URL');
            return fileUrl;
        }
    }

    extractImageUrls(html: string): string[] {
        if (!html) return [];

        const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
        const urls: string[] = [];
        let match;

        while ((match = imgRegex.exec(html)) !== null) {
            const url = match[1];
            if (url.includes(this.bucketName)) {
                urls.push(url);
            }
        }

        console.log(`📷 Extracted ${urls.length} image URLs from content`);
        return urls;
    }

    // Delete file by URL
    async deleteFileByUrl(fileUrl: string): Promise<void> {
        try {
            if (!fileUrl) return;

            const url = new URL(fileUrl);
            const pathParts = url.pathname.split('/').filter(Boolean);
            const objectName = pathParts.slice(1).join('/');

            await this.minioClient.removeObject(this.bucketName, objectName);
            console.log(`Deleted file: ${objectName}`);
        } catch (error) {
            console.error('Delete file error:', error);
        }
    }

    // Xóa file temp > 24h (chạy mỗi ngày lúc 3h sáng)
    @Cron(CronExpression.EVERY_DAY_AT_3AM)
    async cleanupTempFiles() {
        try {
            console.log('Starting cleanup temp files...');
            const stream = this.minioClient.listObjectsV2(this.bucketName, 'temp/', true);
            const now = Date.now();
            const oneDayAgo = now - 24 * 60 * 60 * 1000;

            let deletedCount = 0;

            for await (const obj of stream) {
                if (obj.lastModified && obj.lastModified.getTime() < oneDayAgo) {
                    await this.minioClient.removeObject(this.bucketName, obj.name);
                    console.log(`Deleted temp file: ${obj.name}`);
                    deletedCount++;
                }
            }

            console.log(`Cleanup completed. Deleted ${deletedCount} temp files.`);
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }
}