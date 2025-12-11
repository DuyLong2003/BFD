'use client';

import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Statistic, message, App } from 'antd';
import { FileTextOutlined, UserOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { dashboardService } from '@/services/dashboard.service';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface DashboardStats {
    totalUsers: number;
    totalArticles: number;
    totalCategories: number;
}

export default function DashboardPage() {
    const queryClient = useQueryClient();

    const { message } = App.useApp();

    const { data: stats, isLoading } = useQuery<DashboardStats>({
        queryKey: ['dashboard-stats'],
        queryFn: dashboardService.getStats,
    });

    useEffect(() => {
        const socket = io(SOCKET_URL);

        const handleUpdate = (msg: string) => {
            message.info(msg);
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        };

        socket.on('events.article.created', (data) => handleUpdate(`Bài viết mới: "${data.title}"`));
        socket.on('events.article.deleted', () => handleUpdate('Một bài viết vừa bị xóa'));

        socket.on('events.user.created', (data) => handleUpdate(`User mới đăng ký: ${data.username}`));
        socket.on('events.user.deleted', () => handleUpdate('Một user vừa bị xóa'));

        socket.on('events.category.created', (data) => handleUpdate(`Chuyên mục mới: ${data.name}`));
        socket.on('events.category.deleted', () => handleUpdate('Một chuyên mục vừa bị xóa'));

        return () => {
            socket.disconnect();
        };
    }, [queryClient]);

    return (
        <PageContainer title="Tổng quan hệ thống">
            <Row gutter={16}>
                <Col span={8}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Tổng bài viết"
                            value={stats?.totalArticles || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Người dùng"
                            value={stats?.totalUsers || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Chuyên mục"
                            value={stats?.totalCategories || 0}
                            prefix={<AppstoreOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
                <Card title="Trạng thái hệ thống">
                </Card>
            </div>
        </PageContainer>
    );
}