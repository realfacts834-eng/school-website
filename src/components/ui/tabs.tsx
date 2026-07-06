"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// Tabs Props
// ==========================================
interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
  variant?: "underline" | "pills" | "boxed";
  size?: "sm" | "default" | "lg";
  fullWidth?: boolean;
}

// ==========================================
// Variant Classes
// ==========================================
const variantClasses = {
  underline: {
    container: "flex gap-0 border-b border-border",
    tab: "border-b-2 -mb-px",
    active: "border-primary text-primary",
    inactive: "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
  },
  pills: {
    container: "flex gap-1 p-1 bg-muted rounded-lg",
    tab: "rounded-md",
    active: "bg-background text-foreground shadow-sm",
    inactive: "text-muted-foreground hover:text-foreground",
  },
  boxed: {
    container: "flex gap-0",
    tab: "border border-border first:rounded-l-lg last:rounded-r-lg",
    active: "bg-primary text-primary-foreground border-primary",
    inactive: "bg-background text-muted-foreground hover:bg-muted/50",
  },
};

const sizeClasses = {
  sm: "px-2.5 py-1.5 text-xs",
  default: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

// ==========================================
// Tabs Component
// ==========================================
export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  className,
  variant = "underline",
  size = "default",
  fullWidth = false,
}: TabsProps) {
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 });
  const tabsRef = React.useRef<HTMLDivElement>(null);

  // Update indicator position
  React.useEffect(() => {
    if (variant === "underline" && tabsRef.current) {
      const activeElement = tabsRef.current.querySelector(`[data-tab="${activeTab}"]`);
      if (activeElement instanceof HTMLElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
      }
    }
  }, [activeTab, variant]);

  const styles = variantClasses[variant];

  return (
    <div className="relative">
      <div
        ref={tabsRef}
        className={cn(
          styles.container,
          "overflow-x-auto scrollbar-none",
          fullWidth && "[&>*]:flex-1",
          className
        )}
        role="tablist"
        aria-orientation="horizontal"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-disabled={tab.disabled}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={cn(
              "relative flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-blue focus-visible:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              sizeClasses[size],
              styles.tab,
              activeTab === tab.id ? styles.active : styles.inactive,
              fullWidth && "flex-1"
            )}
          >
            {/* Icon */}
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}

            {/* Label */}
            <span>{tab.label}</span>

            {/* Badge */}
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold",
                  activeTab === tab.id
                    ? "bg-primary/20 text-primary"
                    : "bg-muted-foreground/20 text-muted-foreground"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active Indicator (underline variant) */}
      {variant === "underline" && (
        <div
          className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out rounded-full"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />
      )}
    </div>
  );
}

// ==========================================
// Tab Content with Animation
// ==========================================
interface TabContentProps {
  activeTab: string;
  tabId: string;
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function TabContent({
  activeTab,
  tabId,
  children,
  className,
  animate = true,
}: TabContentProps) {
  return (
    <AnimatePresence mode="wait">
      {activeTab === tabId && (
        <motion.div
          key={tabId}
          initial={animate ? { opacity: 0, y: 8 } : false}
          animate={animate ? { opacity: 1, y: 0 } : false}
          exit={animate ? { opacity: 0, y: -8 } : false}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn("pt-4", className)}
          role="tabpanel"
          aria-labelledby={tabId}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// Tabs Container (Full Component)
// ==========================================
interface TabsContainerProps extends TabsProps {
  children: React.ReactNode;
  tabsClassName?: string;
}

export function TabsContainer({
  tabs,
  activeTab,
  onTabChange,
  children,
  variant,
  size,
  fullWidth,
  className,
  tabsClassName,
}: TabsContainerProps) {
  return (
    <div className={className}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        className={tabsClassName}
      />
      <div className="mt-4">{children}</div>
    </div>
  );
}