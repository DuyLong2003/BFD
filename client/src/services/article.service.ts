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
}

export interface CreateArticleDto {
    title: string;
    slug: string;
    content: string;
    category: string;
    thumbnail?: string;
    status: string;
}

// Cập nhật response có chứa total
export interface ArticleResponse {
    data: Article[];
    total: number;
}

export const articleService = {
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
        return axiosClient.get<any, ArticleResponse>('/articles', { params });
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

    getPublicArticles: (params?: { page?: number; limit?: number; category?: string }) => {
        return axiosClient.get<any, { data: Article[], total: number }>('/articles', { params });
    },
};