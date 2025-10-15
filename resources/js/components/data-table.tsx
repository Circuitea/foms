"use client"

import { type ColumnDef, flexRender, getCoreRowModel, getExpandedRowModel, getPaginationRowModel, getSortedRowModel, GroupingState, PaginationState, Row, RowSelectionState, SortingState, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dispatch, ReactNode, SetStateAction, useState } from "react"
import { Button } from "./ui/button";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  noData?: ReactNode;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  selectedRows?: RowSelectionState;
  setSelectedRows?: Dispatch<SetStateAction<RowSelectionState>>;
  defaultSorting?: SortingState;
}

export function DataTable<TData, TValue>({ columns, data, className, noData, selectedRows, setSelectedRows, getRowId, defaultSorting }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting ?? []);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});  


  const table = useReactTable({
    data,
    columns,

    getRowId,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    
    
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setSelectedRows ?? setRowSelection,

    state: {
      pagination,
      rowSelection: selectedRows ?? rowSelection,
      sorting,
    },

  });

  const pageSizeOptions = [5, 10, 20];

  const headerGroups = table.getHeaderGroups() || []
  const rows = table.getRowModel()?.rows || []

  return (
    <div className={className}>
      <Table className="[&_thead]:bg-[#1B2560] divide-y divide-gray-200">
        <TableHeader>
          {headerGroups.map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-0 hover:bg-[#1B2560]">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="px-6 py-3 text-xs font-medium text-center text-white uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) =>  (
              <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="even:bg-blue-50 border-b border-gray-100 hover:bg-gray-50 "  
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
            ))
          ) : (
            <TableRow className="">
              <TableCell colSpan={columns.length} className="h-32 text-center">
              {noData || (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="text-lg font-medium">No data found</p>
                  </div>
              )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between py-2">
        <div className="flex items-center gap-2">
          <Select value={table.getState().pagination.pageSize.toString()} onValueChange={newSize => table.setPageSize(Number(newSize))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              side="top"
              align="start"
              >
              {pageSizeOptions.map(option => (
                <SelectItem value={option.toString()}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>
        <div className="flex justify-center items-center gap-2">
          <Button
            disabled={!table.getCanPreviousPage()}
            variant="outline"
            className="w-5"
            onClick={table.firstPage}
          >
            <ChevronFirst />
          </Button>
          <Button
            disabled={!table.getCanPreviousPage()}
            variant="outline"
            className="w-5"
            onClick={table.previousPage}
          >
            <ChevronLeft />
          </Button>
          <Select
            value={table.getState().pagination.pageIndex.toString()}
            onValueChange={newPage => table.setPageIndex(Number(newPage))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array(table.getPageCount()).fill(null).map((_, i) => (
                <SelectItem key={i} value={i.toString()}>{i+1}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            disabled={!table.getCanNextPage()}
            variant="outline"
            className="w-5"
            onClick={table.nextPage}
          >
            <ChevronRight />
          </Button>
          <Button
            disabled={!table.getCanNextPage()}
            variant="outline"
            className="w-5"
            onClick={table.lastPage}
          >
            <ChevronLast />
          </Button>
        </div>
      </div>
    </div>
  )
}
