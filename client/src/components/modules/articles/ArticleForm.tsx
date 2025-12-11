'use client';

import { useEffect, useState } from 'react';
import {
    Form, Input, Select, Button, Card,
    Upload, App, Row, Col, Flex, Image, Spin,
    Space
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

const TinyEditor = dynamic(() => import('@/components/core/TinyEditor'), {
    ssr: false,
    loading: () => (
        <div style={{ height: 400, background: 'rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

    // useEffect(() => {
    //     if (!isMounted) return;

    //     const fetchCats = async () => {
    //         try {
    //             const res = await categoryService.getCategories();
    //             setCategories(res.map((c: any) => ({ label: c.name, value: c._id })));
    //         } catch {
    //             console.error('Lỗi tải danh mục');
    //         }
    //     };
    //     fetchCats();

    //     if (initialValues) {
    //         form.setFieldsValue({
    //             ...initialValues,
    //             category: initialValues.category?._id || initialValues.category,
    //             content: initialValues.content || ''
    //         });
    //         setThumbnailUrl(initialValues.thumbnail);
    //     }
    // }, [isMounted, initialValues, form]);

    useEffect(() => {
        if (!isMounted) return;

        const initData = async () => {
            try {
                const res = await categoryService.getCategories();
                const catList = Array.isArray(res) ? res : (res as any).data || [];

                setCategories(catList.map((c: any) => ({ label: c.name, value: c._id })));

                if (initialValues) {
                    let categoryId = initialValues.category;

                    // Nếu category là object (có _id) -> lấy _id
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

            setTimeout(() => {
                router.push('/admin/articles');
                router.refresh();
            }, 1500);
        } catch (error: any) {
            console.error("Lỗi submit:", error);
            if (error.response) {
                msg.error(error.response?.data?.message || 'Có lỗi xảy ra từ hệ thống');
            } else {
                msg.error('Không thể kết nối đến máy chủ');
            }
            setLoading(false);
        }
    };

    if (!isMounted) {
        return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large" /></div>;
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
        >
            <Row gutter={24}>
                <Col span={18}>
                    <Card title="Nội dung bài viết" variant='borderless'>
                        <Form.Item
                            name="title"
                            label="Tiêu đề bài viết"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                        >
                            <Input size="large" placeholder="Nhập tiêu đề..." />
                        </Form.Item>

                        <Form.Item label="Đường dẫn tĩnh (Slug)" required>
                            <Space.Compact style={{ width: '100%' }}>
                                <Button disabled type="default" style={{
                                    cursor: 'default',
                                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                    color: 'rgba(0, 0, 0, 0.45)',
                                    borderColor: '#d9d9d9'
                                }}>
                                    /posts/
                                </Button>

                                <Form.Item
                                    name="slug"
                                    noStyle
                                    rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
                                >
                                    <Input placeholder="duong-dan-bai-viet" />
                                </Form.Item>
                            </Space.Compact>
                        </Form.Item>

                        <Form.Item
                            name="content"
                            label="Nội dung chi tiết"
                            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                        >
                            <TinyEditor />
                        </Form.Item>
                    </Card>
                </Col>

                <Col span={6}>
                    <Flex vertical gap={24}>
                        <Card title="Đăng bài" variant='borderless'>
                            <Form.Item name="status" label="Trạng thái">
                                <Select options={[
                                    { value: 'Draft', label: 'Bản nháp' },
                                    { value: 'Published', label: 'Công khai' }
                                ]} />
                            </Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={loading}
                                block
                                size="large"
                            >
                                {isEdit ? 'Cập nhật' : 'Lưu bài viết'}
                            </Button>

                            <Button
                                style={{ marginTop: 10 }}
                                block
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.back()}
                            >
                                Quay lại
                            </Button>
                        </Card>

                        <Card title="Phân loại" variant='borderless'>
                            <Form.Item
                                name="category"
                                label="Chuyên mục"
                                rules={[{ required: true, message: 'Chọn chuyên mục' }]}
                            >
                                <Select
                                    placeholder="Chọn chuyên mục"
                                    options={categories}
                                    showSearch
                                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                />
                            </Form.Item>
                        </Card>

                        <Card title="Ảnh đại diện" variant='borderless'>
                            <Form.Item name="thumbnail" hidden>
                                <Input />
                            </Form.Item>

                            <Upload.Dragger
                                name="file"
                                multiple={false}
                                showUploadList={false}
                                beforeUpload={handleUpload}
                                style={{ padding: 20, background: '#fafafa' }}
                            >
                                {thumbnailUrl ? (
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={thumbnailUrl}
                                            alt="thumbnail"
                                            style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' }}
                                        />
                                        <div style={{ marginTop: 8, color: '#1677ff', fontSize: 12 }}>
                                            Nhấn để thay đổi
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="ant-upload-drag-icon">
                                            {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                                        </p>
                                        <p className="ant-upload-text" style={{ fontSize: 14 }}>Tải ảnh lên</p>
                                    </div>
                                )}
                            </Upload.Dragger>
                        </Card>
                    </Flex>
                </Col>
            </Row>
        </Form>
    );
}