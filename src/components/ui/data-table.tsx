"use client";

import * as React from "react";
import {
  columnSizingFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef,
  type Header,
  type PaginationState,
  type Row,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Inbox,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InputOption, type OptionItem } from "@/components/ui/input-option";
import { Scrollable } from "@/components/ui/scrollable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableActionButton } from "@/components/ui/data-table-actions";

export interface DataTableColumnMeta {
  headerClassName?: string;
  cellClassName?: string;
}

const emptyColumnMeta: DataTableColumnMeta = {};

export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnSizingFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  columnMeta: emptyColumnMeta,
});

export type DataTableFeatures = typeof dataTableFeatures;

export type DataTableColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<DataTableFeatures, TData, TValue>;

export interface DataTableServerPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface DataTableProps<TData extends RowData> {
  columns: DataTableColumnDef<TData>[];
  data: TData[];
  getRowId?: (row: TData, index: number) => string;
  isLoading?: boolean;
  skeletonRows?: number;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  enableSearch?: boolean;
  filterContent?: React.ReactNode;
  toolbarRight?: React.ReactNode;
  serverPagination?: DataTableServerPagination;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  showActionColumn?: boolean;
  actionColumnHeader?: string;
  onView?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  renderActions?: (row: TData) => React.ReactNode;
  onRowClick?: (row: TData) => void;
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function buildPageNumbers(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  if (start > 2) pages.push("ellipsis");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < totalPages - 1) pages.push("ellipsis");
  pages.push(totalPages);
  return pages;
}

function rowMatchesLocalSearch(row: unknown, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (typeof row !== "object" || row === null) {
    return typeof row === "string" || typeof row === "number"
      ? String(row).toLowerCase().includes(q)
      : false;
  }
  return Object.values(row as Record<string, unknown>).some((val) => {
    if (val === null || val === undefined) return false;
    if (
      typeof val === "string" ||
      typeof val === "number" ||
      typeof val === "boolean"
    ) {
      return String(val).toLowerCase().includes(q);
    }
    if (
      typeof val === "object" &&
      "name" in val &&
      typeof (val as { name?: unknown }).name === "string"
    ) {
      return (val as { name: string }).name.toLowerCase().includes(q);
    }
    return false;
  });
}

function getSortDirectionIcon(sorted: false | "asc" | "desc"): React.ReactNode {
  if (sorted === "asc") {
    return <ArrowUp className="h-3.5 w-3.5 text-primary" />;
  }
  if (sorted === "desc") {
    return <ArrowDown className="h-3.5 w-3.5 text-primary" />;
  }
  return (
    <ArrowUpDown className="h-3.5 w-3.5 text-slate-300 transition-colors group-hover:text-slate-500" />
  );
}

interface DataTableToolbarProps {
  showSearch: boolean;
  search: string;
  searchPlaceholder: string;
  onSearchChange: (val: string) => void;
  filterContent?: React.ReactNode;
  toolbarRight?: React.ReactNode;
  totalItems: number;
}

function DataTableToolbar({
  showSearch,
  search,
  searchPlaceholder,
  onSearchChange,
  filterContent,
  toolbarRight,
  totalItems,
}: DataTableToolbarProps): React.JSX.Element | null {
  if (!showSearch && !filterContent && !toolbarRight) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {showSearch && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                onSearchChange(e.target.value);
              }}
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/60 pr-8 pl-9 text-xs text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/20"
            />
            {search.length > 0 && (
              <button
                type="button"
                aria-label="Hapus pencarian"
                onClick={() => {
                  onSearchChange("");
                }}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
        {filterContent}
      </div>

      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
        {toolbarRight}
        <span className="inline-flex h-7 items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-semibold text-slate-600 tabular-nums">
          Total: {totalItems}
        </span>
      </div>
    </div>
  );
}

function SortableHeaderContent<TData extends RowData>({
  header,
  renderHeader,
}: {
  header: Header<DataTableFeatures, TData>;
  renderHeader: (header: Header<DataTableFeatures, TData>) => React.ReactNode;
}): React.JSX.Element | null {
  if (header.isPlaceholder) {
    return null;
  }
  const canSort = header.column.getCanSort();
  if (!canSort) {
    return <span>{renderHeader(header)}</span>;
  }
  const sorted = header.column.getIsSorted();
  return (
    <button
      type="button"
      onClick={header.column.getToggleSortingHandler()}
      className="group inline-flex cursor-pointer items-center gap-1.5 text-left font-bold tracking-wider uppercase transition-colors hover:text-slate-900"
    >
      <span>{renderHeader(header)}</span>
      {getSortDirectionIcon(sorted)}
    </button>
  );
}

