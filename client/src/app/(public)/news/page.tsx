import { articleService } from '@/services/article.service';
import { categoryService } from '@/services/category.service';
import NewsList from '@/components/modules/articles/NewsList';

export const metadata = {
    title: 'Tin tức - BFD Company',
    description: 'Cập nhật tin tức mới nhất từ BFD',
};

export default async function NewsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const page = Number(searchParams.page) || 1;
    const limit = 8;
    const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
    const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;

    const [articlesData, categoriesData] = await Promise.all([
        articleService.getPublicArticles({ page, limit, q, category }),
        categoryService.getCategories(),
    ]);

    const articles = articlesData.data || [];
    const total = articlesData.total || 0;
    const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData as any).data || [];

    return (
        <NewsList
            articles={articles}
            categories={categories}
            total={total}
            currentPage={page}
            q={q}
            category={category}
        />
    );
}