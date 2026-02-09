import { z } from "zod";
import { PaginationQueryDto } from "@/lib/dto/pagination.dto";

export const PermissionsQueryDto = PaginationQueryDto.extend({
});

export const CreatePermissionDto = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
});

export const UpdatePermissionDto = z.object({
  name: z.string().min(1).optional(),
});

export type PermissionsQueryDtoType = z.infer<typeof PermissionsQueryDto>;
export type CreatePermissionDtoType = z.infer<typeof CreatePermissionDto>;
export type UpdatePermissionDtoType = z.infer<typeof UpdatePermissionDto>;

