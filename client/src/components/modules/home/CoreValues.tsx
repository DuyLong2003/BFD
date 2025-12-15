'use client';

import { Card, Typography } from 'antd';
import { RocketOutlined, SafetyCertificateOutlined, BulbOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const values = [
    {
        icon: <RocketOutlined className="text-3xl text-[#0052CC]" />,
        title: 'Tốc độ vượt trội',
        desc: 'Hệ thống được tối ưu hóa để mang lại trải nghiệm nhanh nhất.'
    },
    {
        icon: <SafetyCertificateOutlined className="text-3xl text-[#52c41a]" />,
        title: 'Bảo mật tuyệt đối',
        desc: 'Dữ liệu được bảo vệ bởi các tiêu chuẩn an ninh mạng hàng đầu.'
    },
    {
        icon: <BulbOutlined className="text-3xl text-[#faad14]" />,
        title: 'Sáng tạo',
        desc: 'Luôn cập nhật và áp dụng những công nghệ mới nhất.'
    },
    {
        icon: <TeamOutlined className="text-3xl text-[#eb2f96]" />,
        title: 'Đội ngũ tận tâm',
        desc: 'Hỗ trợ khách hàng 24/7 với thái độ chuyên nghiệp.'
    }
];

export default function CoreValues() {
    return (
        <div className="py-16 my-12 bg-gray-50 rounded-2xl">
            <div className="text-center mb-12 px-4">
                <Title level={2} className="!mb-2">Tại sao chọn BFD?</Title>
                <Paragraph className="!text-gray-500 !text-lg">
                    Những giá trị cốt lõi làm nên sự khác biệt
                </Paragraph>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 lg:px-12">
                {values.map((item, index) => (
                    <Card
                        key={index}
                        hoverable
                        variant="borderless"
                        className="h-full text-center bg-transparent shadow-none hover:bg-white hover:shadow-md transition-all duration-300"
                    >
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            {item.icon}
                        </div>
                        <Title level={4} className="!text-lg !mb-2">{item.title}</Title>
                        <Paragraph type="secondary" className="!text-sm">
                            {item.desc}
                        </Paragraph>
                    </Card>
                ))}
            </div>
        </div>
    );
}