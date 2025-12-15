'use client';

import { Typography, Card, Tag, Empty, Flex } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Article } from '@/services/article.service';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function LatestNews({ articles }: { articles: Article[] }) {
    if (!articles || articles.length === 0) {
        return <Empty description="Chưa có bài viết nào" className="py-20" />;
    }

    return (
        <div className="mb-20">
            {/* Header Section */}
            <Flex justify="space-between" align="center" className="mb-8">
                <Title level={3} className="!m-0 relative pl-4 after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-6 after:bg-primary after:rounded-full">
                    Tin mới nhất
                </Title>
                <Link href="/news" className="text-primary font-medium hover:opacity-80 transition-opacity">
                    Xem tất cả &rarr;
                </Link>
            </Flex>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {articles.map((article: any) => (
                    <Link href={`/news/${article.slug}`} key={article._id} className="block group h-full">
                        <Card
                            hoverable
                            variant='borderless'
                            className="h-full overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 !rounded-xl bg-white"
                            styles={{ body: { padding: '20px' } }}
                            cover={
                                <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                                    {article.thumbnail ? (
                                        <Image
                                            src={article.thumbnail}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                                            No Image
                                        </div>
                                    )}
                                    {/* Overlay Category */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <Tag className="!border-0 !bg-white/90 !backdrop-blur-md !text-primary !font-semibold !rounded-lg !px-3 !py-1 shadow-sm">
                                            {article.category?.name || 'Tin tức'}
                                        </Tag>
                                    </div>
                                </div>
                            }
                        >
                            <div className="flex flex-col h-full justify-between">
                                <Title
                                    level={5}
                                    ellipsis={{ rows: 2 }}
                                    className="!text-lg !mb-3 !font-bold group-hover:!text-primary transition-colors min-h-[56px]"
                                >
                                    {article.title}
                                </Title>

                                <Text type="secondary" className="flex items-center gap-2 text-xs">
                                    <ClockCircleOutlined />
                                    {dayjs(article.createdAt).format('DD/MM/YYYY')}
                                </Text>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}