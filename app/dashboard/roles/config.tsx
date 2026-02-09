import { CrudConfig } from "@/client/types/crud.types"

export const rolesCrudConfig: CrudConfig = {
  name: "Role",
  namePlural: "Roles",
  endpoint: "/api/roles",
  primaryKey: "id",

  columns: [
    { key: "name", label: "Nama", width: "200px" },
    { 
      key: "rolePermissions", 
      label: "Permissions", 
      width: "600px",
      className: "whitespace-normal",
      render: (value, row) => (
        <div className="flex flex-wrap gap-2">
          {row.rolePermissions.map((rp: any) => (
            <span key={rp.id} className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
              {rp.permission.name}
            </span>
          ))}
        </div>
      )
    },
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
    {
      name: "permissions",
      label: "Perizinan",
      type: "multiselect",
      placeholder: "Pilih Perizinan",
      options: [],
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
    {
      name: "permissions",
      label: "Perizinan",
      type: "multiselect",
      placeholder: "Pilih Perizinan",
      options: [],
      required: false,
    },
  ],

  showFields: [
    { key: "name", label: "Nama" },
    { key: "createdAt", label: "Dibuat", type: "date" },
    { key: "updatedAt", label: "Diperbarui", type: "date" },
  ],
}
