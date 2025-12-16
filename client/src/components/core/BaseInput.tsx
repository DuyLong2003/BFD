'use client';

import { Input } from 'antd';
import type { InputProps, TextAreaProps } from 'antd/es/input';
import { PasswordProps } from 'antd/es/input/Password';

// 1. Base input (text thường)
export const BaseInput = (props: InputProps) => {
    return (
        <Input
            {...props}
            className={`hover:border-blue-400 focus:border-blue-500 focus:shadow-none rounded-lg px-4 py-2 text-base transition-all duration-300 ${props.className}`}
        />
    );
};

// 2. Base password input (Mật khẩu)
export const BasePasswordInput = (props: PasswordProps) => {
    return (
        <Input.Password
            {...props}
            className={`hover:border-blue-400 focus-within:border-blue-500 focus-within:shadow-none rounded-lg px-4 py-2 text-base transition-all duration-300 ${props.className}`}
        />
    );
};

// 3. Base text area (Nhiều dòng)
export const BaseTextArea = (props: TextAreaProps) => {
    return (
        <Input.TextArea
            {...props}
            className={`hover:border-blue-400 focus:border-blue-500 focus:shadow-none rounded-lg px-4 py-3 text-base transition-all duration-300 ${props.className}`}
        />
    );
};