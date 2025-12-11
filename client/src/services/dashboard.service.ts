import axiosClient from "@/lib/axios";

// Định nghĩa kiểu dữ liệu trả về
interface DashboardStats {
    totalUsers: number;
    totalArticles: number;
    totalCategories: number;
}

export const dashboardService = {
    getStats: async () => {
        return axiosClient.get<any, DashboardStats>('/dashboard/stats');
    }
};