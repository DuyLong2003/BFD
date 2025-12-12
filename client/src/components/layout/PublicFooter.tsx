'use client';

import { Layout, Row, Col, Typography, Space } from 'antd';
import { FacebookFilled, TwitterSquareFilled, LinkedinFilled } from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

export default function PublicFooter() {
    return (
        <Footer style={{ background: '#001529', color: '#fff', padding: '48px 24px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <Row gutter={[32, 32]}>
                    {/* Cột 1: Thông tin công ty */}
                    <Col xs={24} md={8}>
                        <Title level={4} style={{ color: '#fff', margin: 0 }}>BFD NEWS</Title>
                        <Text style={{ color: 'rgba(255,255,255,0.65)', display: 'block', marginTop: 16 }}>
                            Hệ thống tin tức cập nhật công nghệ nhanh nhất, chính xác nhất. Đồng hành cùng sự phát triển của bạn.
                        </Text>
                    </Col>

                    {/* Cột 2: Liên kết nhanh */}
                    <Col xs={24} md={8}>
                        <Title level={5} style={{ color: '#fff' }}>Liên kết</Title>
                        <Space direction="vertical" style={{ marginTop: 8 }}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.65)' }}>Trang chủ</Link>
                            <Link href="/news" style={{ color: 'rgba(255,255,255,0.65)' }}>Tin tức</Link>
                            <Link href="/about" style={{ color: 'rgba(255,255,255,0.65)' }}>Về chúng tôi</Link>
                        </Space>
                    </Col>

                    {/* Cột 3: Liên hệ */}
                    <Col xs={24} md={8}>
                        <Title level={5} style={{ color: '#fff' }}>Liên hệ</Title>
                        <Text style={{ color: 'rgba(255,255,255,0.65)', display: 'block', marginTop: 8 }}>
                            Email: contact@bfd-news.com
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.65)', display: 'block' }}>
                            Hotline: 0987 654 321
                        </Text>
                        <Space style={{ marginTop: 16, fontSize: 24 }}>
                            <FacebookFilled style={{ color: '#fff' }} />
                            <TwitterSquareFilled style={{ color: '#fff' }} />
                            <LinkedinFilled style={{ color: '#fff' }} />
                        </Space>
                    </Col>
                </Row>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 32, paddingTop: 16, textAlign: 'center' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.45)' }}>
                        © 2025 BFD News. All rights reserved.
                    </Text>
                </div>
            </div>
        </Footer>
    );
}