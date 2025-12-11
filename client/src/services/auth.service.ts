import axiosClient from "@/lib/axios";
import { LoginSchema } from "@/lib/validations/auth.schema";
import axios from "axios";

export interface UserProfile {
    userId: string;
    username: string;
    role: string;
}

export interface LoginResponse {
    access_token: string;
}

export const authService = {
    login: (data: LoginSchema) => {
        return axiosClient.post('/auth/login', data) as Promise<LoginResponse>;
    },

    getProfile: (): Promise<UserProfile> => {
        return axiosClient.get('/auth/profile');
    }
};

