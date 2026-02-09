"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DataTable,
  InputModal,
  ShowModal,
  DeleteModal,
} from "@/components/crud"
import { permissionsCrudConfig } from "./config"
import { Plus, Search } from "lucide-react"
import { usePermissions } from "./usePermissions"

export default function PermissionsPage() {
  const config = permissionsCrudConfig
  const {
    permissions,
    selectedPermission,
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
  } = usePermissions({ config })

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
        data={permissions}
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
        fields={config.createFields}
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
        fields={config.editFields}
        initialData={selectedPermission || undefined}
        onSubmit={handleUpdate}
        title={`Edit ${config.name}`}
        isLoading={isSubmitting}
        serverErrors={serverErrors}
      />

      <ShowModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        data={selectedPermission}
        fields={config.showFields}
        title={`Detail ${config.name}`}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={`Hapus ${config.name}`}
        message={`Apakah Anda yakin ingin menghapus ${config.name.toLowerCase()} "${selectedPermission?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        isLoading={isSubmitting}
      />
    </div>
  )
}