'use client';

import { Card, Typography } from 'antd';
import { LoginForm } from '@/components/modules/auth/LoginForm';

const { Title, Text } = Typography;

export default function LoginPage() {
    return (
        <div className="h-screen w-screen bg-gray-100 flex justify-center items-center relative overflow-hidden">
            {/* Background pattern (chấm bi mờ) */}
            <div className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <Card
                variant='borderless'
                className="w-[400px] max-w-[90%] shadow-xl rounded-2xl overflow-hidden relative z-10"
                styles={{ body: { padding: '48px 40px' } }}
            >
                {/* Header logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center mb-4 shadow-md">
                        <span className="text-white font-bold text-2xl">B</span>
                    </div>

                    <Title level={3} className="!mb-2 !text-gray-800 text-center">
                        Đăng nhập hệ thống
                    </Title>
                    <Text type="secondary" className="text-center">
                        Nhập thông tin quản trị viên BFD để tiếp tục
                    </Text>
                </div>

                {/* Form */}
                <LoginForm />

                {/* Footer */}
                <div className="mt-8 text-center">
                    <Text type="secondary" className="text-xs block">
                        © 2025 BFD Technology. All rights reserved.
                    </Text>
                </div>
            </Card>
        </div>
    );
}