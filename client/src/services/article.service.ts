import axiosClient from "@/lib/axios";

export interface Article {
    _id: string;
    title: string;
    slug: string;
    content: string;
    thumbnail?: string;
    category?: { _id: string; name: string; slug: string };
    status?: string;
    createdAt: string;
    updatedAt: string;
    author?: { _id: string; username: string };
}

export interface CreateArticleDto {
    title: string;
    slug: string;
    content: string;
    category: string;
    thumbnail?: string;
    status: string;
}

export interface ArticleResponse {
    data: Article[];
    total: number;
}

export const articleService = {
    // ✅ Admin: Gọi với noCache=true
    getArticles: async (params: {
        page?: number;
        limit?: number;
        q?: string;
        category?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
        sort?: string;
    }) => {
        return axiosClient.get<any, ArticleResponse>('/articles', {
            params: {
                ...params,
                noCache: 'true', // ✅ Skip cache cho admin
            }
        });
    },

    deleteArticle: (id: string) => {
        return axiosClient.delete(`/articles/${id}`);
    },

    getArticle: (id: string) => {
        return axiosClient.get<any, Article>(`/articles/${id}`);
    },

    createArticle: (data: CreateArticleDto) => {
        return axiosClient.post('/articles', data);
    },

    updateArticle: (id: string, data: Partial<CreateArticleDto>) => {
        return axiosClient.patch(`/articles/${id}`, data);
    },

    // ✅ Public: KHÔNG skip cache
    getPublicArticles: (params?: {
        page?: number;
        limit?: number;
        category?: string;
        q?: string
    }) => {
        return axiosClient.get<any, ArticleResponse>('/articles', {
            params: {
                ...params,
                status: 'Published',
                // ✅ Không thêm noCache → Sẽ dùng cache
            }
        });
    },

    getArticleBySlug: (slug: string) => {
        return axiosClient.get<any, Article>(`/articles/public/${slug}`);
    }
};