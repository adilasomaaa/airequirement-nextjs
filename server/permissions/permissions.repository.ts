import { prisma } from "@/lib/prisma";
import { CreatePermissionDtoType, UpdatePermissionDtoType, PermissionsQueryDtoType } from "./permissions.dto";
import { calculatePagination } from "@/lib/dto/pagination.dto";

export const permissionsRepository = {
  findAll: async (query: PermissionsQueryDtoType) => {
    const { skip, take } = calculatePagination(query.page, query.limit);
    const where = query.search ? {
      OR: [
        { name: { contains: query.search } },
      ],
    } : undefined;

    return prisma.permission.findMany({
      where,
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  },

  count: async (query: PermissionsQueryDtoType) => {
    const where = query.search ? {
      OR: [
        { name: { contains: query.search } },
      ],
    } : undefined;

    return prisma.permission.count({ where });
  },

  findByName: async (name: string) => {
    return prisma.permission.findFirst({
      where: { name },
    });
  },

  findById: async (id: number) => {
    return prisma.permission.findUnique({
      where: { id },
    });
  },

  create: async (data: CreatePermissionDtoType) => {
    return prisma.permission.create({
      data,
    });
  },

  update: async (id: number, data: UpdatePermissionDtoType) => {
    return prisma.permission.update({
      where: { id },
      data,
    });
  },

  delete: async (id: number) => {
    return prisma.permission.delete({
      where: { id },
    });
  },
};
