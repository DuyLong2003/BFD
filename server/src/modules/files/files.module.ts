import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
    imports: [ScheduleModule.forRoot()],
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService],
})
export class FilesModule { }