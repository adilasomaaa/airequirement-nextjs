import { fetcher } from "@/lib/fetcher";
import { 
  ApiResult, 
  ApiPaginatedResult,
} from "@/client/types/api-response.types";
import { Permission } from "@prisma/client";
import { CreateRoleDtoType, RolesQueryDtoType, UpdateRoleDtoType } from "@/server/roles/roles.dto";


export interface Role {
  id: number;
  name: string;
  rolePermissions: {
    id: number;
    permissionId: number;
    roleId: number;
    permission: Permission;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export const roleService = {
  getAll: async (query: Partial<RolesQueryDtoType> = {}) => {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.search) params.set("search", query.search);
    
    return fetcher.get<ApiPaginatedResult<Role>>(`/api/roles?${params.toString()}`);
  },

  getById: async (id: number) => {
    return fetcher.get<ApiResult<Role>>(`/api/roles/${id}`);
  },

  create: async (data: CreateRoleDtoType) => {
    return fetcher.post<ApiResult<Role>>("/api/roles", data);
  },

  update: async (id: number, data: UpdateRoleDtoType) => {
    return fetcher.put<ApiResult<Role>>(`/api/roles/${id}`, data);
  },

  delete: async (id: number) => {
    return fetcher.delete<ApiResult<void>>(`/api/roles/${id}`);
  },
};
