import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Tự động vứt bỏ các trường thừa thãi 
    forbidNonWhitelisted: true, // Báo lỗi luôn nếu gửi thừa trường
  }));

  // --- CẤU HÌNH SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('BFD News API')
    .setVersion('1.0')
    .addBearerAuth() //
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Truy cập tại /docs

  // CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
