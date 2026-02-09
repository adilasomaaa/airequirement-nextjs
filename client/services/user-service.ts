import { fetcher } from "@/lib/fetcher";
import { 
  ApiResult, 
  ApiPaginatedResult,
} from "@/client/types/api-response.types";
import { 
  CreateUserDtoType, 
  UpdateUserDtoType,
  UsersQueryDtoType 
} from "@/server/users/users.dto";

export interface User {
  id: number;
  name: string | null;
  email: string;
  userRoles: {
    role: {
      name: string;
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export const userService = {
  getAll: async (query: Partial<UsersQueryDtoType> = {}) => {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.search) params.set("search", query.search);
    
    return fetcher.get<ApiPaginatedResult<User>>(`/api/users?${params.toString()}`);
  },

  // Get user by ID
  getById: async (id: number) => {
    return fetcher.get<ApiResult<User>>(`/api/users/${id}`);
  },

  // Create user
  create: async (data: CreateUserDtoType) => {
    return fetcher.post<ApiResult<User>>("/api/users", data);
  },

  // Update user
  update: async (id: number, data: UpdateUserDtoType) => {
    return fetcher.put<ApiResult<User>>(`/api/users/${id}`, data);
  },

  // Delete user
  delete: async (id: number) => {
    return fetcher.delete<ApiResult<void>>(`/api/users/${id}`);
  },
};
