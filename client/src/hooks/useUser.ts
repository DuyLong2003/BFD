import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import Cookies from 'js-cookie';

export const useUser = () => {
    const token = Cookies.get('access_token');

    return useQuery({
        queryKey: ['profile'], // Key định danh trong Cache
        queryFn: async () => {
            if (!token) return null; // Không có token thì khỏi gọi API
            try {
                const res = await authService.getProfile();
                return res; // Trả về object user
            } catch (error) {
                return null; // Lỗi token (hết hạn) -> coi như chưa login
            }
        },
        enabled: !!token, // Chỉ chạy khi có token
        retry: false,     // Không retry nếu lỗi 401
        staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút
    });
};