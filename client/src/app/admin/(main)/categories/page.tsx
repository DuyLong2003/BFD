'use client';

import { ActionType, ProTable, ProColumns, PageContainer } from '@ant-design/pro-components';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Popconfirm, Tooltip, App, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import slugify from 'slugify';
import { categoryService, Category } from '@/services/category.service';

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
        },
        {
            title: 'Tên chuyên mục',
            dataIndex: 'name',
            copyable: true,
            sorter: true, // Backend đã hỗ trợ sort dynamic
            formItemProps: {
                rules: [{ required: true, message: 'Vui lòng nhập tên' }],
            },
            fieldProps: {
                prefix: <SearchOutlined />,
                placeholder: 'Tìm theo tên...',
            },
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            search: false, // Không cần tìm theo slug
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            search: false,
            ellipsis: true,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            search: false,
            width: 150,
        },
        {
            title: 'Hành động',
            valueType: 'option',
            fixed: 'right',
            width: 120,
            render: (_, record) => [
                <Tooltip title="Sửa" key="edit" mouseEnterDelay={1}>
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: '#faad14' }} />}
                        onClick={() => {
                            setCurrentRow(record);
                            form.setFieldsValue(record); // Fill data vào form
                            setModalVisible(true);
                        }}
                    />
                </Tooltip>,
                <Popconfirm
                    key="delete"
                    title="Xóa chuyên mục?"
                    description="Hành động này không thể hoàn tác!"
                    onConfirm={async () => {
                        try {
                            await categoryService.deleteCategory(record._id);
                            message.success('Đã xóa');
                            actionRef.current?.reload();
                        } catch (error) {
                            message.error('Xóa thất bại');
                        }
                    }}
                    okButtonProps={{ danger: true }}
                >
                    <Tooltip title="Xóa" mouseEnterDelay={1}>
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                </Popconfirm>
            ]
        }
    ];

    return (
        <PageContainer>
            <ProTable<Category>
                headerTitle="Danh sách chuyên mục"
                actionRef={actionRef}
                rowKey="_id"
                search={{
                    labelWidth: 'auto',
                    defaultCollapsed: false,
                }}
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => {
                            setCurrentRow(null); // Reset current row -> Mode Create
                            form.resetFields(); // Reset form
                            setModalVisible(true);
                        }}
                    >
                        Thêm chuyên mục
                    </Button>,
                ]}
                request={async (params, sort) => {
                    // Logic request chuẩn như bên Article
                    let sortString = undefined;
                    const sortKey = Object.keys(sort)[0];
                    if (sortKey) {
                        const sortOrder = sort[sortKey] === 'descend' ? '-' : '';
                        sortString = `${sortOrder}${sortKey}`;
                    }

                    const msg = await categoryService.getCategories({
                        page: params.current,
                        limit: params.pageSize,
                        q: params.name, // Map field name search
                        sort: sortString,
                    });

                    // Handle trường hợp API trả về mảng (khi không phân trang) hoặc object {data, total}
                    // Code backend mới sửa trả về {data, total} nên map thẳng
                    return {
                        data: Array.isArray(msg) ? msg : msg.data,
                        success: true,
                        total: Array.isArray(msg) ? msg.length : msg.total,
                    };
                }}
                columns={columns}
                pagination={{ pageSize: 10 }}
            />

            {/* MODAL FORM: Dùng chung cho Tạo mới & Sửa */}
            <ModalForm
                title={currentRow ? 'Cập nhật chuyên mục' : 'Thêm chuyên mục mới'}
                open={modalVisible}
                onOpenChange={setModalVisible}
                form={form}
                onFinish={handleFinish}
                modalProps={{ destroyOnClose: true }} // Reset khi đóng
            >
                <ProFormText
                    name="name"
                    label="Tên chuyên mục"
                    placeholder="Nhập tên chuyên mục"
                    rules={[{ required: true, message: 'Vui lòng nhập tên chuyên mục' }]}
                    fieldProps={{
                        // Auto slug khi gõ tên
                        onChange: (e) => {
                            const val = e.target.value;
                            if (!currentRow) { // Chỉ auto khi tạo mới
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
                />

                <ProFormTextArea
                    name="description"
                    label="Mô tả"
                    placeholder="Mô tả ngắn về chuyên mục này"
                />
            </ModalForm>
        </PageContainer>
    );
}