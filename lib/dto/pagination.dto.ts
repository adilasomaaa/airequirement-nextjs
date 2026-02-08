import { z } from "zod";

export const PaginationQueryDto = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(1),
  search: z.string().optional(),
});

export type PaginationQueryDtoType = z.infer<typeof PaginationQueryDto>;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  lastPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export function calculatePagination(page: number, limit: number) {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  return {
    page,
    limit,
    total,
    lastPage: Math.ceil(total / limit),
  };
}
