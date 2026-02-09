"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { CrudConfig } from "@/client/types/crud.types"
import { PaginationMeta, isApiSuccess } from "@/client/types/api-response.types"
import { CreateUserDtoType, UpdateUserDtoType } from "@/server/users/users.dto"
import { permissionService } from "@/client/services/permission-service"
import { CreatePermissionDtoType } from "@/server/permissions/permissions.dto"
import { Permission } from "@prisma/client"

interface UsePermissionsOptions {
  config?: CrudConfig
  initialLimit?: number
}

export function usePermissions({ config, initialLimit = 10 }: UsePermissionsOptions) {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})
  
  // Pagination state
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(initialLimit)
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchPermissions = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await permissionService.getAll({ page, limit, search: debouncedSearch || undefined })
      
      if (response.success) {
        setPermissions(response.data)
        setMeta(response.meta)
      }
    } catch (error) {
      toast.error("Gagal memuat data")
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, debouncedSearch])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  // Create user using userService
  const handleCreate = async (formData: Record<string, any>): Promise<Record<string, string[]> | null> => {
    setIsSubmitting(true)
    setServerErrors({})
    try {
      const response = await permissionService.create(formData as CreatePermissionDtoType)

      if (isApiSuccess(response)) {
        setShowCreateModal(false)
        fetchPermissions()
        return null
      } else {
        if (response.error) {
          setServerErrors(response.error)
          return response.error
        }
        return null
      }
    } catch (error: any) {
      if (error?.error) {
        setServerErrors(error.error)
        return error.error
      }
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update user using userService
  const handleUpdate = async (formData: Record<string, any>): Promise<Record<string, string[]> | null> => {
    if (!selectedPermission) return null
    setIsSubmitting(true)
    setServerErrors({})
    try {
      const updateData = { ...formData }

      const response = await permissionService.update(selectedPermission.id, updateData)

      if (isApiSuccess(response)) {
        setShowEditModal(false)
        setSelectedPermission(null)
        fetchPermissions()
        return null
      } else {
        if (response.error) {
          setServerErrors(response.error)
          return response.error
        }
        return null
      }
    } catch (error: any) {
      if (error?.error) {
        setServerErrors(error.error)
        return error.error
      }
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete user using userService
  const handleDelete = async () => {
    if (!selectedPermission) return
    setIsSubmitting(true)
    try {
      const response = await permissionService.delete(selectedPermission.id)

      if (response.success) {
        setShowDeleteModal(false)
        setSelectedPermission(null)
        fetchPermissions()
      }
    } catch (error) {
      // Error handled by fetcher
    } finally {
      setIsSubmitting(false)
    }
  }

  // Action handlers
  const onView = (permission: Permission) => {
    setSelectedPermission(permission)
    setShowViewModal(true)
  }

  const onEdit = (permission: Permission) => {
    setSelectedPermission(permission)
    setShowEditModal(true)
  }

  const onDelete = (permission: Permission) => {
    setSelectedPermission(permission)
    setShowDeleteModal(true)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowViewModal(false)
    setShowDeleteModal(false)
    setSelectedPermission(null)
  }

  const resetServerErrors = () => setServerErrors({})

  return {
    // Data
    permissions,
    selectedPermission,
    isLoading,
    isSubmitting,
    serverErrors,
    search,

    // Pagination
    page,
    limit,
    meta,

    // Modal states
    showCreateModal,
    showEditModal,
    showViewModal,
    showDeleteModal,

    // Modal setters
    setShowCreateModal,
    setShowEditModal,
    setShowViewModal,
    setShowDeleteModal,

    // Actions
    onView,
    onEdit,
    onDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    closeModals,
    resetServerErrors,
    setSearch,
    setPage,
    setLimit,
    refetch: fetchPermissions,
  }
}
