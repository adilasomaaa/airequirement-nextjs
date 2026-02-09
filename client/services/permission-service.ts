import { fetcher } from "@/lib/fetcher";
import { 
  ApiResult, 
  ApiPaginatedResult,
} from "@/client/types/api-response.types";
import { CreatePermissionDtoType, PermissionsQueryDtoType, UpdatePermissionDtoType } from "@/server/permissions/permissions.dto";


export interface Permission {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const permissionService = {
  getAll: async (query: Partial<PermissionsQueryDtoType> = {}) => {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.search) params.set("search", query.search);
    
    return fetcher.get<ApiPaginatedResult<Permission>>(`/api/permissions?${params.toString()}`);
  },

  getById: async (id: number) => {
    return fetcher.get<ApiResult<Permission>>(`/api/permissions/${id}`);
  },

  create: async (data: CreatePermissionDtoType) => {
    return fetcher.post<ApiResult<Permission>>("/api/permissions", data);
  },

  update: async (id: number, data: UpdatePermissionDtoType) => {
    return fetcher.put<ApiResult<Permission>>(`/api/permissions/${id}`, data);
  },

  delete: async (id: number) => {
    return fetcher.delete<ApiResult<void>>(`/api/permissions/${id}`);
  },
};
