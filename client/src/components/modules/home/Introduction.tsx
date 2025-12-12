'use client';

import { Row, Col, Typography, Button, Image } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function Introduction() {
    return (
        <div style={{ padding: '60px 0' }}>
            <Row gutter={[48, 32]} align="middle">
                <Col xs={24} md={12}>
                    <Image
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="About BFD"
                        preview={false}
                        style={{ borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Title level={5} style={{ color: '#0052CC', textTransform: 'uppercase', letterSpacing: 1 }}>
                        Về chúng tôi
                    </Title>
                    <Title level={2} style={{ marginTop: 8 }}>
                        Kiến tạo giải pháp công nghệ <br /> Đột phá tương lai
                    </Title>
                    <Paragraph style={{ fontSize: 16, color: '#595959', lineHeight: 1.8 }}>
                        BFD News không chỉ là trang tin tức, chúng tôi là đội ngũ kỹ sư phần mềm đam mê công nghệ.
                        Sứ mệnh của chúng tôi là mang đến những giải pháp chuyển đổi số toàn diện, giúp doanh nghiệp
                        bứt phá trong kỷ nguyên 4.0.
                    </Paragraph>
                    <Paragraph style={{ fontSize: 16, color: '#595959', lineHeight: 1.8 }}>
                        Với hơn 10 năm kinh nghiệm, chúng tôi tự hào là đối tác tin cậy của nhiều tập đoàn lớn.
                    </Paragraph>
                    <Link href="/about">
                        <Button type="default" size="large" icon={<ArrowRightOutlined />} style={{ marginTop: 16 }}>
                            Tìm hiểu thêm
                        </Button>
                    </Link>
                </Col>
            </Row>
        </div>
    );
}