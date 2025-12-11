import axiosClient from "@/lib/axios";

export interface User {
    _id: string;
    email: string;
    username: string;
    role: 'admin' | 'user';
    createdAt: string;
    isActive: boolean;
}

export interface UserResponse {
    data: User[];
    total: number;
}

export const userService = {
    getUsers: (params?: { page?: number; limit?: number; q?: string; sort?: string }) => {
        return axiosClient.get<any, UserResponse>('/users', { params });
    },

    createUser: (data: any) => {
        return axiosClient.post('/users', data);
    },

    updateUser: (id: string, data: any) => {
        return axiosClient.patch(`/users/${id}`, data);
    },

    deleteUser: (id: string) => {
        return axiosClient.delete(`/users/${id}`);
    }
};