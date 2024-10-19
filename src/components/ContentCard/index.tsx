import { Card } from "antd";
import "./styles.css";

interface CardProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
}

export function ContentCard({ style, children, className }: CardProps) {
  return (
    <Card className={`custom-button ${className}`} 
    style={style}>
      {children}
    </Card>
  );
}
