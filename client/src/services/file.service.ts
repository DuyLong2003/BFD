import axiosClient from "@/lib/axios";

export interface UploadResponse {
    url: string;
    fileName: string;
}

export const fileService = {
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post<any, UploadResponse>('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};