'use client';

import { PageContainer } from '@ant-design/pro-components';
import ArticleForm from '@/components/modules/articles/ArticleForm';
import { useEffect, useState } from 'react';
import { articleService, Article } from '@/services/article.service';
import { Spin, App } from 'antd';
import { useRouter } from 'next/navigation';

export default function EditArticlePage({ params }: { params: { id: string } }) {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await articleService.getArticle(params.id);
                setArticle(data);
            } catch (error) {
                console.error('Lỗi tải bài viết', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [params.id]);

    if (loading)
        return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;

    return (
        <App>
            <PageContainer title={`Chỉnh sửa: ${article?.title}`}>
                {article && (
                    <ArticleForm
                        initialValues={article}
                        articleId={params.id}
                        onSuccess={() => useRouter().push('/admin/articles')}
                    />
                )}
            </PageContainer>
        </App>
    );
}
