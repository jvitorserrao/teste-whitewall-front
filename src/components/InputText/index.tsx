import { Input } from 'antd';
import './styles.css';

interface InputTextProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    style?: React.CSSProperties;
    className?: string;
}

export function InputText({
    value,
    onChange,
    placeholder = "default",
    style,
    className, 
}: InputTextProps) {
    return (
        <Input
            className={className}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={style}
        />
    );
}
