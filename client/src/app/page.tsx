'use client';

import PublicLayout from '@/app/(public)/layout';
import Banner from '@/components/modules/home/Banner';
import Introduction from '@/components/modules/home/Introduction';
import CoreValues from '@/components/modules/home/CoreValues';
import LatestNews from '@/components/modules/home/LatestNews';
import { Button, Flex, Typography } from 'antd';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <PublicLayout>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        <section id="hero" style={{ scrollMarginTop: 100 }}>
          <Banner />
        </section>

        <section id="about" style={{ scrollMarginTop: 100 }}>
          <Introduction />
          <CoreValues />
        </section>

        <section id="news" style={{ scrollMarginTop: 100 }}>
          <LatestNews />
        </section>

        {/* 4. Liên hệ (Contact/CTA) */}
        <section id="contact" style={{ scrollMarginTop: 100 }}>
          <div style={{
            marginTop: 80,
            padding: '60px 24px',
            background: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80) center/cover no-repeat',
            borderRadius: 16,
            textAlign: 'center',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)' }}></div>

            <Flex vertical align="center" gap={16} style={{ position: 'relative', zIndex: 1 }}>
              <Title level={2} style={{ color: '#fff', margin: 0 }}>Sẵn sàng hợp tác cùng BFD?</Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, maxWidth: 600 }}>
                Liên hệ ngay với chúng tôi để nhận tư vấn giải pháp công nghệ phù hợp nhất cho doanh nghiệp của bạn.
              </Paragraph>
              <Button type="primary" size="large" style={{ height: 48, padding: '0 40px', fontSize: 16 }}>
                Gửi yêu cầu tư vấn
              </Button>
            </Flex>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}