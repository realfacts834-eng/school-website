"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Loader2, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// ==========================================
// Types
// ==========================================
interface SearchInputProps {
  placeholder?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "minimal" | "expanded";
  onSearch?: (query: string) => void;
  suggestions?: string[];
  recentSearches?: string[];
  loading?: boolean;
}

// ==========================================
// SearchInput Component
// ==========================================
export function SearchInput({
  placeholder = "Search...",
  className,
  size = "default",
  variant = "default",
  onSearch,
  suggestions = [],
  recentSearches = [],
  loading = false,
}: SearchInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedValue = useDebounce(value, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Filter suggestions based on input
  const filteredSuggestions = value.trim()
    ? suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
    : recentSearches;

  const showDropdown = focused && showSuggestions && filteredSuggestions.length > 0;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1
          );
          break;
        case "Enter":
          if (selectedIndex >= 0) {
            e.preventDefault();
            const selected = filteredSuggestions[selectedIndex];
            handleSelect(selected);
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          inputRef.current?.blur();
          break;
      }
    },
    [showDropdown, selectedIndex, filteredSuggestions]
  );

  // Handle suggestion selection
  const handleSelect = (query: string) => {
    setValue(query);
    setShowSuggestions(false);
    onSearch?.(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    
    // Save to recent searches
    const saved = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    const updated = [query, ...saved.filter((s: string) => s !== query)].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      handleSelect(value.trim());
    }
  };

  // Clear input
  const handleClear = () => {
    setValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Size classes
  const sizeClasses = {
    sm: "h-8 text-xs",
    default: "h-10 text-sm",
    lg: "h-12 text-base",
  };

  // Variant classes
  const variantClasses = {
    default: "bg-background border-border",
    minimal: "bg-muted/50 border-transparent focus-within:border-border focus-within:bg-background",
    expanded: "bg-background border-border shadow-lg",
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          {/* Search Icon */}
          <Search
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
              size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
            )}
          />

          {/* Input */}
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setShowSuggestions(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              setFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "pl-9",
              value && "pr-16",
              sizeClasses[size],
              variantClasses[variant],
              "transition-all duration-200"
            )}
          />

          {/* Right Actions */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Loading */}
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}

            {/* Clear Button */}
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded hover:bg-muted transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}

            {/* Submit Button */}
            {value && (
              <button
                type="submit"
                className="p-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                aria-label="Search"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSelect(suggestion)}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors",
                "hover:bg-muted/50",
                index === selectedIndex && "bg-muted"
              )}
            >
              {value.trim() ? (
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              ) : (
                <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              )}
              <span className="truncate">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}