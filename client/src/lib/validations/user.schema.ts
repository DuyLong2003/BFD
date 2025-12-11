import { z } from 'zod';

export const createUserSchema = z.object({
    username: z
        .string({ required_error: 'Vui lòng nhập tên hiển thị' })
        .min(1, 'Tên hiển thị không được để trống'),

    email: z
        .string({ required_error: 'Vui lòng nhập email' })
        .min(1, 'Email không được để trống')
        .email('Email không đúng định dạng'),

    password: z
        .string({ required_error: 'Vui lòng nhập mật khẩu' })
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),

    role: z.string({ required_error: 'Vui lòng chọn phân quyền' }),
});

// Schema cho update (Password optional)
export const updateUserSchema = createUserSchema.extend({
    password: z.string().optional(),
});