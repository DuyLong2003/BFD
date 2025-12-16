import { articleService } from '@/services/article.service';
import { notFound } from 'next/navigation';
import ArticleDetail from '@/components/modules/articles/ArticleDetail';

export const revalidate = 3600;

export async function generateStaticParams() {
    const articles = await articleService.getPublicArticles({ limit: 100 });
    return articles.data.map((post) => ({ slug: post.slug }));
}

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

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
    // Fetch song song cả bài viết chính và bài liên quan
    const [article, relatedArticles] = await Promise.all([
        articleService.getArticleBySlug(params.slug).catch(() => null),
        articleService.getRelatedArticles(params.slug).catch(() => []),
    ]);

    if (!article) notFound();

    return (
        <div className="bg-gray-50 py-12 min-h-screen">
            <div className="container mx-auto px-4">
                <ArticleDetail
                    article={article}
                    relatedArticles={relatedArticles} // Truyền data xuống
                />
            </div>
        </div>
    );
}