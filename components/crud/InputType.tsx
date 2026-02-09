"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FieldConfig } from "@/client/types/crud.types"

interface InputTypeProps {
  field: FieldConfig
  value: any
  onChange: (name: string, value: any) => void
  error?: string
}

export default function InputType({ field, value, onChange, error }: InputTypeProps) {
  const [open, setOpen] = React.useState(false)

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

  const handleSelectChange = (value: string) => {
    onChange(field.name, value)
  }

  const handleMultiSelect = (currentValue: any) => {
    const currentValues = Array.isArray(value) ? value : []
    const newValue = currentValues.includes(currentValue)
      ? currentValues.filter((v: any) => v !== currentValue)
      : [...currentValues, currentValue]
    onChange(field.name, newValue)
  }

  const removeMultiSelectItem = (itemToRemove: any) => {
    const currentValues = Array.isArray(value) ? value : []
    const newValue = currentValues.filter((v: any) => v !== itemToRemove)
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
          <Select value={value?.toString()} onValueChange={handleSelectChange}>
            <SelectTrigger className={cn("w-full", error && "border-red-500")}>
              <SelectValue placeholder={field.placeholder || "Pilih..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "multiselect":
        const selectedValues = Array.isArray(value) ? value : []
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={`w-full justify-between h-auto min-h-10 ${error ? "border-red-500" : ""}`}
              >
                <div className="flex flex-wrap gap-1">
                  {selectedValues.length > 0 ? (
                    selectedValues.map((val: any) => {
                      const option = field.options?.find((opt) => opt.value === val)
                      return (
                         <Badge key={val} variant="secondary" className="mr-1 mb-1">
                          {option?.label || val}
                          <div
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                removeMultiSelectItem(val);
                              }
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={() => removeMultiSelectItem(val)}
                          >
                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                          </div>
                        </Badge>
                      )
                    })
                  ) : (
                    <span className="text-muted-foreground font-normal">
                      {field.placeholder || "Pilih..."}
                    </span>
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder={`Cari ${field.label}...`} />
                <CommandList>
                  <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                  <CommandGroup>
                    {field.options?.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label} 
                        onSelect={() => {
                          handleMultiSelect(opt.value)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedValues.includes(opt.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
