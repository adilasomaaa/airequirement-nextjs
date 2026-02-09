"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { CrudConfig } from "@/client/types/crud.types"
import { PaginationMeta, isApiSuccess } from "@/client/types/api-response.types"
import { CreateUserDtoType, UpdateUserDtoType } from "@/server/users/users.dto"
import { CreatePermissionDtoType } from "@/server/permissions/permissions.dto"
import { Permission } from "@prisma/client"
import { roleService, Role } from "@/client/services/role-service"
import { CreateRoleDtoType } from "@/server/roles/roles.dto"

interface UseRolesOptions {
  config?: CrudConfig
  initialLimit?: number
}

export function useRoles({ config, initialLimit = 10 }: UseRolesOptions) {
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
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

  const fetchRoles = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await roleService.getAll({ page, limit, search: debouncedSearch || undefined })
      
      if (response.success) {
        setRoles(response.data)
        setMeta(response.meta)
      }
    } catch (error) {
      toast.error("Gagal memuat data")
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, debouncedSearch])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  const handleCreate = async (formData: Record<string, any>): Promise<Record<string, string[]> | null> => {
    setIsSubmitting(true)
    setServerErrors({})
    try {
      const response = await roleService.create(formData as CreateRoleDtoType)

      if (isApiSuccess(response)) {
        setShowCreateModal(false)
        fetchRoles()
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
    if (!selectedRole) return null
    setIsSubmitting(true)
    setServerErrors({})
    try {
      const updateData = { ...formData }

      const response = await roleService.update(selectedRole.id, updateData)

      if (isApiSuccess(response)) {
        setShowEditModal(false)
        setSelectedRole(null)
        fetchRoles()
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
    if (!selectedRole) return
    setIsSubmitting(true)
    try {
      const response = await roleService.delete(selectedRole.id)

      if (response.success) {
        setShowDeleteModal(false)
        setSelectedRole(null)
        fetchRoles()
      }
    } catch (error) {
      // Error handled by fetcher
    } finally {
      setIsSubmitting(false)
    }
  }

  // Action handlers
  const onView = (role: Role) => {
    setSelectedRole(role)
    setShowViewModal(true)
  }

  const onEdit = (role: Role) => {
    setSelectedRole(role)
    setShowEditModal(true)
  }

  const onDelete = (role: Role) => {
    setSelectedRole(role)
    setShowDeleteModal(true)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowViewModal(false)
    setShowDeleteModal(false)
    setSelectedRole(null)
  }

  const resetServerErrors = () => setServerErrors({})

  return {
    roles,
    selectedRole,
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
    refetch: fetchRoles,
  }
}
