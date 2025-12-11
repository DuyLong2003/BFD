'use client';

import { Flex, Typography } from 'antd';
import { BaseInput } from '@/components/core/BaseInput';
import { LoginOutlined } from '@ant-design/icons';
import { BaseButton } from '@/components/core/BaseButton';

const { Title, Text } = Typography;

export default function Home() {
  return (
    <Flex
      justify="center"
      align="center"
      vertical
      gap={20}
      style={{ height: '100vh', background: '#fff' }}
    >
      <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
        Base News System
      </Title>
      <Text type="secondary">Test Component System</Text>

      <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <BaseInput placeholder="Nhập username..." />
        <BaseButton type="primary" icon={<LoginOutlined />}>
          Đăng nhập ngay
        </BaseButton>
      </div>
    </Flex>
  );
}