import { Button } from "antd";
import './styles.css';
import { ButtonType } from "antd/es/button";
import React from "react";

interface BtnProps {
    onClick: () => void;
    children: React.ReactNode;
    type?: ButtonType;
    style?: React.CSSProperties; 
    className?: string; 
    loading?: boolean; 
}

export function Btn({ onClick, children, type = "default", style, className, loading }: BtnProps) {
    return (
        <Button
            className={`custom-button ${className}`}
            type={type}
            onClick={onClick}
            style={style}
            loading={loading} 
        >
            {children}
        </Button>
    );
}
