'use client';

import { Menu, Button, Drawer, Dropdown, Avatar, theme } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined, DashboardOutlined, RocketTwoTone } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import Cookies from 'js-cookie';
import { useQueryClient } from '@tanstack/react-query';

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
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
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
            <header
                className={`fixed top-0 z-[1000] w-full transition-all duration-300 ${scrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-sm'
                        : 'bg-white/60 backdrop-blur-md border-b border-transparent'
                    }`}
            >
                <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
                    {/* LOGO */}
                    <div
                        className="text-[22px] font-extrabold cursor-pointer flex items-center gap-2 tracking-tighter"
                        style={{ color: colorPrimary }}
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
                            className="flex-1 justify-center border-b-0 bg-transparent font-semibold text-[15px]"
                        />
                    )}

                    {/* RIGHT ACTION */}
                    <div className="flex items-center gap-4">
                        {!isLoading && user ? (
                            <Dropdown menu={userMenu} placement="bottomRight" arrow>
                                <div className={`cursor-pointer px-2 py-1 rounded-full flex items-center gap-2 transition-colors ${scrolled ? 'bg-gray-100' : 'hover:bg-gray-100'}`}>
                                    <Avatar
                                        style={{ backgroundColor: colorPrimary }}
                                        icon={<UserOutlined />}
                                        size="small"
                                    />
                                    {!isMobile && (
                                        <span className="font-semibold text-sm text-gray-800">
                                            {user.username}
                                        </span>
                                    )}
                                </div>
                            </Dropdown>
                        ) : (
                            <Button
                                type="primary"
                                shape="round"
                                onClick={() => router.push('/admin/login')}
                                size={isMobile ? 'middle' : 'large'}
                                className="font-semibold px-6"
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
            </header>

            {/* MOBILE DRAWER */}
            <Drawer
                title={<span className="font-bold" style={{ color: colorPrimary }}>MENU</span>}
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
                    className="border-r-0 text-base"
                />
            </Drawer>
        </>
    );
}