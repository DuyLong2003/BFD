'use client';

import { Flex, Card, Typography } from 'antd';
import { LoginForm } from '@/components/modules/auth/LoginForm';

const { Title, Text } = Typography;

export default function LoginPage() {
    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                background: '#F4F5F7', // Nền xám
                backgroundImage: 'radial-gradient(#E3E5E8 1px, transparent 1px)', // Họa tiết chấm bi cực mờ
                backgroundSize: '24px 24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Card
                variant="borderless"
                style={{
                    width: 400,
                    maxWidth: '90%',
                    boxShadow: '0 12px 24px -6px rgba(0, 0, 0, 0.08)', // Bóng đổ mềm
                    overflow: 'hidden',
                }}
                styles={{ body: { padding: '48px 40px' } }}
            >
                <Flex vertical align="center" style={{ marginBottom: 32 }}>
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            background: 'linear-gradient(135deg, #0052CC 0%, #2684FF 100%)',
                            borderRadius: 12,
                            marginBottom: 16,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 24
                        }}
                    >
                        B
                    </div>

                    <Title level={3} style={{ margin: '0 0 8px', color: '#172B4D' }}>
                        Đăng nhập hệ thống
                    </Title>
                    <Text type="secondary">
                        Nhập thông tin quản trị viên BFD để tiếp tục
                    </Text>
                </Flex>

                <LoginForm />

                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        © 2025 BFD Technology. All rights reserved.
                    </Text>
                </div>
            </Card>
        </div>
    );
}