import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from "lucide-react";

// ==========================================
// Table Component
// ==========================================
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { containerClassName?: string }
>(({ className, containerClassName, ...props }, ref) => (
  <div className={cn("w-full overflow-auto rounded-lg border", containerClassName)}>
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

// ==========================================
// Table Header
// ==========================================
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-muted/50 [&_tr]:border-b",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

// ==========================================
// Table Body
// ==========================================
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "[&_tr:last-child]:border-0",
      className
    )}
    {...props}
  />
));
TableBody.displayName = "TableBody";

// ==========================================
// Table Footer
// ==========================================
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

// ==========================================
// Table Row
// ==========================================
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { isSelected?: boolean }
>(({ className, isSelected, ...props }, ref) => (
  <tr
    ref={ref}
    data-state={isSelected ? "selected" : undefined}
    className={cn(
      "border-b transition-colors",
      "hover:bg-muted/50",
      "data-[state=selected]:bg-school-blue/5 data-[state=selected]:border-school-blue/20",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

// ==========================================
// Table Head (with Sort)
// ==========================================
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | false;
  onSort?: () => void;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sortDirection, onSort, children, ...props }, ref) => {
    const SortIcon = sortDirection === "asc" 
      ? ChevronUp 
      : sortDirection === "desc" 
        ? ChevronDown 
        : ChevronsUpDown;

    return (
      <th
        ref={ref}
        className={cn(
          "h-12 px-4 text-left align-middle font-semibold text-muted-foreground",
          "[&:has([role=checkbox])]:pr-0",
          sortable && "cursor-pointer select-none hover:text-foreground transition-colors",
          sortable && sortDirection && "text-foreground",
          className
        )}
        onClick={sortable ? onSort : undefined}
        aria-sort={
          sortDirection === "asc"
            ? "ascending"
            : sortDirection === "desc"
              ? "descending"
              : sortable
                ? "none"
                : undefined
        }
        {...props}
      >
        <div className="flex items-center gap-1">
          {children}
          {sortable && (
            <SortIcon
              className={cn(
                "h-4 w-4",
                sortDirection ? "text-school-blue" : "text-muted-foreground/50"
              )}
            />
          )}
        </div>
      </th>
    );
  }
);
TableHead.displayName = "TableHead";

// ==========================================
// Table Cell
// ==========================================
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0",
      "text-foreground",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

// ==========================================
// Table Caption
// ==========================================
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// ==========================================
// Table Empty State
// ==========================================
interface TableEmptyProps {
  colSpan: number;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

function TableEmpty({
  colSpan,
  message = "No data found",
  icon,
  action,
}: TableEmptyProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          {icon || (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
          )}
          <p className="text-sm text-muted-foreground font-medium">{message}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ==========================================
// Table Loading State
// ==========================================
function TableLoading({ colSpan, rows = 5 }: { colSpan: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: colSpan }).map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 bg-muted rounded animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ==========================================
// Table Pagination
// ==========================================
interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={cn("flex items-center justify-between px-4 py-3 border-t", className)}>
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> results
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 text-sm rounded border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={cn(
              "px-3 py-1 text-sm rounded transition-colors",
              currentPage === i + 1
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 text-sm rounded border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableEmpty,
  TableLoading,
  TablePagination,
};