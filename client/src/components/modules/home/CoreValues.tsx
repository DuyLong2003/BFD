'use client';

import { Card, Typography } from 'antd';
import { RocketOutlined, SafetyCertificateOutlined, BulbOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const values = [
    {
        icon: <RocketOutlined className="text-3xl text-[#0041a3]" />,
        title: 'Tốc độ vượt trội',
        desc: 'Hệ thống được tối ưu hóa để mang lại trải nghiệm nhanh nhất.'
    },
    {
        icon: <SafetyCertificateOutlined className="text-3xl text-[#389e0d]" />,
        title: 'Bảo mật tuyệt đối',
        desc: 'Dữ liệu được bảo vệ bởi các tiêu chuẩn an ninh mạng hàng đầu.'
    },
    {
        icon: <BulbOutlined className="text-3xl text-[#d48806]" />,
        title: 'Sáng tạo',
        desc: 'Luôn cập nhật và áp dụng những công nghệ mới nhất.'
    },
    {
        icon: <TeamOutlined className="text-3xl text-[#c41d7f]" />,
        title: 'Đội ngũ tận tâm',
        desc: 'Hỗ trợ khách hàng 24/7 với thái độ chuyên nghiệp.'
    }
];

export default function CoreValues() {
    return (
        <div className="py-16 my-12 bg-gray-50 rounded-2xl">
            <div className="text-center mb-12 px-4">
                <Title level={2} className="!mb-2">Tại sao chọn BFD?</Title>
                <Paragraph className="!text-gray-600 !text-lg max-w-2xl mx-auto">
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
                        <h3 className="text-lg font-bold mb-2 text-gray-800">{item.title}</h3>
                        <p className="text-sm text-gray-600">
                            {item.desc}
                        </p>
                    </Card>
                ))}
            </div>
        </div>
    );
}