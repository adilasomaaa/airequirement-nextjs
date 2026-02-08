import { z } from "zod";

export const RegisterDto = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  email: z.string(),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;

