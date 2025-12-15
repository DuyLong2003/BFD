import { articleService } from '@/services/article.service';
import { notFound } from 'next/navigation';
import ArticleDetail from '@/components/modules/articles/ArticleDetail';

// 1. Hàm tạo Metadata cho SEO (Server Side)
export async function generateMetadata({ params }: { params: { slug: string } }) {
    try {
        const article = await articleService.getArticleBySlug(params.slug);
        if (!article) return { title: 'Không tìm thấy bài viết' };
        return {
            title: article.title,
            description: `Chi tiết bài viết ${article.title}`,
        };
    } catch (e) {
        return { title: 'Lỗi bài viết' };
    }
}

// 2. Component Chính (Server Side)
export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
    let article;
    try {
        article = await articleService.getArticleBySlug(params.slug);
    } catch (error) {
        notFound();
    }

    if (!article) notFound();

    return (
        <div className="bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <ArticleDetail article={article} />
            </div>
        </div>
    );
}