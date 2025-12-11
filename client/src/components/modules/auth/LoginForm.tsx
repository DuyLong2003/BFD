'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { App, Flex, Typography, theme } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { BaseButton } from '@/components/core/BaseButton';
import { BaseInput, BasePasswordInput } from '@/components/core/BaseInput';
import { authService } from '@/services/auth.service';
import { loginSchema, LoginSchema } from '@/lib/validations/auth.schema';

const { Title, Text } = Typography;

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
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <Flex vertical gap={24}>
                <Flex vertical gap={6}>
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
                            />
                        )}
                    />
                    {errors.username && <Text type="danger" style={{ fontSize: 12 }}>{errors.username.message}</Text>}
                </Flex>

                <Flex vertical gap={6}>
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
                            />
                        )}
                    />
                    {errors.password && <Text type="danger" style={{ fontSize: 12 }}>{errors.password.message}</Text>}
                </Flex>

                <BaseButton
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loginMutation.isPending}
                    block
                    style={{ marginTop: 8 }}
                >
                    Đăng nhập
                </BaseButton>
            </Flex>
        </form>
    );
};