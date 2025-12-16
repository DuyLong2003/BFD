import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { DashboardModule } from './modules/dashboard/dashboard.modules';
import { EventsModule } from './events/events.module';
import { FilesModule } from './modules/files/files.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { BullModule } from '@nestjs/bullmq';
import { ContactsModule } from './modules/contacts/contacts.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      useFactory: () => ({
        store: new KeyvRedis({
          url: 'redis://localhost:6379',
        }),
        ttl: 60 * 1000,
      }),
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST') || 'localhost',
          port: parseInt(configService.get('REDIS_PORT') || '6379'),
        },
      }),
      inject: [ConfigService],
    }),

    ThrottlerModule.forRoot([{
      ttl: 60000, // Thời gian tính bằng mili-giây (60 giây)
      limit: 20,  // Giới hạn tối đa 20 request trong 60 giây (Chống spam API)
    }]),

    UsersModule,
    CategoriesModule,
    ArticlesModule,
    AuthModule,
    DashboardModule,
    EventsModule,
    FilesModule,
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
