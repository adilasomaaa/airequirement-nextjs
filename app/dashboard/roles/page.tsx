"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DataTable,
  InputModal,
  ShowModal,
  DeleteModal,
} from "@/components/crud"
import { rolesCrudConfig } from "./config"
import { Plus, Search } from "lucide-react"
import { useRoles } from "./useRoles"
import { useMemo } from "react"
import { usePermissions } from "../permissions/usePermissions"

export default function PermissionsPage() {
  const config = rolesCrudConfig
  const {
    roles,
    selectedRole,
    isLoading,
    isSubmitting,
    serverErrors,
    search,
    page,
    limit,
    meta,
    showCreateModal,
    showEditModal,
    showViewModal,
    showDeleteModal,
    setShowCreateModal,
    setShowEditModal,
    setShowViewModal,
    setShowDeleteModal,
    onView,
    onEdit,
    onDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    resetServerErrors,
    setSearch,
    setPage,
    setLimit,
  } = useRoles({ config })

  const { permissions } = usePermissions({ initialLimit: 100 })

  const dynamicFormFields = useMemo(() => {
    return config.createFields.map((field) => {
      if (field.name === "permissions") {
        return {
          ...field,
          options: permissions.map((p) => ({
            label: p.name,
            value: p.id,
          })),
        }
      }
      return field
    })
  }, [permissions])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Kelola {config.namePlural}
          </h1>
          <p className="text-slate-500">
            Daftar semua {config.namePlural.toLowerCase()} yang terdaftar
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah {config.name}
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={`Cari ${config.namePlural.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <DataTable
        data={roles}
        columns={config.columns}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        isLoading={isLoading}
        primaryKey={config.primaryKey}
        pagination={meta ? {
          page,
          limit,
          total: meta.total,
          lastPage: meta.lastPage,
          onPageChange: setPage,
          onLimitChange: setLimit,
        } : undefined}
      />

      <InputModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          resetServerErrors()
        }}
        mode="create"
        fields={dynamicFormFields}
        onSubmit={handleCreate}
        title={`Tambah ${config.name}`}
        isLoading={isSubmitting}
        serverErrors={serverErrors}
      />

      <InputModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          resetServerErrors()
        }}
        mode="edit"
        fields={dynamicFormFields}
        initialData={
          selectedRole
            ? {
                ...selectedRole,
                permissions: selectedRole.rolePermissions?.map(
                  (rp: any) => rp.permission.id
                ),
              }
            : undefined
        }
        onSubmit={handleUpdate}
        title={`Edit ${config.name}`}
        isLoading={isSubmitting}
        serverErrors={serverErrors}
      />

      <ShowModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        data={selectedRole}
        fields={config.showFields}
        title={`Detail ${config.name}`}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={`Hapus ${config.name}`}
        message={`Apakah Anda yakin ingin menghapus ${config.name.toLowerCase()} "${selectedRole?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        isLoading={isSubmitting}
      />
    </div>
  )
}