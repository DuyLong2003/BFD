'use client';

import { useEffect, useState } from 'react';
import {
    Form, Input, Select, Button, Card,
    Upload, App, Spin, Image
} from 'antd';
import {
    SaveOutlined, ArrowLeftOutlined,
    LoadingOutlined, PlusOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import dynamic from 'next/dynamic';
import { categoryService } from '@/services/category.service';
import { fileService } from '@/services/file.service';
import { articleService, Article } from '@/services/article.service';

// Lazy load TinyMCE
const TinyEditor = dynamic(() => import('@/components/core/TinyEditor'), {
    ssr: false,
    loading: () => (
        <div className="h-[400px] bg-gray-50 flex items-center justify-center rounded-lg border border-gray-200">
            <Spin tip="Đang tải trình soạn thảo..." />
        </div>
    )
});

interface ArticleFormProps {
    articleId?: string;
    initialValues?: Partial<Article>;
    onSuccess?: () => void;
}

export default function ArticleForm({ articleId, initialValues, onSuccess }: ArticleFormProps) {
    const [isMounted, setIsMounted] = useState(false);
    const isEdit = Boolean(articleId);
    const [form] = Form.useForm();
    const router = useRouter();
    const { message: msg } = App.useApp();

    const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(initialValues?.thumbnail);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const initData = async () => {
            try {
                const res = await categoryService.getCategories();
                // Handle data trả về từ API (có thể là mảng hoặc object {data: []})
                const catList = Array.isArray(res) ? res : (res as any).data || [];

                setCategories(catList.map((c: any) => ({ label: c.name, value: c._id })));

                if (initialValues) {
                    let categoryId = initialValues.category;
                    if (categoryId && typeof categoryId === 'object' && '_id' in categoryId) {
                        categoryId = (categoryId as any)._id;
                    }

                    form.setFieldsValue({
                        ...initialValues,
                        category: categoryId,
                        content: initialValues.content || ''
                    });
                    setThumbnailUrl(initialValues.thumbnail);
                }
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
            }
        };

        initData();
    }, [isMounted, initialValues, form]);

    const handleUpload = async (file: File) => {
        setUploading(true);
        try {
            const res = await fileService.upload(file);
            const url = res.url;
            setThumbnailUrl(url);
            form.setFieldValue('thumbnail', url);
            msg.success('Upload ảnh thành công');
        } catch (error) {
            console.error(error);
            msg.error('Upload thất bại');
        } finally {
            setUploading(false);
        }
        return false;
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                slug: values.slug || slugify(values.title, { lower: true, locale: 'vi' }),
            };

            if (isEdit && articleId) {
                await articleService.updateArticle(articleId, payload);
                msg.success('Cập nhật thành công');
            } else {
                await articleService.createArticle(payload);
                msg.success('Tạo mới thành công');
            }

            if (onSuccess) {
                onSuccess();
            } else {
                setTimeout(() => {
                    router.push('/admin/articles');
                    router.refresh();
                }, 1000);
            }
        } catch (error: any) {
            console.error("Lỗi submit:", error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra từ hệ thống';
            msg.error(errorMessage);
            setLoading(false);
        }
    };

    if (!isMounted) {
        return <div className="p-12 text-center"><Spin size="large" /></div>;
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ status: 'Draft', content: '' }}
            onValuesChange={(changedValues) => {
                if (changedValues.title && !isEdit) {
                    const slug = slugify(changedValues.title, { lower: true, locale: 'vi' });
                    form.setFieldValue('slug', slug);
                }
            }}
            className="w-full"
        >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* LEFT COLUMN: MAIN CONTENT */}
                <div className="lg:col-span-3 space-y-6">
                    <Card title="Nội dung bài viết" bordered={false} className="shadow-sm rounded-lg">
                        <Form.Item
                            name="title"
                            label="Tiêu đề bài viết"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                        >
                            <Input size="large" placeholder="Nhập tiêu đề bài viết..." className="font-medium" />
                        </Form.Item>

                        <Form.Item label="Đường dẫn tĩnh (Slug)" required>
                            <div className="flex items-center w-full">
                                <div className="bg-gray-100 border border-r-0 border-gray-300 text-gray-500 px-3 py-[5px] rounded-l-md cursor-default select-none">
                                    /posts/
                                </div>
                                <Form.Item
                                    name="slug"
                                    noStyle
                                    rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
                                >
                                    <Input placeholder="duong-dan-bai-viet" className="rounded-l-none" />
                                </Form.Item>
                            </div>
                        </Form.Item>

                        <Form.Item
                            name="content"
                            label="Nội dung chi tiết"
                            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                            className="min-h-[400px]"
                        >
                            <TinyEditor />
                        </Form.Item>
                    </Card>
                </div>

                {/* RIGHT COLUMN: SIDEBAR ACTION */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Panel 1: Publish Action */}
                    <Card title="Đăng bài" bordered={false} className="shadow-sm rounded-lg">
                        <Form.Item name="status" label="Trạng thái" className="mb-4">
                            <Select options={[
                                { value: 'Draft', label: 'Bản nháp' },
                                { value: 'Published', label: 'Công khai' }
                            ]} />
                        </Form.Item>

                        <div className="flex flex-col gap-3">
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={loading}
                                block
                                size="large"
                                className="bg-blue-600 hover:bg-blue-700 font-medium shadow-sm"
                            >
                                {isEdit ? 'Cập nhật' : 'Lưu bài viết'}
                            </Button>

                            <Button
                                block
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.back()}
                                className="hover:bg-gray-50"
                            >
                                Quay lại
                            </Button>
                        </div>
                    </Card>

                    {/* Panel 2: Category */}
                    <Card title="Phân loại" bordered={false} className="shadow-sm rounded-lg">
                        <Form.Item
                            name="category"
                            label="Chuyên mục"
                            rules={[{ required: true, message: 'Chọn chuyên mục' }]}
                            className="mb-0"
                        >
                            <Select
                                placeholder="Chọn chuyên mục"
                                options={categories}
                                showSearch
                                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            />
                        </Form.Item>
                    </Card>

                    {/* Panel 3: Thumbnail */}
                    <Card title="Ảnh đại diện" bordered={false} className="shadow-sm rounded-lg">
                        <Form.Item name="thumbnail" hidden>
                            <Input />
                        </Form.Item>

                        <Upload.Dragger
                            name="file"
                            multiple={false}
                            showUploadList={false}
                            beforeUpload={handleUpload}
                            className="!bg-gray-50 hover:!bg-gray-100 transition-colors border-dashed"
                        >
                            {thumbnailUrl ? (
                                <div className="relative group">
                                    <img
                                        src={thumbnailUrl}
                                        alt="thumbnail"
                                        className="w-full h-auto max-h-[200px] object-cover rounded-md shadow-sm"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                        <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded">Nhấn để thay đổi</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8">
                                    <p className="text-3xl text-blue-500 mb-2">
                                        {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                                    </p>
                                    <p className="text-sm text-gray-500 font-medium">Tải ảnh lên</p>
                                </div>
                            )}
                        </Upload.Dragger>
                    </Card>
                </div>
            </div>
        </Form>
    );
}