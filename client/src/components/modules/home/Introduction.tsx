'use client';

import { Typography, Button, Image } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function Introduction() {
    return (
        <section className="py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Cột Ảnh */}
            <div className="relative group">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl transform rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-500"></div>
                <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Đội ngũ kỹ sư BFD đang làm việc"
                    preview={false}
                    className="!rounded-2xl shadow-xl relative z-10"
                    wrapperClassName="w-full"
                />
            </div>

            {/* Cột Nội dung */}
            <div className="space-y-6">
                <div>
                    <a className="!text-primary !uppercase !tracking-widest !mb-2 text-xl">
                        Về chúng tôi
                    </a>
                    <Title level={2} className="!text-3xl md:!text-4xl !mt-0 !leading-tight">
                        Kiến tạo giải pháp công nghệ <br />
                        <span className="text-primary">Đột phá tương lai</span>
                    </Title>
                </div>

                <div className="space-y-4">
                    <Paragraph className="!text-lg !text-gray-700 leading-relaxed">
                        BFD News không chỉ là trang tin tức, chúng tôi là đội ngũ kỹ sư phần mềm đam mê công nghệ.
                        Sứ mệnh của chúng tôi là mang đến những giải pháp chuyển đổi số toàn diện.
                    </Paragraph>
                    <Paragraph className="!text-lg !text-gray-600 leading-relaxed">
                        Với hơn 10 năm kinh nghiệm, chúng tôi tự hào là đối tác tin cậy của nhiều tập đoàn lớn.
                    </Paragraph>
                </div>

                <Link href="/about">
                    <Button size="large" className="!mt-4 group">
                        Tìm hiểu thêm
                        <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </section>
    );
}