'use client'; // 👈 Quan trọng: Đánh dấu file này chạy ở Client

import { Card, Col, Row, Input, Tag, Typography, Empty, Button } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Article } from '@/services/article.service';
import { Category } from '@/services/category.service';
import { useRouter, useSearchParams } from 'next/navigation';

const { Title, Text } = Typography;

interface NewsListProps {
    articles: Article[];
    categories: Category[];
    total: number;
    currentPage: number;
    q?: string;
    category?: string;
}

export default function NewsList({ articles, categories, total, currentPage, q, category }: NewsListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Hàm xử lý search (Client Side)
    const onSearch = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('q', value);
        } else {
            params.delete('q');
        }
        params.set('page', '1'); // Reset về trang 1 khi search
        router.push(`/news?${params.toString()}`);
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Row gutter={[32, 32]}>
                {/* LEFT COLUMN: DANH SÁCH BÀI VIẾT */}
                <Col xs={24} lg={17}>
                    <div className="mb-8">
                        <Title level={2}>
                            {q ? `Kết quả tìm kiếm: "${q}"` : (category ? 'Chuyên mục tin tức' : 'Tin tức mới nhất')}
                        </Title>
                        <div className="w-16 h-1 bg-primary rounded-full"></div>
                    </div>

                    {articles.length === 0 ? (
                        <Empty description="Không tìm thấy bài viết nào" />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {articles.map((item: any) => (
                                <Link href={`/news/${item.slug}`} key={item._id} className="group">
                                    <Card
                                        hoverable
                                        className="h-full overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all"
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
                                            <Tag color="blue" className="w-fit mb-2">{item.category?.name}</Tag>
                                            <Title level={5} className="!mb-2 group-hover:!text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </Title>
                                            <Text type="secondary" className="text-xs mb-3 block">
                                                {dayjs(item.createdAt).format('DD/MM/YYYY')} - Tác giả: {item.author?.username || 'Admin'}
                                            </Text>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {total > 9 && (
                        <div className="mt-10 flex justify-center gap-2">
                            <Button
                                disabled={currentPage <= 1}
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('page', (currentPage - 1).toString());
                                    router.push(`/news?${params.toString()}`);
                                }}
                            >
                                Trang trước
                            </Button>
                            <Button type="primary">{currentPage}</Button>
                            <Button
                                disabled={currentPage * 9 >= total}
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('page', (currentPage + 1).toString());
                                    router.push(`/news?${params.toString()}`);
                                }}
                            >
                                Trang sau
                            </Button>
                        </div>
                    )}
                </Col>

                {/* RIGHT COLUMN: SIDEBAR */}
                <Col xs={24} lg={7}>
                    <div className="sticky top-24 space-y-8">
                        {/* Search */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <Title level={5} className="mb-4">Tìm kiếm</Title>
                            <Input.Search
                                placeholder="Nhập từ khóa..."
                                onSearch={onSearch}
                                enterButton
                                defaultValue={q}
                                allowClear
                            />
                        </div>

                        {/* Categories */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <Title level={5} className="mb-4">Chuyên mục</Title>
                            <div className="flex flex-col gap-2">
                                <Link href="/news">
                                    <div className={`p-2 rounded hover:bg-gray-50 cursor-pointer ${!category ? 'font-bold text-primary bg-blue-50' : ''}`}>
                                        Tất cả tin tức
                                    </div>
                                </Link>
                                {categories.map((cat: any) => (
                                    <Link href={`/news?category=${cat._id}`} key={cat._id}>
                                        <div className={`p-2 rounded hover:bg-gray-50 cursor-pointer ${category === cat._id ? 'font-bold text-primary bg-blue-50' : ''}`}>
                                            {cat.name}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}