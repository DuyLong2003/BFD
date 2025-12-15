'use client';

import { Card, Typography, Button, Flex } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function Banner() {
    return (
        <Card
            className="border-none mb-10 mt-12 overflow-hidden shadow-lg"
            styles={{
                body: { padding: 0 } // Reset padding của Ant Card để dùng padding Tailwind
            }}
        >
            <div className="bg-gradient-to-br from-[#0052CC] to-[#003EB3] px-6 py-16 md:px-12 md:py-20 text-center rounded-2xl">
                <Flex vertical align="center" className="max-w-4xl mx-auto">
                    <Title level={1} className="!text-white !text-3xl md:!text-5xl !font-bold !mb-4">
                        Chào mừng đến với BFD News
                    </Title>

                    <Paragraph className="!text-white/85 !text-lg md:!text-xl max-w-2xl !mb-8 leading-relaxed">
                        Cập nhật những tin tức công nghệ mới nhất, xu hướng phát triển phần mềm và những câu chuyện thú vị từ đội ngũ BFD.
                    </Paragraph>

                    <Link href="/news">
                        <Button
                            type="default"
                            size="large"
                            className="!h-12 !px-8 !text-primary !font-semibold hover:!scale-105 transition-transform"
                            icon={<ArrowRightOutlined />}
                        >
                            Xem tin tức ngay
                        </Button>
                    </Link>
                </Flex>
            </div>
        </Card>
    );
}