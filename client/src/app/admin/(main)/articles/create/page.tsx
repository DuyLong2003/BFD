'use client'

import { PageContainer } from '@ant-design/pro-components';
import ArticleForm from '@/components/modules/articles/ArticleForm';
import { useRouter } from 'next/navigation';
import { App } from 'antd';

export default function CreateArticlePage() {
    const router = useRouter();

    return (
        <App>
            <PageContainer title="Viết bài mới">
                <ArticleForm
                    onSuccess={() => router.push('/admin/articles')}
                />
            </PageContainer>
        </App>
    );
}