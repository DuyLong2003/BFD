import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { ContactsController } from './contacts.controller';
import { Contact, ContactSchema } from './schemas/contact.schema';
import { ContactsProcessor } from './contacts.processor';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
        // Đăng ký hàng đợi 'contacts'
        BullModule.registerQueue({
            name: 'contacts',
        }),
    ],
    controllers: [ContactsController],
    providers: [ContactsProcessor], // Đăng ký Worker
})
export class ContactsModule { }