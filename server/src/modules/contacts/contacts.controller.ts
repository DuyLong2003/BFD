import { Controller, Post, Body } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { Public } from '../../decorator/customize';

@Controller('contacts')
export class ContactsController {
    constructor(
        @InjectQueue('contacts') private contactQueue: Queue,
        @InjectModel(Contact.name) private contactModel: Model<ContactDocument>
    ) { }

    @Public() // Cho phép khách gửi liên hệ không cần login
    @Post()
    async create(@Body() createContactDto: CreateContactDto) {
        // 1. Lưu vào DB trước (Trạng thái Pending)
        const newContact = await this.contactModel.create({
            ...createContactDto,
            status: 'Pending'
        });

        // 2. Đẩy job vào hàng đợi
        await this.contactQueue.add('send-email', {
            contactId: newContact._id,
            email: newContact.email,
            name: newContact.name,
            message: newContact.message
        }, {
            removeOnComplete: true // Xóa job khỏi Redis khi xong để đỡ rác
        });

        return {
            message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.',
            data: newContact
        };
    }
}