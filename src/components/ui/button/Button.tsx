import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
  variant?:
    | "primary"
    | "outline"
    | "success"
    | "danger"
    | "warning"
    | "ghost"
    | "text"; // ✅ Tambahan
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    xxs: "px-2 py-1 text-[10px]", // super kecil
    xs: "px-3 py-1.5 text-xs", // sangat kecil
    sm: "px-4 py-2 text-sm", // kecil
    md: "px-5 py-3 text-sm", // sedang (default)
    lg: "px-6 py-3.5 text-base", // besar
    xl: "px-7 py-4 text-lg", // sangat besar
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    success: "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
    warning:
      "bg-yellow-500 text-white hover:bg-yellow-600 disabled:bg-yellow-300",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
    text: "bg-transparent text-brand-500 hover:underline hover:text-brand-600 disabled:text-gray-400",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
