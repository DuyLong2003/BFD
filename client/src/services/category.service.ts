import axiosClient from "@/lib/axios";

export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    createdAt: string;
}

export interface CreateCategoryDto {
    name: string;
    slug?: string;
    description?: string;
}

export interface CategoryResponse {
    data: Category[];
    total: number;
}

export const categoryService = {
    // Hàm lấy danh sách (Hỗ trợ cả phân trang cho Table và lấy hết cho Select)
    getCategories: (params?: { page?: number; limit?: number; q?: string; sort?: string }) => {
        // Nếu không truyền params, mặc định lấy tất cả (cho dropdown chọn category ở bài viết)
        return axiosClient.get<any, any>('/categories', { params });
    },

    createCategory: (data: CreateCategoryDto) => {
        return axiosClient.post('/categories', data);
    },

    updateCategory: (id: string, data: CreateCategoryDto) => {
        return axiosClient.patch(`/categories/${id}`, data);
    },

    deleteCategory: (id: string) => {
        return axiosClient.delete(`/categories/${id}`);
    }
};