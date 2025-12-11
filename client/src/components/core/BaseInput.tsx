import { Input, InputProps } from 'antd';

// 1. Input thường
export const BaseInput = (props: InputProps) => {
    return <Input {...props} />;
};

export const BasePasswordInput = (props: InputProps) => {
    return <Input.Password {...props} />;
};