interface DataTableRowActionsProps<TData extends RowData> {
  row: TData;
  onView?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  renderActions?: (row: TData) => React.ReactNode;
}

function DataTableRowActions<TData extends RowData>({
  row,
  onView,
  onEdit,
  onDelete,
  renderActions,
}: DataTableRowActionsProps<TData>): React.JSX.Element {
  return (
    <div className="flex items-center justify-end gap-1">
      {renderActions?.(row)}
      {onView && (
        <DataTableActionButton
          variant="view"
          label="Lihat Detail"
          icon={<Eye className="h-4 w-4" />}
          onClick={() => {
            onView(row);
          }}
        />
      )}
      {onEdit && (
        <DataTableActionButton
          variant="edit"
          label="Edit Data"
          icon={<Pencil className="h-4 w-4" />}
          onClick={() => {
            onEdit(row);
          }}
        />
      )}
      {onDelete && (
        <DataTableActionButton
          variant="delete"
          label="Hapus Data"
          icon={<Trash2 className="h-4 w-4" />}
          onClick={() => {
            onDelete(row);
          }}
        />
      )}
    </div>
  );
}

interface DataTablePaginationFooterProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

function DataTablePaginationFooter({
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationFooterProps): React.JSX.Element | null {
  if (totalItems === 0 && totalPages <= 1) {
    return null;
  }

  const safeTotalPages = Math.max(1, totalPages);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const pages = buildPageNumbers(currentPage, safeTotalPages);
  const sizeOptions: OptionItem[] = pageSizeOptions.map((opt) => ({
    value: String(opt),
    label: `${opt} baris`,
  }));

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="tabular-nums">
          Menampilkan{" "}
          <strong className="font-semibold text-slate-800">
            {startItem}–{endItem}
          </strong>{" "}
          dari <strong className="font-semibold text-slate-800">{totalItems}</strong> data
        </span>
        {onPageSizeChange && (
          <div className="w-28">
            <InputOption
              size="sm"
              searchable={false}
              value={String(pageSize)}
              options={sizeOptions}
              onValueChange={(val) => {
                const parsed = Number.parseInt(val, 10);
                if (!Number.isNaN(parsed)) onPageSizeChange(parsed);
              }}
            />
          </div>
        )}
      </div>

      {safeTotalPages > 1 && (
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => {
              onPageChange(currentPage - 1);
            }}
            aria-label="Halaman sebelumnya"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pages.map((p, idx) =>
            p === "ellipsis" ? (
              <span
                key={`ellipsis-${idx}`}
                className="inline-flex size-8 items-center justify-center text-xs text-slate-400"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => {
                  onPageChange(p);
                }}
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition-colors",
                  p === currentPage
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            disabled={currentPage >= safeTotalPages}
            onClick={() => {
              onPageChange(currentPage + 1);
            }}
            aria-label="Halaman berikutnya"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  isLoading = false,
  skeletonRows = 5,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari data...",
  enableSearch,
  filterContent,
  toolbarRight,
  serverPagination,
  defaultPageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  showActionColumn = true,
  actionColumnHeader = "Aksi",
  onView,
  onEdit,
  onDelete,
  renderActions,
  onRowClick,
  emptyIcon,
  emptyTitle = "Belum ada data",
  emptyDescription = "Data akan tampil di sini setelah ditambahkan.",
  className,
}: DataTableProps<TData>): React.JSX.Element {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [localSearch, setLocalSearch] = React.useState("");
  const [clientPagination, setClientPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const isControlledSearch = searchValue !== undefined && onSearchChange !== undefined;
  const activeSearch = isControlledSearch ? searchValue : localSearch;
  const showSearch = enableSearch ?? isControlledSearch;

  const filteredData = React.useMemo(() => {
    if (isControlledSearch || !showSearch || activeSearch.trim() === "") {
      return data;
    }
    return data.filter((row) => rowMatchesLocalSearch(row, activeSearch));
  }, [data, isControlledSearch, showSearch, activeSearch]);

  const isManualPagination = serverPagination !== undefined;
  const effectivePagination: PaginationState = isManualPagination
    ? {
        pageIndex: Math.max(0, serverPagination.page - 1),
        pageSize: serverPagination.pageSize,
      }
    : clientPagination;

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data: filteredData,
    getRowId,
    manualPagination: isManualPagination,
    pageCount: isManualPagination ? serverPagination.totalPages : undefined,
    rowCount: isManualPagination ? serverPagination.totalItems : undefined,
    state: {
      sorting,
      pagination: effectivePagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(effectivePagination) : updater;
      if (isManualPagination) {
        if (next.pageIndex !== effectivePagination.pageIndex) {
          serverPagination.onPageChange(next.pageIndex + 1);
        }
        if (next.pageSize !== effectivePagination.pageSize) {
          serverPagination.onPageSizeChange?.(next.pageSize);
        }
      } else {
        setClientPagination(next);
      }
    },
  });

  const hasActions =
    showActionColumn && Boolean(onView ?? onEdit ?? onDelete ?? renderActions);

  const headerGroups = table.getHeaderGroups();
  const rows: Row<DataTableFeatures, TData>[] = table.getRowModel().rows;
  const colSpan = columns.length + (hasActions ? 1 : 0);

  const handleSearchUpdate = (nextSearch: string): void => {
    if (isControlledSearch) {
      onSearchChange(nextSearch);
    } else {
      setLocalSearch(nextSearch);
      setClientPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  };

  const totalItems = isManualPagination
    ? serverPagination.totalItems
    : filteredData.length;
  const totalPages = isManualPagination
    ? serverPagination.totalPages
    : Math.max(1, table.getPageCount());
  const currentPage = isManualPagination
    ? serverPagination.page
    : clientPagination.pageIndex + 1;
  const activePageSize = effectivePagination.pageSize;

  let tableBodyContent: React.ReactNode;
  if (isLoading) {
    tableBodyContent = Array.from({ length: skeletonRows }, (_, rowIdx) => (
      <TableRow key={`skeleton-${rowIdx}`} className="hover:bg-transparent">
        {Array.from({ length: colSpan }, (_, cellIdx) => (
          <TableCell key={`skel-cell-${cellIdx}`}>
            <div className="h-4 w-full max-w-[180px] animate-pulse rounded-md bg-slate-100" />
          </TableCell>
        ))}
      </TableRow>
    ));
  } else if (rows.length === 0) {
    tableBodyContent = (
      <TableRow className="hover:bg-transparent">
        <TableCell colSpan={colSpan} className="py-14 text-center">
          <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              {emptyIcon ?? <Inbox className="h-5 w-5" />}
            </div>
            <p className="text-sm font-semibold text-slate-800">{emptyTitle}</p>
            <p className="text-xs text-slate-500">{emptyDescription}</p>
          </div>
        </TableCell>
      </TableRow>
    );
  } else {
    tableBodyContent = rows.map((row) => (
      <TableRow
        key={row.id}
        onClick={
          onRowClick
            ? () => {
                onRowClick(row.original);
              }
            : undefined
        }
        className={cn("group", onRowClick && "cursor-pointer")}
      >
        {row.getAllCells().map((cell) => {
          const meta = cell.column.columnDef.meta;
          return (
            <TableCell key={cell.id} className={meta?.cellClassName}>
              <table.FlexRender cell={cell} />
            </TableCell>
          );
        })}
        {hasActions && (
          <TableCell className="sticky right-0 z-10 bg-white shadow-[-6px_0_12px_-6px_rgba(15,23,42,0.08)] transition-colors group-hover:bg-slate-50">
            <DataTableRowActions
              row={row.original}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              renderActions={renderActions}
            />
          </TableCell>
        )}
      </TableRow>
    ));
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs",
        className
      )}
    >
      <DataTableToolbar
        showSearch={showSearch}
        search={activeSearch}
        searchPlaceholder={searchPlaceholder}
        onSearchChange={handleSearchUpdate}
        filterContent={filterContent}
        toolbarRight={toolbarRight}
        totalItems={totalItems}
      />

      <Scrollable orientation="horizontal">
        <Table>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  return (
                    <TableHead key={header.id} className={meta?.headerClassName}>
                      <SortableHeaderContent
                        header={header}
                        renderHeader={(h) => <table.FlexRender header={h} />}
                      />
                    </TableHead>
                  );
                })}
                {hasActions && (
                  <TableHead className="sticky right-0 z-10 w-28 bg-slate-50/95 text-right shadow-[-6px_0_12px_-6px_rgba(15,23,42,0.08)]">
                    {actionColumnHeader}
                  </TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>{tableBodyContent}</TableBody>
        </Table>
      </Scrollable>

      <DataTablePaginationFooter
        currentPage={currentPage}
        pageSize={activePageSize}
        totalItems={totalItems}
        totalPages={totalPages}
        pageSizeOptions={pageSizeOptions}
        onPageChange={(nextPage) => {
          if (isManualPagination) {
            serverPagination.onPageChange(nextPage);
          } else {
            table.setPageIndex(nextPage - 1);
          }
        }}
        onPageSizeChange={
          isManualPagination
            ? serverPagination.onPageSizeChange
            : (nextSize) => {
                setClientPagination({ pageIndex: 0, pageSize: nextSize });
              }
        }
      />
    </div>
  );
}
