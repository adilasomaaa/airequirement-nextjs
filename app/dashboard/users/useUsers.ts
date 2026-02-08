"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { CrudConfig } from "@/client/types/crud.types"
import { userService, User } from "@/client/services/user-service"
import { PaginationMeta, isApiSuccess } from "@/client/types/api-response.types"
import { CreateUserDtoType, UpdateUserDtoType } from "@/server/users/users.dto"

interface UseUsersOptions {
  config: CrudConfig
}

export function useUsers({ config }: UseUsersOptions) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})
  
  // Pagination state
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
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

  // Fetch users using userService
  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await userService.getAll({ page, limit, search: debouncedSearch || undefined })
      
      if (response.success) {
        setUsers(response.data)
        setMeta(response.meta)
      }
    } catch (error) {
      toast.error("Gagal memuat data")
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, debouncedSearch])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Create user using userService
  const handleCreate = async (formData: Record<string, any>): Promise<Record<string, string[]> | null> => {
    setIsSubmitting(true)
    setServerErrors({})
    try {
      const response = await userService.create(formData as CreateUserDtoType)

      if (isApiSuccess(response)) {
        setShowCreateModal(false)
        fetchUsers()
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
    if (!selectedUser) return null
    setIsSubmitting(true)
    setServerErrors({})
    try {
      const updateData = { ...formData }
      if (!updateData.password) {
        delete updateData.password
      }

      const response = await userService.update(selectedUser.id, updateData)

      if (isApiSuccess(response)) {
        setShowEditModal(false)
        setSelectedUser(null)
        fetchUsers()
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
    if (!selectedUser) return
    setIsSubmitting(true)
    try {
      const response = await userService.delete(selectedUser.id)

      if (response.success) {
        setShowDeleteModal(false)
        setSelectedUser(null)
        fetchUsers()
      }
    } catch (error) {
      // Error handled by fetcher
    } finally {
      setIsSubmitting(false)
    }
  }

  // Action handlers
  const onView = (user: User) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  const onEdit = (user: User) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const onDelete = (user: User) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowViewModal(false)
    setShowDeleteModal(false)
    setSelectedUser(null)
  }

  const resetServerErrors = () => setServerErrors({})

  return {
    // Data
    users,
    selectedUser,
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
    refetch: fetchUsers,
  }
}
