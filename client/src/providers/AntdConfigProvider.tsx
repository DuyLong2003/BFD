'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme as antTheme } from 'antd';
import { Inter } from 'next/font/google';
import viVN from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi');

const inter = Inter({
    subsets: ['latin', 'vietnamese'],
    display: 'swap',
});

const ThemeContext = createContext({
    isDarkMode: false,
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export default function AntdConfigProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <ConfigProvider
                locale={viVN}

                theme={{
                    algorithm: isDarkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,

                    token: {
                        fontFamily: inter.style.fontFamily,
                        colorPrimary: '#0052CC',
                        borderRadius: 6,
                        colorBgLayout: isDarkMode ? '#141414' : '#F4F5F7',
                    },
                    components: {
                        Button: {
                            controlHeight: 40,
                            fontWeight: 500,
                            fontFamily: inter.style.fontFamily
                        },
                        Input: { controlHeight: 40, fontFamily: inter.style.fontFamily },
                        Table: {
                            headerBg: isDarkMode ? '#1f1f1f' : '#fafafa',
                        }
                    }
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
}