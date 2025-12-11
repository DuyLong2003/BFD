'use client';

import { ActionType, ProTable, ProColumns, PageContainer, ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, Popconfirm, Tooltip, App, Form, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { userService, User } from '@/services/user.service';
import { createUserSchema, updateUserSchema } from '@/lib/validations/user.schema';

export default function UserListPage() {
    const actionRef = useRef<ActionType>();
    const { message } = App.useApp();

    const [modalVisible, setModalVisible] = useState(false);
    const [currentRow, setCurrentRow] = useState<User | null>(null);
    const [form] = Form.useForm();

    // --- XỬ LÝ SUBMIT VỚI ZOD VALIDATION ---
    const handleFinish = async (values: any) => {
        // 1. Chọn schema tùy theo mode (Create hay Update)
        const schema = currentRow ? updateUserSchema : createUserSchema;

        // 2. Validate dữ liệu bằng Zod
        const result = schema.safeParse(values);

        if (!result.success) {
            // Nếu lỗi, map lỗi từ Zod sang Antd Form để hiển thị đỏ dưới ô input
            const errorFields = result.error.issues.map((issue) => ({
                name: issue.path[0], // Tên field (vd: username)
                errors: [issue.message], // Nội dung lỗi
            }));
            form.setFields(errorFields); // Hiển thị lỗi lên form
            return false; // Chặn submit
        }

        // 3. Nếu validate OK -> Gọi API
        try {
            const validData = result.data; // Dữ liệu đã được làm sạch bởi Zod

            if (currentRow) {
                // Update: Nếu password rỗng thì xóa đi để không gửi lên server
                if (!validData.password) delete validData.password;

                await userService.updateUser(currentRow._id, validData);
                message.success('Cập nhật thành công');
            } else {
                // Create
                await userService.createUser(validData);
                message.success('Tạo người dùng thành công');
            }

            setModalVisible(false);
            actionRef.current?.reload();
            return true;
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra');
            return false;
        }
    };

    // --- CẤU HÌNH CỘT BẢNG ---
    const columns: ProColumns<User>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'username',
            copyable: true,
            sorter: true,
            fieldProps: { placeholder: 'Tìm theo tên...' }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
            sorter: true,
            fieldProps: { placeholder: 'Tìm theo email...' }
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            valueType: 'select',
            width: 120,
            valueEnum: {
                admin: { text: 'Admin', status: 'Error' }, // Admin màu đỏ
                user: { text: 'User', status: 'Success' }, // User màu xanh lá
            },
            render: (_, record) => (
                <Tag color={record.role === 'admin' ? 'red' : 'blue'} style={{ width: 60, textAlign: 'center' }}>
                    {record.role === 'admin' ? 'ADMIN' : 'USER'}
                </Tag>
            )
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
                <Tooltip title="Chỉnh sửa" key="edit">
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: '#faad14' }} />}
                        onClick={() => {
                            setCurrentRow(record);
                            form.setFieldsValue({
                                ...record,
                                password: '', // Reset password field khi edit
                            });
                            setModalVisible(true);
                        }}
                    />
                </Tooltip>,
                <Popconfirm
                    key="delete"
                    title="Xóa người dùng này?"
                    description="Hành động này không thể hoàn tác!"
                    onConfirm={async () => {
                        try {
                            await userService.deleteUser(record._id);
                            message.success('Đã xóa');
                            actionRef.current?.reload();
                        } catch { message.error('Xóa thất bại'); }
                    }}
                    okButtonProps={{ danger: true }}
                >
                    <Tooltip title="Xóa">
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                </Popconfirm>
            ]
        }
    ];

    return (
        <PageContainer>
            <ProTable<User>
                headerTitle="Danh sách người dùng"
                actionRef={actionRef}
                rowKey="_id"
                search={{
                    labelWidth: 'auto',
                    defaultCollapsed: false,
                }}
                toolBarRender={() => [
                    <Button
                        key="create"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => {
                            setCurrentRow(null);
                            form.resetFields(); // Xóa sạch form cũ
                            setModalVisible(true);
                        }}
                    >
                        Thêm người dùng
                    </Button>,
                ]}
                request={async (params, sort) => {
                    let sortString = undefined;
                    const sortKey = Object.keys(sort)[0];
                    if (sortKey) sortString = `${sort[sortKey] === 'descend' ? '-' : ''}${sortKey}`;

                    const res = await userService.getUsers({
                        page: params.current,
                        limit: params.pageSize,
                        q: params.username || params.email, // Search chung 1 ô hoặc tách riêng tùy ý
                        sort: sortString,
                    });
                    return {
                        data: res.data,
                        success: true,
                        total: res.total,
                    };
                }}
                columns={columns}
                pagination={{ pageSize: 10 }}
            />

            {/* MODAL FORM */}
            <ModalForm
                title={currentRow ? 'Cập nhật thông tin' : 'Thêm người dùng mới'}
                open={modalVisible}
                onOpenChange={setModalVisible}
                form={form}
                onFinish={handleFinish}
                modalProps={{ destroyOnClose: true }}
                width={500}
            >
                <ProFormText
                    name="username"
                    label="Tên hiển thị"
                    placeholder="Nhập tên hiển thị"
                    // Mẹo: Tắt rule required của Antd đi để Zod lo việc validate
                    // Hoặc giữ cả 2 để UX tốt hơn (hiện dấu sao đỏ)
                    required
                />

                <ProFormText
                    name="email"
                    label="Email"
                    placeholder="example@email.com"
                    disabled={!!currentRow} // Không cho sửa email khi edit
                    required
                />

                <ProFormText.Password
                    name="password"
                    label={currentRow ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu"}
                    placeholder={currentRow ? "Nhập mật khẩu mới..." : "Nhập mật khẩu..."}
                    required={!currentRow} // Bắt buộc khi tạo mới
                />

                <ProFormSelect
                    name="role"
                    label="Phân quyền"
                    options={[
                        { label: 'Admin (Quản trị viên)', value: 'admin' },
                        { label: 'User (Người dùng)', value: 'user' },
                    ]}
                    required
                    initialValue="user"
                    allowClear={false}
                />
            </ModalForm>
        </PageContainer>
    );
}