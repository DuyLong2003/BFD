'use client';

import { useRef, useState } from 'react';
import { ActionType, ProTable, ProColumns, PageContainer, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Popconfirm, Tooltip, App, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import slugify from 'slugify';
import { categoryService, Category } from '@/services/category.service';
import dayjs from 'dayjs';

export default function CategoryListPage() {
    const actionRef = useRef<ActionType>();
    const { message } = App.useApp();

    // State quản lý Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [currentRow, setCurrentRow] = useState<Category | null>(null);

    // Hook Form để xử lý auto-slug trong modal
    const [form] = Form.useForm();

    // Xử lý Submit (Tạo mới hoặc Cập nhật)
    const handleFinish = async (values: any) => {
        try {
            if (currentRow) {
                // Update
                await categoryService.updateCategory(currentRow._id, values);
                message.success('Cập nhật thành công');
            } else {
                // Create
                await categoryService.createCategory(values);
                message.success('Tạo chuyên mục thành công');
            }
            setModalVisible(false);
            actionRef.current?.reload(); // Reload bảng
            return true;
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra');
            return false;
        }
    };

    const columns: ProColumns<Category>[] = [
        {
            title: 'STT',
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
        {
            title: 'Tên chuyên mục',
            dataIndex: 'name',
            copyable: true,
            sorter: true,
            formItemProps: {
                rules: [{ required: true, message: 'Vui lòng nhập tên' }],
            },
            fieldProps: {
                prefix: <SearchOutlined className="text-gray-400" />,
                placeholder: 'Tìm theo tên...',
            },
            render: (_, record) => (
                <span className="font-medium text-gray-700">{record.name}</span>
            ),
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            search: false,
            render: (text) => <span className="text-gray-500 font-mono text-sm">{text}</span>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            search: false,
            ellipsis: true,
            width: 300,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            search: false,
            width: 150,
            render: (_, record) => (
                <span className="text-gray-500 text-sm">
                    {dayjs(record.createdAt).format('DD/MM/YYYY')}
                </span>
            ),
        },
        {
            title: 'Hành động',
            valueType: 'option',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <div className="flex items-center gap-x-2">
                    <Tooltip title="Sửa" mouseEnterDelay={0.5}>
                        <Button
                            type="text"
                            size="small"
                            className="!text-amber-500 hover:!bg-amber-50"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setCurrentRow(record);
                                form.setFieldsValue(record); // Fill data vào form
                                setModalVisible(true);
                            }}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Xóa chuyên mục?"
                        description="Hành động này không thể hoàn tác!"
                        onConfirm={async () => {
                            try {
                                await categoryService.deleteCategory(record._id);
                                message.success('Đã xóa chuyên mục');
                                actionRef.current?.reload();
                            } catch (error) {
                                message.error('Xóa thất bại');
                            }
                        }}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa" mouseEnterDelay={0.5}>
                            <Button
                                type="text"
                                size="small"
                                className="!text-red-500 hover:!bg-red-50"
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <PageContainer
            title="Quản lý chuyên mục"
            subTitle="Phân loại nội dung cho hệ thống tin tức"
            className="bg-gray-50 min-h-screen"
        >
            <ProTable<Category>
                headerTitle="Danh sách chuyên mục"
                actionRef={actionRef}
                rowKey="_id"
                // Tùy chỉnh thanh công cụ
                options={{
                    density: true,
                    fullScreen: true,
                    reload: true,
                    setting: true,
                }}
                // Style ô search
                search={{
                    labelWidth: 'auto',
                    defaultCollapsed: false,
                    className: 'bg-white p-4 rounded-lg shadow-sm mb-4',
                    searchText: 'Tìm kiếm',
                    resetText: 'Làm mới',
                }}
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        type="primary"
                        className="bg-blue-600 shadow-sm hover:shadow-md transition-all"
                        onClick={() => {
                            setCurrentRow(null);
                            form.resetFields();
                            setModalVisible(true);
                        }}
                    >
                        Thêm chuyên mục
                    </Button>,
                ]}
                request={async (params, sort) => {
                    let sortString = undefined;
                    const sortKey = Object.keys(sort)[0];
                    if (sortKey) {
                        const sortOrder = sort[sortKey] === 'descend' ? '-' : '';
                        sortString = `${sortOrder}${sortKey}`;
                    }

                    const msg = await categoryService.getCategories({
                        page: params.current,
                        limit: params.pageSize,
                        q: params.name,
                        sort: sortString,
                    });

                    return {
                        data: Array.isArray(msg) ? msg : msg.data,
                        success: true,
                        total: Array.isArray(msg) ? msg.length : msg.total,
                    };
                }}
                columns={columns}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                cardBordered={false}
                cardProps={{
                    className: "shadow-sm rounded-lg"
                }}
            />

            {/* MODAL FORM */}
            <ModalForm
                title={currentRow ? 'Cập nhật chuyên mục' : 'Thêm chuyên mục mới'}
                open={modalVisible}
                onOpenChange={setModalVisible}
                form={form}
                onFinish={handleFinish}
                modalProps={{ destroyOnClose: true }}
                width={500}
            >
                <ProFormText
                    name="name"
                    label="Tên chuyên mục"
                    placeholder="Nhập tên chuyên mục"
                    rules={[{ required: true, message: 'Vui lòng nhập tên chuyên mục' }]}
                    fieldProps={{
                        onChange: (e) => {
                            const val = e.target.value;
                            if (!currentRow) {
                                form.setFieldValue('slug', slugify(val, { lower: true, locale: 'vi' }));
                            }
                        }
                    }}
                />

                <ProFormText
                    name="slug"
                    label="Slug (Đường dẫn tĩnh)"
                    placeholder="tu-dong-tao"
                    rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
                    extra="Đường dẫn tĩnh dùng cho SEO, ví dụ: tin-tuc-cong-nghe"
                />

                <ProFormTextArea
                    name="description"
                    label="Mô tả"
                    placeholder="Mô tả ngắn về chuyên mục này"
                    fieldProps={{ rows: 3 }}
                />
            </ModalForm>
        </PageContainer>
    );
}