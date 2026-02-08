"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ModalInputProps } from "@/client/types/crud.types"
import InputType from "./InputType"

export default function InputModal({
  isOpen,
  onClose,
  mode,
  fields,
  initialData,
  onSubmit,
  title,
  isLoading,
  serverErrors = {},
}: ModalInputProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setFormData(initialData)
      } else {
        const defaultData: Record<string, any> = {}
        fields.forEach((field) => {
          if (field.defaultValue !== undefined) {
            defaultData[field.name] = field.defaultValue
          }
        })
        setFormData(defaultData)
      }
      setErrors({})
    }
  }, [isOpen, mode, initialData, fields])

  // Merge server errors into local errors format
  useEffect(() => {
    if (Object.keys(serverErrors).length > 0) {
      const mappedErrors: Record<string, string> = {}
      Object.keys(serverErrors).forEach((key) => {
        if (Array.isArray(serverErrors[key]) && serverErrors[key].length > 0) {
          mappedErrors[key] = serverErrors[key][0]
        }
      })
      setErrors(mappedErrors)
    }
  }, [serverErrors])

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} wajib diisi`
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onSubmit(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <InputType
              key={field.name}
              field={field}
              value={formData[field.name]}
              onChange={handleChange}
              error={errors[field.name]}
            />
          ))}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : mode === "create" ? "Simpan" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

