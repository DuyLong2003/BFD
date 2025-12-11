'use client';

import { ProLayout } from '@ant-design/pro-components';
import {
    DashboardOutlined, FileTextOutlined, UserOutlined,
    LogoutOutlined, AppstoreOutlined
} from '@ant-design/icons';
import { Dropdown, Switch, Spin } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { useTheme } from '@/providers/AntdConfigProvider';

const SunIcon = () => <span>☀️</span>;
const MoonIcon = () => <span>🌙</span>;

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await authService.getProfile();
                setUserName(user.username);
            } catch (error) {
                Cookies.remove('access_token');
                router.push('/admin/login');
            }
        };
        fetchUser();
    }, [router]);

    const handleLogout = () => {
        Cookies.remove('access_token');
        router.push('/admin/login');
    };

    return (
        <ProLayout
            title="BFD News CMS"
            logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            layout="mix"
            splitMenus={false}
            fixSiderbar
            fixedHeader
            suppressHydrationWarning
            onMenuHeaderClick={() => router.push('/admin/dashboard')}
            route={{
                routes: [
                    { path: '/admin/dashboard', name: 'Tổng quan', icon: <DashboardOutlined /> },
                    { path: '/admin/articles', name: 'Quản lý bài viết', icon: <FileTextOutlined /> },
                    { path: '/admin/categories', name: 'Chuyên mục', icon: <AppstoreOutlined /> },
                    { path: '/admin/users', name: 'Người dùng', icon: <UserOutlined /> },
                ],
            }}
            location={{ pathname }}
            menuItemRender={(item, dom) => <Link href={item.path || '/admin/dashboard'}>{dom}</Link>}
            actionsRender={(props) => {
                if (props.isMobile) return [];
                return [
                    <Switch
                        key="theme-switch"
                        checkedChildren={<MoonIcon />}
                        unCheckedChildren={<SunIcon />}
                        checked={isDarkMode}
                        onChange={toggleTheme}
                        style={{ marginRight: 16 }}
                    />
                ];
            }}
            avatarProps={{
                src: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
                size: 'small',
                title: userName || <Spin size="small" />,
                render: (props, dom) => (
                    <Dropdown
                        menu={{
                            items: [{ key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', onClick: handleLogout }],
                        }}
                    >
                        {dom}
                    </Dropdown>
                ),
            }}
        >
            {children}
        </ProLayout>
    );
}