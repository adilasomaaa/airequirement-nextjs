"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShowModalProps, ShowFieldConfig } from "@/client/types/crud.types"

function formatShowValue(value: any, field: ShowFieldConfig): React.ReactNode {
  if (value === null || value === undefined) return "-"

  if (field.render) {
    return field.render(value, {})
  }

  switch (field.type) {
    case "date":
      return new Date(value).toLocaleDateString("id-ID")
    case "datetime":
      return new Date(value).toLocaleString("id-ID")
    case "image":
      return value ? (
        <img src={value} alt="" className="max-h-40 rounded object-cover" />
      ) : "-"
    case "badge":
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
          {value}
        </span>
      )
    default:
      return String(value)
  }
}

export default function ShowModal({
  isOpen,
  onClose,
  data,
  fields,
  title,
}: ShowModalProps) {
  if (!data) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="border-b border-slate-100 pb-3 last:border-0">
              <dt className="text-sm font-medium text-muted-foreground">{field.label}</dt>
              <dd className="mt-1 text-sm">
                {formatShowValue(data[field.key], field)}
              </dd>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
