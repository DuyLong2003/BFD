'use client';

import { ActionType, ProTable, ProColumns, PageContainer } from '@ant-design/pro-components';
import { Button, Tag, Popconfirm, Tooltip, App, Image, Typography } from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    SearchOutlined, PictureOutlined
} from '@ant-design/icons';
import { useRef } from 'react';
import Link from 'next/link';
import { articleService, Article } from '@/services/article.service';
import { Category, categoryService } from '@/services/category.service';

const { Text } = Typography;

export default function ArticleListPage() {
    const actionRef = useRef<ActionType>();
    const { message } = App.useApp();

    const columns: ProColumns<Article>[] = [
        // STT
        {
            title: '#',
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
            align: 'center',
            render: (_, record, index, action) => {
                const currentPage = action?.pageInfo?.current || 1;
                const pageSize = action?.pageInfo?.pageSize || 10;
                return (currentPage - 1) * pageSize + index + 1;
            },
        },

        // THUMBNAIL
        {
            title: 'Ảnh',
            dataIndex: 'thumbnail',
            width: 80,
            align: 'center',
            search: false,
            render: (_, record) => (
                <div style={{
                    width: 50, height: 36, borderRadius: 4, overflow: 'hidden',
                    border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa'
                }}>
                    {record.thumbnail ? (
                        <Image src={record.thumbnail} alt={record.title} width={50} height={36} style={{ objectFit: 'cover' }} />
                    ) : (
                        <PictureOutlined style={{ fontSize: 18, color: '#d9d9d9' }} />
                    )}
                </div>
            ),
        },

        // TIÊU ĐỀ 
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            width: 250,
            ellipsis: true,
            sorter: true,
            render: (_, record) => (
                <Tooltip title={record.title} placement="topLeft">
                    <Link href={`/admin/articles/edit/${record._id}`} style={{ fontWeight: 500, color: '#1677ff' }}>
                        {record.title}
                    </Link>
                </Tooltip>
            ),
            fieldProps: {
                placeholder: 'Tìm theo tên...',
                prefix: <SearchOutlined />,
            },
        },

        // CHUYÊN MỤC
        {
            title: 'Chuyên mục',
            dataIndex: 'category',
            valueType: 'select',
            sorter: true,
            width: 180,

            // Filter (Dropdown)
            fieldProps: {
                showSearch: true,
                placeholder: 'Chọn chuyên mục',
            },

            request: async () => {
                const cats = await categoryService.getCategories();
                return (cats as unknown as Category[]).map((c) => ({
                    label: c.name,
                    value: c._id
                }));
            },

            search: {
                transform: (value) => ({
                    category: value,
                }),
            },

            render: (_, record) => (
                record.category ? (
                    <Tag color="cyan">{record.category.name}</Tag>
                ) : (
                    <Tag color="error">Lỗi dữ liệu</Tag>
                )
            ),
        },

        // TRẠNG THÁI 
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 120,
            valueType: 'select',
            sorter: true,
            fieldProps: {
                placeholder: 'Chọn trạng thái',
            },
            valueEnum: {
                Draft: { text: 'Nháp', status: 'Default' },
                Published: { text: 'Đã đăng', status: 'Success' },
            },
        },

        // NGÀY TẠO 
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            valueType: 'dateRange',
            width: 160,
            sorter: true,
            render: (_, record) => (
                <Text type="secondary" style={{ fontSize: 13 }} suppressHydrationWarning>
                    {new Date(record.createdAt).toLocaleDateString('vi-VN')}
                </Text>
            ),
            search: {
                transform: (value) => {
                    if (!value || value.length === 0) {
                        return { startDate: undefined, endDate: undefined };
                    }
                    return { startDate: value[0], endDate: value[1] };
                },
            },
        },

        // HÀNH ĐỘNG
        {
            title: 'Hành động',
            valueType: 'option',
            fixed: 'right',
            width: 100,
            render: (_, record) => [
                <Tooltip title="Sửa" key="edit" mouseEnterDelay={1}>
                    <Link href={`/admin/articles/edit/${record._id}`}>
                        <Button type="text" size="small" icon={<EditOutlined style={{ color: '#faad14' }} />} />
                    </Link>
                </Tooltip>,
                <Popconfirm
                    key="delete"
                    title="Xóa bài viết?"
                    onConfirm={async () => {
                        await articleService.deleteArticle(record._id);
                        message.success('Đã xóa');
                        actionRef.current?.reload();
                    }}
                    okButtonProps={{ danger: true }}
                >
                    <Tooltip title="Xóa" mouseEnterDelay={1}>
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                </Popconfirm>,
            ],
        },
    ];

    return (
        <PageContainer
            title="Quản lý bài viết"
            extra={[
                <Link href="/admin/articles/create" key="create">
                    <Button type="primary" icon={<PlusOutlined />}>Thêm bài viết</Button>
                </Link>,
            ]}
        >
            <ProTable<Article>
                headerTitle="Danh sách bài viết"
                actionRef={actionRef}
                rowKey="_id"
                form={{ syncToUrl: (values, type) => type === 'get' ? values : values }}

                request={async (params, sort) => {
                    let sortString = undefined;
                    const sortKeyRaw = Object.keys(sort)[0];

                    if (sortKeyRaw) {
                        const sortOrder = sort[sortKeyRaw] === 'descend' ? '-' : '';
                        let cleanKey = sortKeyRaw;
                        if (cleanKey === 'category') cleanKey = 'category';

                        sortString = `${sortOrder}${cleanKey}`;
                    }

                    // 2. Gọi API
                    const data = await articleService.getArticles({
                        page: params.current,
                        limit: params.pageSize,
                        q: params.title as string,
                        category: params.category,
                        status: params.status,
                        startDate: params.startDate,
                        endDate: params.endDate,
                        sort: sortString,
                    });

                    return {
                        data: data.data,
                        success: true,
                        total: data.total
                    };
                }}
                columns={columns}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                dateFormatter="string"
                cardBordered={false}
                search={{
                    labelWidth: 'auto',
                    defaultCollapsed: false,
                    searchText: 'Tìm kiếm',
                    resetText: 'Làm mới',
                }}
            />
        </PageContainer>
    );
}