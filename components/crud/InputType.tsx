"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldConfig } from "@/client/types/crud.types"

interface InputTypeProps {
  field: FieldConfig
  value: any
  onChange: (name: string, value: any) => void
  error?: string
}

export default function InputType({ field, value, onChange, error }: InputTypeProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target
    let newValue: any = target.value

    if (field.type === "number") {
      newValue = target.value === "" ? "" : Number(target.value)
    } else if (field.type === "checkbox" && target instanceof HTMLInputElement) {
      newValue = target.checked
    } else if ((field.type === "file" || field.type === "image") && target instanceof HTMLInputElement) {
      newValue = field.multiple ? target.files : target.files?.[0]
    }

    onChange(field.name, newValue)
  }

  const baseInputClass = `w-full rounded-md border px-3 py-2 text-sm ${
    error ? "border-red-500" : "border-slate-300"
  } focus:outline-none focus:ring-2 focus:ring-blue-500`

  const renderInput = () => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={value || ""}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            rows={field.rows || 3}
            className={baseInputClass}
          />
        )

      case "select":
        return (
          <select
            id={field.name}
            name={field.name}
            value={value || ""}
            onChange={handleChange}
            required={field.required}
            className={baseInputClass}
          >
            <option value="">{field.placeholder || "Pilih..."}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )

      case "file":
      case "image":
        return (
          <input
            id={field.name}
            name={field.name}
            type="file"
            onChange={handleChange}
            required={field.required}
            accept={field.accept || (field.type === "image" ? "image/*" : undefined)}
            multiple={field.multiple}
            className={baseInputClass}
          />
        )

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <input
              id={field.name}
              name={field.name}
              type="checkbox"
              checked={value || false}
              onChange={handleChange}
              required={field.required}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor={field.name} className="text-sm text-slate-600">
              {field.placeholder}
            </Label>
          </div>
        )

      default:
        return (
          <Input
            id={field.name}
            name={field.name}
            type={field.type}
            value={value || ""}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            min={field.min}
            max={field.max}
            className={error ? "border-red-500" : ""}
          />
        )
    }
  }

  return (
    <div className="space-y-1.5">
      {field.type !== "checkbox" && (
        <Label htmlFor={field.name} className="text-sm font-medium text-slate-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderInput()}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
