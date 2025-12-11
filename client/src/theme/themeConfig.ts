import type { ThemeConfig } from 'antd';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

const theme: ThemeConfig = {
    token: {
        fontSize: 14,
        colorPrimary: '#0052CC',
        borderRadius: 6,
        fontFamily: inter.style.fontFamily,
        colorBgLayout: '#F4F5F7',
    },
    components: {
        Button: {
            controlHeight: 40,
            fontWeight: 500,
            primaryShadow: '0 2px 0 rgba(0, 82, 204, 0.1)',
        },
        Input: {
            controlHeight: 40,
            colorBgContainer: '#FFFFFF',
            activeBorderColor: '#0052CC',
            fontFamily: inter.style.fontFamily,
        },
        Typography: {
            fontFamily: inter.style.fontFamily,
        }
    },
};

export default theme;