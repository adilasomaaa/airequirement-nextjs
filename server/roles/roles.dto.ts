import { z } from "zod";
import { PaginationQueryDto } from "@/lib/dto/pagination.dto";

export const RolesQueryDto = PaginationQueryDto.extend({
});

export const CreateRoleDto = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  permissions: z.array(z.number()),
});

export const UpdateRoleDto = z.object({
  name: z.string().min(1).optional(),
  permissions: z.array(z.number()).optional(),
});

export type RolesQueryDtoType = z.infer<typeof RolesQueryDto>;
export type CreateRoleDtoType = z.infer<typeof CreateRoleDto>;
export type UpdateRoleDtoType = z.infer<typeof UpdateRoleDto>;

