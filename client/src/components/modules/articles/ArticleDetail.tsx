'use client'; // 👈 Quan trọng: Đánh dấu file này chạy ở Client

import { Typography, Breadcrumb, Divider, Tag } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import dayjs from 'dayjs';
import DOMPurify from 'isomorphic-dompurify';
import { Article } from '@/services/article.service';

const { Title, Text } = Typography;

export default function ArticleDetail({ article }: { article: Article }) {
    // Sanitize ở client cũng được, hoặc truyền từ server sang đều ổn
    const cleanContent = DOMPurify.sanitize(article.content);

    return (
        <article className="bg-white p-8 md:p-12 rounded-2xl shadow-sm">
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { title: <Link href="/"><HomeOutlined /></Link> },
                    { title: <Link href="/news">Tin tức</Link> },
                    { title: article.category?.name || 'Chi tiết' },
                ]}
                className="mb-6"
            />

            {/* Header */}
            <div className="mb-8">
                <Tag color="blue" className="mb-4">{article.category?.name}</Tag>
                <Title level={1} className="!mb-4 !text-3xl md:!text-4xl">
                    {article.title}
                </Title>

                <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <Text type="secondary">Đăng bởi: <span className="font-medium text-gray-700">{article.author?.username || 'Ban biên tập'}</span></Text>
                    <Divider type="vertical" />
                    <Text type="secondary">{dayjs(article.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                </div>
            </div>

            {/* Content */}
            <div
                className="prose prose-lg max-w-none prose-img:rounded-xl prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: cleanContent }}
            />

            {/* Footer */}
            <Divider className="my-10" />
            <div className="flex justify-between items-center">
                <Link href="/news" className="text-primary font-medium hover:underline">
                    &larr; Quay lại danh sách tin
                </Link>
            </div>
        </article>
    );
}