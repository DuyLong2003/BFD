import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';

@Processor('contacts')
export class ContactsProcessor extends WorkerHost {
    constructor(
        @InjectModel(Contact.name) private contactModel: Model<ContactDocument>
    ) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        // job.name là 'send-email'
        // job.data chứa { contactId, email, name... }

        console.log(`[Worker] 📩 Bắt đầu xử lý Job ${job.id} gửi mail tới: ${job.data.email}`);

        // giả lập gửi mail -> delay 3s
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Cập nhật trạng thái trong DB thành 'Processed'
        if (job.data.contactId) {
            await this.contactModel.findByIdAndUpdate(job.data.contactId, {
                status: 'Processed'
            });
        }

        console.log(`[Worker] ✅ Đã gửi email thành công cho ${job.data.name}!`);
        return { sent: true };
    }
}