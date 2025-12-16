'use client';

import { Button, Typography } from 'antd';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function ContactSection() {
    return (
        <div className="relative mt-20 rounded-2xl overflow-hidden text-center text-white isolate">
            {/* Background Image & Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-20 transform scale-105"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)' }}
            />
            <div className="absolute inset-0 bg-black/60 -z-10" />

            {/* Content Container */}
            <div className="py-20 px-6 flex flex-col items-center gap-6">
                <Title level={2} className="!text-white !text-3xl md:!text-4xl !m-0">
                    Sẵn sàng hợp tác cùng BFD?
                </Title>

                <Paragraph className="!text-white/85 !text-lg max-w-xl leading-relaxed">
                    Liên hệ ngay với chúng tôi để nhận tư vấn giải pháp công nghệ phù hợp nhất cho doanh nghiệp của bạn.
                </Paragraph>

                <Link href="/contact">
                    <Button
                        type="primary"
                        size="large"
                        className="!h-12 !px-10 !text-base !bg-primary hover:!bg-blue-600 border-none shadow-xl hover:shadow-2xl transition-all"
                    >
                        Gửi yêu cầu tư vấn
                    </Button>
                </Link>
            </div>
        </div>
    );
}