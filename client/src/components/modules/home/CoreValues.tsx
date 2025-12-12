'use client';

import { Row, Col, Card, Typography } from 'antd';
import { RocketOutlined, SafetyCertificateOutlined, BulbOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const values = [
    {
        icon: <RocketOutlined style={{ fontSize: 32, color: '#0052CC' }} />,
        title: 'Tốc độ vượt trội',
        desc: 'Hệ thống được tối ưu hóa để mang lại trải nghiệm nhanh nhất cho người dùng.'
    },
    {
        icon: <SafetyCertificateOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
        title: 'Bảo mật tuyệt đối',
        desc: 'Dữ liệu của bạn được bảo vệ bởi các tiêu chuẩn an ninh mạng hàng đầu.'
    },
    {
        icon: <BulbOutlined style={{ fontSize: 32, color: '#faad14' }} />,
        title: 'Sáng tạo không ngừng',
        desc: 'Luôn cập nhật và áp dụng những công nghệ mới nhất vào sản phẩm.'
    },
    {
        icon: <TeamOutlined style={{ fontSize: 32, color: '#eb2f96' }} />,
        title: 'Đội ngũ tận tâm',
        desc: 'Hỗ trợ khách hàng 24/7 với thái độ chuyên nghiệp và nhiệt tình nhất.'
    }
];

export default function CoreValues() {
    return (
        <div style={{ padding: '60px 0', background: '#F8F9FA', borderRadius: 16, margin: '40px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <Title level={2}>Tại sao chọn BFD?</Title>
                <Paragraph style={{ fontSize: 16, color: '#595959' }}>
                    Những giá trị làm nên sự khác biệt của chúng tôi
                </Paragraph>
            </div>

            <Row gutter={[24, 24]} style={{ padding: '0 24px' }}>
                {values.map((item, index) => (
                    <Col xs={24} sm={12} md={6} key={index}>
                        <Card
                            hoverable
                            variant="borderless"
                            style={{ height: '100%', textAlign: 'center' }}
                        >
                            <div style={{
                                width: 64, height: 64, background: '#F0F5FF',
                                borderRadius: '50%', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', margin: '0 auto 16px'
                            }}>
                                {item.icon}
                            </div>
                            <Title level={4} style={{ fontSize: 18 }}>{item.title}</Title>
                            <Paragraph type="secondary">
                                {item.desc}
                            </Paragraph>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}