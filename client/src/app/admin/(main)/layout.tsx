'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { DashboardOutlined, FileTextOutlined, UserOutlined, LogoutOutlined, AppstoreOutlined } from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import { Dropdown, Switch, Spin } from 'antd';
import { authService } from '@/services/auth.service';
import { useTheme } from '@/providers/AntdConfigProvider';

// 1. Cấu hình Menu tập trung
const menuRoute = {
    routes: [
        { path: '/admin/dashboard', name: 'Tổng quan', icon: <DashboardOutlined /> },
        { path: '/admin/articles', name: 'Quản lý bài viết', icon: <FileTextOutlined /> },
        { path: '/admin/categories', name: 'Chuyên mục', icon: <AppstoreOutlined /> },
        { path: '/admin/users', name: 'Người dùng', icon: <UserOutlined /> },
    ],
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);
    const { isDarkMode, toggleTheme } = useTheme();

    // 2. Logic Auth & User Fetching
    useEffect(() => {
        const initUser = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) throw new Error('No token');

                const user = await authService.getProfile();
                setUserName(user.username);
            } catch {
                Cookies.remove('access_token');
                router.replace('/admin/login');
            }
        };
        initUser();
    }, [router]);

    const handleLogout = () => {
        Cookies.remove('access_token');
        router.push('/admin/login');
    };

    // 3. Render
    return (
        <ProLayout
            title="BFD News CMS"
            logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            layout="mix"
            splitMenus={false}
            fixSiderbar
            fixedHeader
            suppressHydrationWarning
            // Config Routes
            route={menuRoute}
            location={{ pathname }}
            // Navigation
            onMenuHeaderClick={() => router.push('/admin/dashboard')}
            menuItemRender={(item, dom) => (
                <Link href={item.path || '/admin/dashboard'} onClick={(e) => e.stopPropagation()}>
                    {dom}
                </Link>
            )}
            // Actions Header (Theme Switch)
            actionsRender={(props) => {
                if (props.isMobile) return [];
                return [
                    <div key="theme-switch" className="mr-4 flex items-center">
                        <Switch
                            checkedChildren={<span>🌙</span>}
                            unCheckedChildren={<span>☀️</span>}
                            checked={isDarkMode}
                            onChange={toggleTheme}
                        />
                    </div>
                ];
            }}
            // User Avatar & Dropdown
            avatarProps={{
                src: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
                size: 'small',
                title: userName || <Spin size="small" />,
                render: (_, dom) => (
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: 'logout',
                                    icon: <LogoutOutlined />,
                                    label: 'Đăng xuất',
                                    onClick: handleLogout,
                                    danger: true
                                }
                            ],
                        }}
                    >
                        <div className="cursor-pointer flex items-center gap-2 hover:bg-black/5 px-2 py-1 rounded transition-colors">
                            {dom}
                        </div>
                    </Dropdown>
                ),
            }}
        >
            {/* Main Content */}
            <div className="min-h-[calc(100vh-100px)]">
                {children}
            </div>
        </ProLayout>
    );
}