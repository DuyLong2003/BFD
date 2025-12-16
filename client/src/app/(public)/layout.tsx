'use client';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <PublicHeader />

            {/* Content: flex-1 -> đẩy footer xuống đáy, giới hạn width 1200px và căn giữa */}
            <main className="flex-1 w-full max-w-[1200px] self-center px-6 my-6">
                {children}
            </main>

            <PublicFooter />
        </div>
    );
}