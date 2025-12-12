/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    transpilePackages: ['antd', '@ant-design/pro-components', '@ant-design/icons'],
    images: {
        domains: ['localhost', 'http://localhost:8080'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },

            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9000',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;