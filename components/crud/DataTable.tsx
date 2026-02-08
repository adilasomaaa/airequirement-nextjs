"use client"

import { ColumnConfig, DataTableProps } from "@/client/types/crud.types"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

function formatValue<T>(value: any, column: ColumnConfig<T>, row: T): React.ReactNode {
  if (value === null || value === undefined) return "-"

  // Use renderCell if provided (preferred - receives full row)
  if (column.renderCell) {
    return column.renderCell(row)
  }

  // Use render if provided (legacy - receives value and row)
  if (column.render) {
    return column.render(value, row)
  }

  switch (column.type) {
    case "date":
      return new Date(value).toLocaleDateString("id-ID")
    case "datetime":
      return new Date(value).toLocaleString("id-ID")
    case "image":
      return value ? (
        <img src={value} alt="" className="h-10 w-10 rounded object-cover" />
      ) : "-"
    case "badge":
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
          {value}
        </span>
      )
    case "number":
      return typeof value === "number" ? value.toLocaleString("id-ID") : value
    default:
      return String(value)
  }
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onView,
  onEdit,
  onDelete,
  isLoading,
  primaryKey = "id",
  renderActions,
  pagination,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const hasActions = onView || onEdit || onDelete || renderActions

  // Calculate row number based on pagination
  const getRowNumber = (index: number) => {
    if (pagination) {
      return (pagination.page - 1) * pagination.limit + index + 1
    }
    return index + 1
  }

  // Default action buttons component
  const DefaultActions = ({ row }: { row: T }) => (
    <div className="flex items-center justify-center gap-1">
      {onView && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onView(row)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {onEdit && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(row)}
          className="h-8 w-8 p-0"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(row)}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table className="bg-white rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              {hasActions && (
                <TableHead className="text-center">Aksi</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 2}
                  className="h-24 text-center text-muted-foreground"
                >
                  Tidak ada data
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={row[primaryKey] || index}>
                  <TableCell className="text-muted-foreground">
                    {getRowNumber(index)}
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {formatValue(row[col.key], col, row)}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell className="text-center">
                      {renderActions 
                        ? renderActions(row, <DefaultActions row={row} />)
                        : <DefaultActions row={row} />
                      }
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Menampilkan {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} data
            </span>
            {pagination.onLimitChange && (
              <Select
                value={String(pagination.limit)}
                onValueChange={(value) => pagination.onLimitChange?.(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page <= 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="px-3 text-sm">
              Halaman {pagination.page} dari {pagination.lastPage}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.lastPage}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.lastPage)}
              disabled={pagination.page >= pagination.lastPage}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
