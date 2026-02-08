import { fetcher } from "@/lib/fetcher";
import { RegisterDtoType } from "@/server/auth/register.dto";
import { ApiResult } from "@/client/types/api-response.types";

export const authService = {
  register: async (data: RegisterDtoType) => {
    return fetcher.post<ApiResult<{ id: number; email: string }>>("/api/register", data);
  },
};
