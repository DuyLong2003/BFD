'use client';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { App, Typography, theme } from 'antd';
import {
    UserOutlined, MailOutlined, EnvironmentOutlined,
    PhoneOutlined, SendOutlined
} from '@ant-design/icons';
import { BaseInput, BaseTextArea } from '@/components/core/BaseInput'; // Tận dụng component Base bạn đã có
import { BaseButton } from '@/components/core/BaseButton';
import { contactService, ContactDto } from '@/services/contact.service';

const { Title, Text, Paragraph } = Typography;

// Schema Validation
const contactSchema = z.object({
    name: z.string().min(2, 'Vui lòng nhập họ tên (tối thiểu 2 ký tự)'),
    email: z.string().email('Email không hợp lệ'),
    message: z.string().min(10, 'Nội dung tin nhắn quá ngắn (tối thiểu 10 ký tự)'),
});

type ContactSchema = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const { message } = App.useApp();
    const { token } = theme.useToken();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactSchema>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            message: '',
        },
    });

    const contactMutation = useMutation({
        mutationFn: contactService.createContact,
        onSuccess: () => {
            message.success('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.');
            reset(); // Xóa trắng form
        },
        onError: () => {
            message.error('Gửi thất bại. Vui lòng thử lại sau.');
        },
    });

    const onSubmit = (data: ContactSchema) => {
        contactMutation.mutate(data);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <Title level={1} className="!text-3xl sm:!text-4xl !font-bold text-gray-900 mb-4">
                        Liên hệ với chúng tôi
                    </Title>
                    <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Chúng tôi luôn lắng nghe và sẵn sàng giải đáp mọi thắc mắc của bạn.
                        Hãy để lại tin nhắn, BFD sẽ phản hồi trong thời gian sớm nhất.
                    </Paragraph>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* LEFT COLUMN: INFO */}
                    <div className="bg-[#001529] p-10 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

                        <div>
                            <Title level={3} className="!text-white mb-8">Thông tin liên hệ</Title>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                                        <EnvironmentOutlined className="text-xl text-blue-400" />
                                    </div>
                                    <div>
                                        <Text className="!text-white/60 block mb-1">Địa chỉ</Text>
                                        <Text className="!text-white font-medium text-lg">
                                            Tầng 12, Tòa nhà BFD Tower,<br />
                                            123 Đường Công Nghệ, Hà Nội
                                        </Text>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                                        <MailOutlined className="text-xl text-blue-400" />
                                    </div>
                                    <div>
                                        <Text className="!text-white/60 block mb-1">Email</Text>
                                        <Text className="!text-white font-medium text-lg">contact@bfd-news.com</Text>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                                        <PhoneOutlined className="text-xl text-blue-400" />
                                    </div>
                                    <div>
                                        <Text className="!text-white/60 block mb-1">Hotline</Text>
                                        <Text className="!text-white font-medium text-lg">0987 654 321</Text>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/10">
                            <Text className="!text-white/40 italic">
                                "Công nghệ kiến tạo tương lai - BFD luôn đồng hành cùng bạn."
                            </Text>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FORM */}
                    <div className="p-10 lg:p-12">
                        <Title level={3} className="mb-8 !text-gray-800">Gửi tin nhắn</Title>

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                            {/* Name */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <BaseInput
                                            {...field}
                                            size="large"
                                            placeholder="Nhập họ tên của bạn"
                                            prefix={<UserOutlined className="text-gray-400" />}
                                            status={errors.name ? 'error' : ''}
                                            className="!bg-gray-50 !border-gray-200 focus:!bg-white focus:!border-blue-500"
                                        />
                                    )}
                                />
                                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <BaseInput
                                            {...field}
                                            size="large"
                                            placeholder="example@gmail.com"
                                            prefix={<MailOutlined className="text-gray-400" />}
                                            status={errors.email ? 'error' : ''}
                                            className="!bg-gray-50 !border-gray-200 focus:!bg-white focus:!border-blue-500"
                                        />
                                    )}
                                />
                                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                            </div>

                            {/* Message */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Nội dung</label>
                                <Controller
                                    name="message"
                                    control={control}
                                    render={({ field }) => (
                                        <BaseTextArea
                                            {...field}
                                            size="large"
                                            placeholder="Bạn cần hỗ trợ gì?"
                                            rows={4}
                                            status={errors.message ? 'error' : ''}
                                            className="!bg-gray-50 !border-gray-200 focus:!bg-white focus:!border-blue-500"
                                        />
                                    )}
                                />
                                {errors.message && <span className="text-red-500 text-xs">{errors.message.message}</span>}
                            </div>

                            {/* Submit Button */}
                            <div className="mt-4">
                                <BaseButton
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    block
                                    loading={contactMutation.isPending}
                                    icon={<SendOutlined />}
                                    className="h-12 bg-blue-600 hover:!bg-blue-700 font-semibold shadow-lg shadow-blue-200 transition-all"
                                >
                                    Gửi liên hệ
                                </BaseButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}