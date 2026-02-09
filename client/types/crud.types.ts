// Input field types
export type InputFieldType = 
  | "text" 
  | "number" 
  | "email" 
  | "password" 
  | "date" 
  | "datetime" 
  | "file" 
  | "image" 
  | "select" 
  | "multiselect"
  | "textarea"
  | "checkbox"

// Column configuration for DataTable
// Column configuration for DataTable
export interface ColumnConfig<T = any> {
  key: string
  label: string
  type?: "text" | "date" | "datetime" | "badge" | "image" | "number"
  width?: string
  className?: string
  render?: (value: any, row: T) => React.ReactNode
  renderCell?: (row: T) => React.ReactNode
}

// Select option
export interface SelectOption {
  value: string | number
  label: string
}

// Field configuration for forms
export interface FieldConfig {
  name: string
  label: string
  type: InputFieldType
  placeholder?: string
  required?: boolean
  options?: SelectOption[]
  accept?: string // for file input
  multiple?: boolean // for file input
  rows?: number // for textarea
  min?: number // for number
  max?: number // for number
  defaultValue?: any
}

// Show field configuration
export interface ShowFieldConfig {
  key: string
  label: string
  type?: "text" | "date" | "datetime" | "image" | "badge"
  render?: (value: any, row: any) => React.ReactNode
}

// Complete CRUD configuration
export interface CrudConfig<T = any> {
  name: string
  namePlural: string
  endpoint: string
  columns: ColumnConfig[]
  createFields: FieldConfig[]
  editFields: FieldConfig[]
  showFields: ShowFieldConfig[]
  primaryKey?: string
}

// Modal props types
export interface ModalInputProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  fields: FieldConfig[]
  initialData?: Record<string, any>
  onSubmit: (data: Record<string, any>) => Promise<Record<string, string[]> | null | void>
  title: string
  isLoading?: boolean
  serverErrors?: Record<string, string[]>
}

export interface ShowModalProps {
  isOpen: boolean
  onClose: () => void
  data: Record<string, any> | null
  fields: ShowFieldConfig[]
  title: string
}

export interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  title: string
  message: string
  isLoading?: boolean
}

// Pagination props for DataTable
export interface PaginationProps {
  page: number
  limit: number
  total: number
  lastPage: number
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
}

// DataTable props
export interface DataTableProps<T = any> {
  data: T[]
  columns: ColumnConfig<T>[]
  onView?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  isLoading?: boolean
  primaryKey?: string
  renderActions?: (row: T, defaultActions: React.ReactNode) => React.ReactNode
  pagination?: PaginationProps
}
