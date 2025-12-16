import axiosClient from "@/lib/axios";

export interface ContactDto {
    name: string;
    email: string;
    message: string;
}

export const contactService = {
    createContact: async (data: ContactDto) => {
        return axiosClient.post('/contacts', data);
    }
};