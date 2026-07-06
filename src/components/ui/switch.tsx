"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ==========================================
// Switch Props
// ==========================================
interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
  label?: string;
  description?: string;
  id?: string;
  required?: boolean;
  name?: string;
}

// ==========================================
// Size Classes
// ==========================================
const sizeClasses = {
  sm: {
    track: "h-5 w-9",
    thumb: "h-4 w-4",
    translate: "translate-x-4",
  },
  default: {
    track: "h-6 w-11",
    thumb: "h-5 w-5",
    translate: "translate-x-5",
  },
  lg: {
    track: "h-7 w-14",
    thumb: "h-6 w-6",
    translate: "translate-x-7",
  },
};

// ==========================================
// Switch Component
// ==========================================
export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  size = "default",
  label,
  description,
  id,
  required = false,
  name,
}: SwitchProps) {
  const switchId = id || React.useId();
  const sizes = sizeClasses[size];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) {
        onCheckedChange(!checked);
      }
    }
  };

  const switchButton = (
    <button
      type="button"
      role="switch"
      id={switchId}
      aria-checked={checked}
      aria-required={required}
      disabled={disabled}
      name={name}
      onClick={() => onCheckedChange(!checked)}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
        "border-2 border-transparent",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked
          ? "bg-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]"
          : "bg-muted hover:bg-muted/80",
        disabled && "opacity-50 cursor-not-allowed",
        sizes.track,
        className
      )}
    >
      {/* Thumb */}
      <span
        className={cn(
          "pointer-events-none inline-block rounded-full bg-white shadow-md",
          "transform ring-0 transition-all duration-300 ease-out",
          checked ? sizes.translate : "translate-x-0.5",
          checked && "shadow-lg",
          sizes.thumb
        )}
      />

      {/* Check/Uncheck icon */}
      <span
        className={cn(
          "absolute transition-opacity duration-200",
          checked ? "opacity-100 left-1.5" : "opacity-0"
        )}
      >
        <svg
          className={cn("text-white", size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5")}
          viewBox="0 0 12 12"
          fill="currentColor"
        >
          <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
      </span>
    </button>
  );

  // If no label, return just the switch
  if (!label && !description) {
    return switchButton;
  }

  // With label
  return (
    <div className="flex items-start gap-3">
      {switchButton}
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={switchId}
            className={cn(
              "text-sm font-medium leading-none cursor-pointer select-none",
              disabled ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

// ==========================================
// Switch Group
// ==========================================
interface SwitchGroupProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SwitchGroup({
  label,
  description,
  children,
  className,
}: SwitchGroupProps) {
  return (
    <fieldset className={cn("space-y-3", className)}>
      <div>
        <legend className="text-sm font-medium text-foreground">{label}</legend>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </fieldset>
  );
}