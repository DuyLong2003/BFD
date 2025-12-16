import axiosClient from "@/lib/axios";

export interface UploadResponse {
    url: string;
    fileName: string;
}

export const fileService = {
    upload: async (file: File): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        // axiosClient tự động attach token từ cookie
        return axiosClient.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};