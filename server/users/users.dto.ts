import { z } from "zod";
import { PaginationQueryDto } from "@/lib/dto/pagination.dto";

// Query DTO for listing users (extends pagination)
export const UsersQueryDto = PaginationQueryDto.extend({
  // Add user-specific filters here if needed
  // role: z.string().optional(),
});

export const CreateUserDto = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  roleId: z.coerce.number().min(1, "Role tidak boleh kosong"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const UpdateUserDto = z.object({
  name: z.string().min(1).optional(),
  roleId: z.coerce.number().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

export type UsersQueryDtoType = z.infer<typeof UsersQueryDto>;
export type CreateUserDtoType = z.infer<typeof CreateUserDto>;
export type UpdateUserDtoType = z.infer<typeof UpdateUserDto>;

