import { Metadata } from 'next';
import AboutContent from '@/components/modules/about/AboutContent';

export const metadata: Metadata = {
    title: 'Về chúng tôi - BFD Company',
    description: 'Tìm hiểu về lịch sử, sứ mệnh và giá trị cốt lõi của BFD Technology.',
};

export default function AboutPage() {
    return <AboutContent />;
}