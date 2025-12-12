'use client';

import { Layout, Menu, Button, Drawer, Dropdown, Avatar, Space, theme } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined, DashboardOutlined, RocketTwoTone } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import Cookies from 'js-cookie';
import { useQueryClient } from '@tanstack/react-query';

const { Header } = Layout;

export default function PublicHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();

    const { token: { colorPrimary } } = theme.useToken();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { data: user, isLoading } = useUser();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { key: 'hero', label: 'Trang chủ' },
        { key: 'news', label: 'Tin tức' },
        { key: 'about', label: 'Giới thiệu' },
        { key: 'contact', label: 'Liên hệ' },
    ];

    const handleMenuClick = (key: string) => {
        setMobileOpen(false);

        if (pathname === '/') {
            const element = document.getElementById(key);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        else {
            router.push(`/#${key}`);
        }
    };

    const handleLogout = () => {
        Cookies.remove('access_token');
        queryClient.setQueryData(['profile'], null);
        router.push('/admin/login');
    };

    const userMenu = {
        items: [
            {
                key: 'admin',
                label: 'Trang quản trị',
                icon: <DashboardOutlined />,
                onClick: () => router.push('/admin/dashboard'),
                disabled: user?.role !== 'admin'
            },
            { type: 'divider' as const },
            {
                key: 'logout',
                label: 'Đăng xuất',
                icon: <LogoutOutlined />,
                danger: true,
                onClick: handleLogout
            },
        ]
    };

    return (
        <>
            <Header
                style={{
                    position: 'fixed',
                    top: 0,
                    zIndex: 1000,
                    width: '100%',
                    padding: 0,
                    transition: 'all 0.3s ease',
                    background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
                    borderBottom: scrolled ? 'none' : '1px solid rgba(0,0,0,0.03)'
                }}
            >
                <div style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%'
                }}>
                    {/* LOGO */}
                    <div
                        style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: colorPrimary,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            letterSpacing: '-0.5px'
                        }}
                        onClick={() => handleMenuClick('hero')}
                    >
                        <RocketTwoTone twoToneColor={colorPrimary} style={{ fontSize: 28 }} />
                        BFD NEWS
                    </div>

                    {/* DESKTOP MENU */}
                    {!isMobile && (
                        <Menu
                            mode="horizontal"
                            selectedKeys={[]}
                            items={menuItems.map(item => ({
                                key: item.key,
                                label: item.label,
                                onClick: () => handleMenuClick(item.key)
                            }))}
                            style={{
                                flex: 1,
                                borderBottom: 'none',
                                background: 'transparent',
                                justifyContent: 'center',
                                fontWeight: 600,
                                fontSize: 15
                            }}
                        />
                    )}

                    {/* RIGHT ACTION */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {!isLoading && user ? (
                            <Dropdown menu={userMenu} placement="bottomRight" arrow>
                                <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 20, background: scrolled ? '#f5f5f5' : 'transparent' }}>
                                    <Avatar
                                        style={{ backgroundColor: colorPrimary, verticalAlign: 'middle' }}
                                        icon={<UserOutlined />}
                                        size="small"
                                    />
                                    {!isMobile && (
                                        <span style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>
                                            {user.username}
                                        </span>
                                    )}
                                </Space>
                            </Dropdown>
                        ) : (
                            <Button
                                type="primary"
                                shape="round"
                                onClick={() => router.push('/admin/login')}
                                size={isMobile ? 'middle' : 'large'}
                                style={{ fontWeight: 600, padding: '0 24px' }}
                            >
                                Đăng nhập
                            </Button>
                        )}

                        {isMobile && (
                            <Button
                                icon={<MenuOutlined />}
                                type="text"
                                size="large"
                                onClick={() => setMobileOpen(true)}
                            />
                        )}
                    </div>
                </div>
            </Header>

            <Drawer
                title={<span style={{ fontWeight: 'bold', color: colorPrimary }}>MENU</span>}
                placement="right"
                onClose={() => setMobileOpen(false)}
                open={mobileOpen}
                width={280}
            >
                <Menu
                    mode="vertical"
                    selectedKeys={[]}
                    items={menuItems.map(item => ({
                        key: item.key,
                        label: item.label,
                        onClick: () => handleMenuClick(item.key)
                    }))}
                    style={{ borderRight: 'none', fontSize: 16 }}
                />
            </Drawer>
        </>
    );
}