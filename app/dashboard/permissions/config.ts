import { CrudConfig } from "@/client/types/crud.types"

export const permissionsCrudConfig: CrudConfig = {
  name: "Permission",
  namePlural: "Permissions",
  endpoint: "/api/permissions",
  primaryKey: "id",

  columns: [
    { key: "name", label: "Nama" },
    { key: "createdAt", label: "Dibuat", type: "date" },
  ],

  createFields: [
    {
      name: "name",
      label: "Nama",
      type: "text",
      placeholder: "Masukkan nama",
      required: false,
    },
  ],

  editFields: [
    {
      name: "name",
      label: "Nama",
      type: "text",
      placeholder: "Masukkan nama",
    },
  ],

  showFields: [
    { key: "name", label: "Nama" },
    { key: "createdAt", label: "Dibuat", type: "date" },
    { key: "updatedAt", label: "Diperbarui", type: "date" },
  ],
}
