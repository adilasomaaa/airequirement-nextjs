"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DataTable,
  InputModal,
  ShowModal,
  DeleteModal,
} from "@/components/crud"
import { usersCrudConfig } from "./config"
import { useUsers } from "./useUsers"
import { Plus, Search } from "lucide-react"

export default function UsersPage() {
  const config = usersCrudConfig
  const {
    users,
    selectedUser,
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
  } = useUsers({ config })

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
        data={users}
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
        initialData={selectedUser || undefined}
        onSubmit={handleUpdate}
        title={`Edit ${config.name}`}
        isLoading={isSubmitting}
        serverErrors={serverErrors}
      />

      <ShowModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        data={selectedUser}
        fields={config.showFields}
        title={`Detail ${config.name}`}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={`Hapus ${config.name}`}
        message={`Apakah Anda yakin ingin menghapus ${config.name.toLowerCase()} "${selectedUser?.name || selectedUser?.email}"? Tindakan ini tidak dapat dibatalkan.`}
        isLoading={isSubmitting}
      />
    </div>
  )
}