'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { App, theme } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { BaseButton } from '@/components/core/BaseButton';
import { BaseInput, BasePasswordInput } from '@/components/core/BaseInput';
import { authService } from '@/services/auth.service';
import { loginSchema, LoginSchema } from '@/lib/validations/auth.schema';

export const LoginForm = () => {
    const router = useRouter();
    const { message } = App.useApp();
    const { token } = theme.useToken();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            message.success('Đăng nhập thành công!');
            Cookies.set('access_token', data.access_token, { expires: 1 });
            router.push('/admin/dashboard');
        },
        onError: (error: any) => {
            const errorMsg = error?.response?.data?.message || 'Đăng nhập thất bại';
            message.error(errorMsg);
        },
    });

    const onSubmit = (data: LoginSchema) => {
        loginMutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col gap-6">
                {/* Username Field */}
                <div className="flex flex-col gap-1.5">
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <BaseInput
                                {...field}
                                size="large"
                                placeholder="Tài khoản quản trị"
                                prefix={<UserOutlined style={{ color: token.colorTextDescription }} />}
                                status={errors.username ? 'error' : ''}
                                className="!py-2.5" // Tùy chỉnh padding nếu cần
                            />
                        )}
                    />
                    {errors.username && (
                        <span className="text-red-500 text-xs pl-1">
                            {errors.username.message}
                        </span>
                    )}
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1.5">
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <BasePasswordInput
                                {...field}
                                size="large"
                                placeholder="Mật khẩu"
                                prefix={<LockOutlined style={{ color: token.colorTextDescription }} />}
                                status={errors.password ? 'error' : ''}
                                className="!py-2.5"
                            />
                        )}
                    />
                    {errors.password && (
                        <span className="text-red-500 text-xs pl-1">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                {/* Submit Button */}
                <BaseButton
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loginMutation.isPending}
                    block
                    className="mt-2 h-11 bg-blue-600 hover:!bg-blue-700 font-semibold shadow-md transition-all"
                >
                    Đăng nhập
                </BaseButton>
            </div>
        </form>
    );
};