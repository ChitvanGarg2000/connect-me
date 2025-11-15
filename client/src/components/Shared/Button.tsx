import React, { ReactNode } from "react";
import { Button, ConfigProvider } from "antd";

interface ButtonProps {
  className?: string;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  title: string | ReactNode;
  disabled?: boolean;
}

const PrimaryButton: React.FC<ButtonProps> = ({
  className,
  type,
  onClick,
  title,
  disabled = false,
}) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultActiveBg: "rgb(220, 38, 38)",
            defaultHoverBg: "rgba(220, 38, 38)",
            textTextHoverColor: "#fff",
          },
        },
      }}
    >
      <Button
        className={className}
        htmlType={type}
        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
          if (type !== "submit") {
            e.preventDefault();
          }
          onClick?.();
        }}
        disabled={disabled}
      >
        {title}
      </Button>
    </ConfigProvider>
  );
};

export default PrimaryButton;
