import { Button, ButtonProps } from 'antd';

interface BaseButtonProps extends ButtonProps {

}

export const BaseButton = (props: BaseButtonProps) => {
    const { style, ...rest } = props;

    return (
        <Button
            {...rest}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...style
            }}
        />
    );
};