'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ActionType, ProTable, ProColumns, PageContainer } from '@ant-design/pro-components';
import { Button, Tag, Popconfirm, Tooltip, App, Image, Typography, Space } from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    SearchOutlined, PictureOutlined
} from '@ant-design/icons';
import { articleService, Article } from '@/services/article.service';
import { Category, categoryService } from '@/services/category.service';
import dayjs from 'dayjs';

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

        // THUMBNAIL (Kết hợp Tailwind để style khung ảnh)
        {
            title: 'Ảnh',
            dataIndex: 'thumbnail',
            width: 80,
            align: 'center',
            search: false,
            render: (_, record) => (
                <div className="w-[50px] h-[36px] rounded overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center mx-auto">
                    {record.thumbnail ? (
                        <Image
                            src={record.thumbnail}
                            alt={record.title}
                            width={50}
                            height={36}
                            className="object-cover !h-full !w-full"
                            preview={{ mask: false }}
                        />
                    ) : (
                        <PictureOutlined className="text-lg text-gray-300" />
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
                    <Link
                        href={`/admin/articles/edit/${record._id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors block truncate"
                    >
                        {record.title}
                    </Link>
                </Tooltip>
            ),
            fieldProps: {
                placeholder: 'Nhập tên bài viết...',
                prefix: <SearchOutlined className="text-gray-400" />,
            },
        },

        // CHUYÊN MỤC
        {
            title: 'Chuyên mục',
            dataIndex: 'category',
            valueType: 'select',
            sorter: true,
            width: 180,
            fieldProps: {
                showSearch: true,
                placeholder: 'Chọn chuyên mục',
            },
            request: async () => {
                const res = await categoryService.getCategories();
                const cats = Array.isArray(res) ? res : (res as any).data || [];
                return cats.map((c: Category) => ({
                    label: c.name,
                    value: c._id
                }));
            },
            search: {
                transform: (value) => ({ category: value }),
            },
            render: (_, record) => (
                record.category ? (
                    <Tag color="cyan" className="font-medium">
                        {record.category.name}
                    </Tag>
                ) : (
                    <Tag color="error">Không có danh mục</Tag>
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
                placeholder: 'Lọc trạng thái',
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
            width: 150,
            sorter: true,
            render: (_, record) => (
                <span className="text-gray-500 text-sm">
                    {dayjs(record.createdAt).format('DD/MM/YYYY')}
                </span>
            ),
            search: {
                transform: (value) => {
                    if (!value || value.length === 0) return { startDate: undefined, endDate: undefined };
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
            render: (_, record) => (
                <div className="flex items-center gap-x-2">
                    <Tooltip title="Chỉnh sửa">
                        <Link href={`/admin/articles/edit/${record._id}`}>
                            <Button
                                type="text"
                                size="small"
                                className="!text-amber-500 hover:!bg-amber-50"
                                icon={<EditOutlined />}
                            />
                        </Link>
                    </Tooltip>

                    <Popconfirm
                        title="Xóa bài viết?"
                        description="Hành động này không thể hoàn tác!"
                        onConfirm={async () => {
                            await articleService.deleteArticle(record._id);
                            message.success('Đã xóa bài viết thành công');
                            actionRef.current?.reload();
                        }}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa">
                            <Button
                                type="text"
                                size="small"
                                className="!text-red-500 hover:!bg-red-50"
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <PageContainer
            title="Quản lý bài viết"
            subTitle="Danh sách tin tức và bài viết trên hệ thống"
            extra={[
                <Link href="/admin/articles/create" key="create">
                    <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 shadow-sm hover:shadow-md transition-all">
                        Viết bài mới
                    </Button>
                </Link>,
            ]}
            className="bg-gray-50 min-h-screen"
        >
            <ProTable<Article>
                headerTitle="Danh sách bài viết"
                actionRef={actionRef}
                rowKey="_id"
                // Tùy chỉnh thanh công cụ
                options={{
                    density: true,
                    fullScreen: true,
                    reload: true,
                    setting: true,
                }}
                // Style cho ô search
                search={{
                    labelWidth: 'auto',
                    defaultCollapsed: false,
                    className: 'bg-white p-4 rounded-lg shadow-sm mb-4',
                    searchText: 'Tìm kiếm',
                    resetText: 'Làm mới',
                }}
                // Xử lý request API
                request={async (params, sort) => {
                    let sortString = undefined;
                    const sortKeyRaw = Object.keys(sort)[0];

                    if (sortKeyRaw) {
                        const sortOrder = sort[sortKeyRaw] === 'descend' ? '-' : '';
                        let cleanKey = sortKeyRaw;
                        if (cleanKey === 'category') cleanKey = 'category';
                        sortString = `${sortOrder}${cleanKey}`;
                    }

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
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng cộng ${total} bài viết`,
                }}
                dateFormatter="string"
                cardBordered={false}
                // Thêm class cho bảng để đẹp hơn
                tableClassName="bg-white rounded-lg shadow-sm"
                className="ant-pro-table-custom"
            />
        </PageContainer>
    );
}