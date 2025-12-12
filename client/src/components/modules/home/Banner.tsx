'use client';

import { Card, Typography, Button, Flex } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function Banner() {
    return (
        <Card
            style={{
                background: 'linear-gradient(135deg, #0052CC 0%, #003EB3 100%)',
                border: 'none',
                borderRadius: 16,
                marginBottom: 40,
                marginTop: 50
            }}
            styles={{ body: { padding: '48px 24px' } }}
        >
            <Flex vertical align="center" style={{ textAlign: 'center' }}>
                <Title level={1} style={{ color: '#fff', margin: 0, fontSize: 42 }}>
                    Chào mừng đến với BFD News
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginTop: 16, maxWidth: 600 }}>
                    Cập nhật những tin tức công nghệ mới nhất, xu hướng phát triển phần mềm và những câu chuyện thú vị từ đội ngũ BFD.
                </Paragraph>
                <Link href="/news">
                    <Button type="primary" size="large" icon={<ArrowRightOutlined />} style={{ marginTop: 24, height: 48, padding: '0 32px' }}>
                        Xem tin tức ngay
                    </Button>
                </Link>
            </Flex>
        </Card>
    );
}