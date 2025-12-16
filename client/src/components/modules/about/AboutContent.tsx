'use client'; // 👈 Quan trọng: Đánh dấu chạy ở Client

import { Typography, Card, Row, Col, Divider } from 'antd';
import { RocketOutlined, EyeOutlined, GlobalOutlined } from '@ant-design/icons';
import Image from 'next/image';

const { Title, Paragraph, Text } = Typography;

export default function AboutContent() {
    return (
        <div className="bg-white">
            {/* 1. HERO SECTION */}
            <div className="bg-[#001529] text-white py-20 px-6 text-center mt-20">
                <div className="max-w-4xl mx-auto">
                    <Title level={1} className="!text-white !text-4xl md:!text-5xl !font-bold mb-6">
                        Về BFD Technology
                    </Title>
                    <Paragraph className="!text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
                        Tiên phong công nghệ - Kiến tạo tương lai. Chúng tôi không chỉ xây dựng phần mềm, chúng tôi xây dựng giải pháp cho sự thành công của bạn.
                    </Paragraph>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-16">
                {/* 2. CÂU CHUYỆN & TẦM NHÌN */}
                <Row gutter={[48, 48]} align="middle">
                    <Col xs={24} md={12}>
                        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
                            {/* Ảnh placeholder từ unsplash */}
                            <Image
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                                alt="BFD Team"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <Title level={2} className="!mb-6 text-3xl">Câu chuyện của chúng tôi</Title>
                        <Paragraph className="text-lg text-gray-600 mb-6 text-justify">
                            Được thành lập vào năm 2020, BFD Technology bắt đầu với một nhóm kỹ sư đam mê công nghệ và khát khao đổi mới. Từ một startup nhỏ, chúng tôi đã vươn mình trở thành đối tác tin cậy của hàng trăm doanh nghiệp trong lĩnh vực chuyển đổi số.
                        </Paragraph>
                        <Paragraph className="text-lg text-gray-600 text-justify">
                            Tại BFD, chúng tôi tin rằng công nghệ không nên là rào cản, mà phải là bệ phóng. Mỗi dòng code chúng tôi viết ra đều mang theo tâm huyết để giải quyết những bài toán thực tế nhất của khách hàng.
                        </Paragraph>
                    </Col>
                </Row>

                <Divider className="my-16" />

                {/* 3. SỨ MỆNH & GIÁ TRỊ */}
                <div className="text-center mb-12">
                    <Title level={2}>Sứ mệnh & Tầm nhìn</Title>
                    <Text type="secondary">Những nguyên tắc định hình con đường chúng tôi đi</Text>
                </div>

                <Row gutter={[32, 32]}>
                    <Col xs={24} md={8}>
                        <Card variant='borderless' className="h-full shadow-lg hover:-translate-y-2 transition-transform duration-300">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-6">
                                    <RocketOutlined />
                                </div>
                                <Title level={4}>Sứ mệnh</Title>
                                <Paragraph className="text-gray-500">
                                    Cung cấp các giải pháp công nghệ đột phá, giúp doanh nghiệp tối ưu vận hành và bứt phá doanh thu trong kỷ nguyên số.
                                </Paragraph>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} md={8}>
                        <Card variant='borderless' className="h-full shadow-lg hover:-translate-y-2 transition-transform duration-300">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6">
                                    <EyeOutlined />
                                </div>
                                <Title level={4}>Tầm nhìn</Title>
                                <Paragraph className="text-gray-500">
                                    Trở thành công ty công nghệ hàng đầu khu vực, là nơi quy tụ nhân tài và là biểu tượng của sự sáng tạo không ngừng nghỉ.
                                </Paragraph>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} md={8}>
                        <Card variant='borderless' className="h-full shadow-lg hover:-translate-y-2 transition-transform duration-300">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-3xl mb-6">
                                    <GlobalOutlined />
                                </div>
                                <Title level={4}>Giá trị cốt lõi</Title>
                                <Paragraph className="text-gray-500">
                                    <strong>Tận tâm - Sáng tạo - Hiệu quả.</strong> Chúng tôi đặt khách hàng làm trọng tâm và chất lượng sản phẩm là danh dự.
                                </Paragraph>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}