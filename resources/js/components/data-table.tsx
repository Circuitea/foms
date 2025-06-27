"use client"

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Users } from "lucide-react" // Import Users component

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ReactNode } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  className?: string
  noData?: ReactNode,
}

export function DataTable<TData, TValue>({ columns, data, className, noData }: DataTableProps<TData, TValue>) {
  const safeData = Array.isArray(data) ? data : []
  const safeColumns = Array.isArray(columns) ? columns : []

  const table = useReactTable({
    data: safeData,
    columns: safeColumns,
    getCoreRowModel: getCoreRowModel(),
  })

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
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
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
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="even:bg-blue-50 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-4 px-6">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="">
              <TableCell colSpan={safeColumns.length} className="h-32 text-center">
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
    </div>
  )
}
