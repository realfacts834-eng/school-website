"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Eye, EyeOff, Search, X } from "lucide-react";

// ... baaki sab same hai ...

// ==========================================
// Input Props
// ==========================================
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  containerClassName?: string;
}

// ==========================================
// Input Component
// ==========================================
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      label,
      helperText,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      containerClassName,
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || React.useId();

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
            {props.required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Element */}
          <input
            id={inputId}
            type={inputType}
            value={value}
            onChange={onChange}
            className={cn(
              "flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm",
              "ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground",
              "transition-all duration-200",
              "disabled:cursor-not-allowed disabled:opacity-50",
              // Focus
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-blue focus-visible:ring-offset-2",
              // Icons padding
              leftIcon && "pl-10",
              (rightIcon || isPassword || clearable) && "pr-10",
              // Error state
              error
                ? "border-destructive focus-visible:ring-destructive"
                : "border-input hover:border-muted-foreground/30",
              className
            )}
            ref={ref}
            {...props}
          />

          {/* Right Section */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Password Toggle */}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Clear Button */}
            {clearable && value && (
              <button
                type="button"
                onClick={() => {
                  onClear?.();
                  // Create a synthetic change event
                  const event = {
                    target: { value: "" },
                  } as React.ChangeEvent<HTMLInputElement>;
                  onChange?.(event);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !isPassword && !(clearable && value) && (
              <span className="text-muted-foreground">{rightIcon}</span>
            )}
          </div>

          {/* Error Icon */}
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive pointer-events-none">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// ==========================================
// Search Input
// ==========================================
interface SearchInputProps extends InputProps {
  onSearch?: (value: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={<Search className="h-4 w-4" />}
        clearable
        placeholder="Search..."
        className={cn("pl-10", className)}
        onChange={(e) => {
          props.onChange?.(e);
          onSearch?.(e.target.value);
        }}
        {...props}
      />
    );
  }
);
SearchInput.displayName = "SearchInput";

// ==========================================
// Textarea
// ==========================================
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const textareaId = id || React.useId();

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-foreground"
          >
            {label}
            {props.required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border bg-background px-3 py-2 text-sm",
            "ring-offset-background",
            "placeholder:text-muted-foreground",
            "transition-all duration-200",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-blue focus-visible:ring-offset-2",
            error
              ? "border-destructive focus-visible:ring-destructive"
              : "border-input hover:border-muted-foreground/30",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Input, SearchInput, Textarea };