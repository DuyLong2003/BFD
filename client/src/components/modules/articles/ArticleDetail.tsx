'use client';

import { Typography, Breadcrumb, Divider, Tag, Card } from 'antd'; // Bỏ Image khỏi đây
import { HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image'; // Import Image từ next/image
import dayjs from 'dayjs';
import DOMPurify from 'isomorphic-dompurify';
import { Article } from '@/services/article.service';

const { Title, Text } = Typography;

interface ArticleDetailProps {
    article: Article;
    relatedArticles?: Article[];
}

export default function ArticleDetail({ article, relatedArticles = [] }: ArticleDetailProps) {
    const cleanContent = DOMPurify.sanitize(article.content);

    return (
        <div className="max-w-4xl mx-auto">
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

                {/* Footer Article */}
                <Divider className="my-10" />
                <div className="flex justify-between items-center">
                    <Link href="/news" className="text-primary font-medium hover:underline">
                        &larr; Quay lại danh sách tin
                    </Link>
                </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <div className="mt-12">
                    <Title level={3} className="!mb-6 border-l-4 border-blue-600 pl-4">
                        Tin liên quan
                    </Title>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedArticles.map((item) => (
                            <Link href={`/news/${item.slug}`} key={item._id} className="group">
                                <Card
                                    hoverable
                                    className="h-full overflow-hidden border-0 shadow-sm hover:shadow-md transition-all rounded-xl"
                                    styles={{ body: { padding: '16px' } }}
                                    cover={
                                        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                                            {item.thumbnail ? (
                                                <Image
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400 font-medium">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    }
                                >
                                    <div className="flex flex-col h-full">
                                        <Text type="secondary" className="text-xs mb-2 block">
                                            {dayjs(item.createdAt).format('DD/MM/YYYY')}
                                        </Text>
                                        <Title level={5} className="!mb-0 !text-base group-hover:!text-blue-600 transition-colors line-clamp-2">
                                            {item.title}
                                        </Title>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}