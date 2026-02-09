import { CrudConfig } from "@/client/types/crud.types"

export const usersCrudConfig: CrudConfig = {
  name: "Pengguna",
  namePlural: "Pengguna",
  endpoint: "/api/users",
  primaryKey: "id",

  columns: [
    { key: "name", label: "Nama" },
    { key: "email", label: "Email" },
    { key: "roleId", label: "Role", render: (value, row) => row.role.name },
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
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Masukkan email",
      required: true,
    },
    {
      name: "roleId",
      label: "Peran",
      type: "select",
      placeholder: "Pilih Peran",
      options: [],
      required: false,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Masukkan password",
      required: true,
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
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Masukkan email",
    },
    {
      name: "roleId",
      label: "Peran",
      type: "select",
      placeholder: "Pilih Peran",
      options: [],
      required: false,
    },
    {
      name: "password",
      label: "Password Baru",
      type: "password",
      placeholder: "Kosongkan jika tidak diubah",
    },
  ],

  showFields: [
    { key: "name", label: "Nama" },
    { key: "email", label: "Email" },
    { key: "createdAt", label: "Dibuat", type: "date" },
    { key: "updatedAt", label: "Diperbarui", type: "date" },
  ],
}
