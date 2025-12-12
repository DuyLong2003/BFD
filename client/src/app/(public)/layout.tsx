'use client';

import { Layout } from 'antd';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

const { Content } = Layout;

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header dùng chung */}
            <PublicHeader />

            {/* Nội dung chính (Page con sẽ render vào đây) */}
            <Content style={{
                marginTop: 24, // Cách header một chút
                marginBottom: 24,
                flex: 1, // Đẩy Footer xuống đáy nếu nội dung ngắn
                width: '100%',
                maxWidth: 1200, // Giới hạn chiều rộng chuẩn website tin tức
                alignSelf: 'center',
                padding: '0 24px' // Padding trên mobile
            }}>
                {children}
            </Content>

            {/* Footer dùng chung */}
            <PublicFooter />
        </Layout>
    );
}