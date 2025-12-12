'use client';

import { Typography, Row, Col, Card, Tag, Skeleton, Empty, Flex } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { articleService } from '@/services/article.service';
import Link from 'next/link';
import Image from 'next/image';

const { Title, Text } = Typography;

export default function LatestNews() {
    const { data, isLoading } = useQuery({
        queryKey: ['public-articles', 'latest'],
        queryFn: () => articleService.getPublicArticles({ page: 1, limit: 6 }),
    });

    const articles = data?.data || [];

    if (isLoading) {
        return (
            <div style={{ padding: '20px 0' }}>
                <Skeleton active paragraph={{ rows: 4 }} />
            </div>
        );
    }

    if (articles.length === 0) {
        return <Empty description="Chưa có bài viết nào" />;
    }

    return (
        <div style={{ marginBottom: 40 }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>
                    Tin mới nhất
                </Title>
                <Link href="/news" style={{ color: '#0052CC', fontWeight: 500 }}>
                    Xem tất cả &rarr;
                </Link>
            </Flex>

            <Row gutter={[24, 24]}>
                {articles.map((article: any) => (
                    <Col xs={24} sm={12} md={8} key={article._id}>
                        <Link href={`/news/${article.slug}`} style={{ textDecoration: 'none' }}>
                            <Card
                                hoverable
                                cover={
                                    <div
                                        style={{
                                            position: 'relative',
                                            height: 200,
                                            overflow: 'hidden',
                                            backgroundColor: '#f0f0f0',
                                        }}
                                    >
                                        {article.thumbnail ? (
                                            <Image
                                                src={article.thumbnail}
                                                alt={article.title || 'Article thumbnail'}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                style={{
                                                    objectFit: 'cover',
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: '#e0e0e0',
                                                    color: '#999',
                                                }}
                                            >
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                }
                                style={{ height: '100%' }}
                                styles={{ body: { padding: '20px' } }}
                            >
                                <div style={{ marginBottom: 10 }}>
                                    <Tag color="blue">{article.category?.name || 'Tin tức'}</Tag>
                                </div>
                                <Title
                                    level={5}
                                    ellipsis={{ rows: 2 }}
                                    style={{ marginBottom: 8, height: 48 }}
                                >
                                    {article.title}
                                </Title>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                                    {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                                </Text>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
}