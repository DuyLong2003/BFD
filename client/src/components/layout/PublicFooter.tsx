'use client';

import { Typography } from 'antd';
import Link from 'next/link';
import { FacebookFilled, TwitterSquareFilled, LinkedinFilled } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function PublicFooter() {
    return (
        <footer className="bg-[#001529] text-white py-12 px-6">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cột 1: thông tin công ty */}
                    <div>
                        <Title level={4} className="!text-white !m-0">BFD NEWS</Title>
                        <Text className="!text-white/65 block mt-4">
                            Hệ thống tin tức cập nhật công nghệ nhanh nhất, chính xác nhất. Đồng hành cùng sự phát triển của bạn.
                        </Text>
                    </div>

                    {/* Cột 2: liên kết nhanh */}
                    <div>
                        <Title level={5} className="!text-white">Liên kết</Title>
                        <div className="flex flex-col gap-2 mt-2">
                            <Link href="/" className="text-white/65 hover:text-white transition-colors">Trang chủ</Link>
                            <Link href="/news" className="text-white/65 hover:text-white transition-colors">Tin tức</Link>
                            <Link href="/about" className="text-white/65 hover:text-white transition-colors">Về chúng tôi</Link>
                        </div>
                    </div>

                    {/* Cột 3: liên hệ */}
                    <div>
                        <Title level={5} className="!text-white">Liên hệ</Title>
                        <div className="flex flex-col gap-2 mt-2">
                            <Text className="!text-white/65">Email: contact@bfd-news.com</Text>
                            <Text className="!text-white/65">Hotline: 0987 654 321</Text>
                        </div>
                        <div className="flex gap-4 mt-4 text-2xl">
                            <FacebookFilled className="text-white hover:text-blue-500 cursor-pointer transition-colors" />
                            <TwitterSquareFilled className="text-white hover:text-blue-400 cursor-pointer transition-colors" />
                            <LinkedinFilled className="text-white hover:text-blue-700 cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 mt-8 pt-4 text-center">
                    <Text className="!text-white/45 text-sm">
                        © 2025 BFD News. All rights reserved.
                    </Text>
                </div>
            </div>
        </footer>
    );
}