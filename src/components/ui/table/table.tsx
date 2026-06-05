import {
  useState,
  useEffect,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
} from "react";

//Utils
import { cn } from "src/utils/utils";

const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  ),
);
Table.displayName = "Table";

type SortOrder = "ASC" | "DESC";

export type HeaderColumn<T = Record<string, unknown>> = {
  header: string;
  accessor: keyof T | string;
  key?: string;
  isSort?: boolean;
  isShow?: boolean;
  headerContent?: (column: HeaderColumn<T>) => ReactNode;
};

type TableHeaderProps<T = Record<string, unknown>> =
  HTMLAttributes<HTMLTableSectionElement> & {
    columns?: HeaderColumn<T>[];
    onSort?: (column: string, order: SortOrder) => void;
    sortColumn?: string;
    sortOrder?: SortOrder;
    languageData?: Record<string, string>;
    defaultColumnWidth?: number;
  };

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  (
    {
      className,
      columns,
      onSort,
      sortColumn,
      sortOrder = "DESC",
      languageData,
      defaultColumnWidth = 400,
      children,
      ...props
    },
    ref,
  ) => {
    const [columnsWidth, setColumnsWidth] = useState<Record<string, number>>(
      {},
    );

    useEffect(() => {
      if (!columns || columns.length === 0) return;
      const widths: Record<string, number> = {};
      columns.forEach((item) => {
        widths[String(item.accessor)] = defaultColumnWidth;
      });
      setColumnsWidth(widths);
    }, [columns, defaultColumnWidth]);

    const raiseSort = (column: string, isSort?: boolean) => {
      if (!onSort) return;
      if (isSort === false) return;

      const reverse = sortColumn === column;
      let order: SortOrder = "DESC";
      if (reverse) {
        order = sortOrder === "DESC" ? "ASC" : "DESC";
      }

      onSort(column, order);
    };

    const renderSortIcon = (column: HeaderColumn) => {
      if (column.isSort === false || String(column.accessor) !== sortColumn) {
        return null;
      }
      return sortOrder === "ASC" ? (
        <span className="ms-2 caret-icon">▲</span>
      ) : (
        <span className="ms-2 caret-icon">▼</span>
      );
    };

    const renderCell = (column: HeaderColumn) => {
      if (column.headerContent) return column.headerContent(column);
      const label = languageData?.[column.header] ?? column.header;
      return (
        <>
          <span>{label}</span>
          {renderSortIcon(column)}
        </>
      );
    };

    if (!columns) {
      return (
        <thead
          ref={ref}
          className={cn("[&_tr]:border-b", className)}
          {...props}>
          {children}
        </thead>
      );
    }

    if (columns.length === 0) return null;

    return (
      <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props}>
        <tr className="bg-muted/40">
          {columns.map((column, index) => {
            if (column.isShow === false) return null;

            const accessor = String(column.accessor);
            const canSort = column.isSort !== false;

            return (
              <th
                key={(accessor || column.key || "col") + index}
                className="h-12 px-4 text-left align-middle text-sm font-medium text-muted-foreground"
                style={
                  canSort
                    ? {
                        color: "#217CDC",
                        cursor: "pointer",
                        width: columnsWidth[accessor],
                      }
                    : { width: columnsWidth[accessor] }
                }
                onClick={() => raiseSort(accessor, column.isSort)}
                onMouseDown={(e) =>
                  setColumnsWidth((prev) => ({
                    ...prev,
                    [accessor]: e.clientX,
                  }))
                }>
                {renderCell(column)}
              </th>
            );
          })}
        </tr>
      </thead>
    );
  },
);
TableHeader.displayName = "TableHeader";

export type BodyColumn<T = Record<string, unknown>> = {
  accessor: keyof T | string;
  key?: string;
  isShow?: boolean;
  content?: (item: T, rowIndex: number) => ReactNode;
};

type TableBodyProps<T = Record<string, unknown>> =
  HTMLAttributes<HTMLTableSectionElement> & {
    columns?: BodyColumn<T>[];
    rows?: T[];
    isLoad?: boolean;
    isShowTotalCountRow?: boolean;
    isShowHeader?: boolean;
    loadingContent?: ReactNode;
    emptyContent?: ReactNode;
  };
const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  (
    {
      className,
      columns,
      rows,
      isLoad = false,
      isShowTotalCountRow = false,
      isShowHeader = true,
      loadingContent,
      emptyContent = "No Data",
      children,
      ...props
    },
    ref,
  ) => {
    // Keep backward compatibility for existing usage:
    // <TableBody>...children rows...</TableBody>
    if (!columns || !rows) {
      return (
        <tbody
          ref={ref}
          className={cn("[&_tr:last-child]:border-0", className)}
          {...props}>
          {children}
        </tbody>
      );
    }

    const visibleColumns = columns.filter((column) => column.isShow !== false);
    const colSpanCount = Math.max(visibleColumns.length, 1);

    const renderCell = (
      item: Record<string, unknown>,
      column: BodyColumn,
      rowIndex: number,
    ): ReactNode => {
      if (column.content) return column.content(item, rowIndex);
      return item[String(column.accessor)] as ReactNode;
    };

    if (isLoad) {
      return (
        <tbody
          ref={ref}
          className={cn("[&_tr:last-child]:border-0", className)}
          {...props}>
          <tr>
            <th
              scope="row"
              className="border-0 px-4 py-3 text-left text-sm text-muted-foreground"
              colSpan={colSpanCount}>
              {loadingContent ?? "Loading..."}
            </th>
          </tr>
        </tbody>
      );
    }

    if (rows.length === 0) {
      return (
        <tbody
          ref={ref}
          className={cn("[&_tr:last-child]:border-0", className)}
          {...props}>
          <tr>
            <td
              colSpan={colSpanCount}
              className="px-4 py-3 text-left text-sm text-muted-foreground">
              {emptyContent}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}>
        {rows.map((item, rowIndex) => (
          <tr key={rowIndex} className="total-count">
            {visibleColumns.map((column, columnIndex) => (
              <td
                key={
                  (String(column.accessor) || column.key || "col") + columnIndex
                }
                colSpan={!isShowHeader && columnIndex === 0 ? 2 : undefined}
                className={cn(
                  "px-4 py-3 text-left align-middle text-sm text-foreground",
                  isShowTotalCountRow && rowIndex === rows.length - 1
                    ? "total-count-row"
                    : "",
                )}>
                <span className="block">
                  {renderCell(
                    item as Record<string, unknown>,
                    column,
                    rowIndex,
                  )}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  },
);
TableBody.displayName = "TableBody";

const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-border transition-colors",
      "hover:bg-muted/50",
      "data-[state=selected]:bg-muted",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = forwardRef<
  HTMLTableCellElement,
  ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle text-sm font-medium text-muted-foreground",
      "[&:has([role=checkbox])]:pr-0",
      "*:[[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = forwardRef<
  HTMLTableCellElement,
  TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 text-left align-middle text-sm text-foreground",
      "[&:has([role=checkbox])]:pr-0",
      "*:[[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
