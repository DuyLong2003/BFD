import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConfigProvider, App as AntdApp } from "antd";
import AntdRegistry from "@/providers/AntdRegistry";
import QueryProvider from "@/providers/QueryProvider";
import theme from "@/theme/themeConfig";
import "./globals.css";
import AntdConfigProvider from "@/providers/AntdConfigProvider";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BFD News CMS",
  description: "Hệ thống quản trị nội dung BFD",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <QueryProvider>
            <AntdConfigProvider>
              <ConfigProvider theme={theme}>
                <AntdApp>{children}</AntdApp>
              </ConfigProvider>
            </AntdConfigProvider>
          </QueryProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
