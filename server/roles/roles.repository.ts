import { prisma } from "@/lib/prisma";
import { CreateRoleDtoType, RolesQueryDtoType, UpdateRoleDtoType } from "./roles.dto";
import { calculatePagination } from "@/lib/dto/pagination.dto";

export const rolesRepository = {
  findAll: async (query: RolesQueryDtoType) => {
    const { skip, take } = calculatePagination(query.page, query.limit);
    const where = query.search ? {
      OR: [
        { name: { contains: query.search } },
      ],
    } : undefined;

    return prisma.role.findMany({
      where,
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  },

  count: async (query: RolesQueryDtoType) => {
    const where = query.search ? {
      OR: [
        { name: { contains: query.search } },
      ],
    } : undefined;

    return prisma.role.count({ where });
  },

  findByName: async (name: string) => {
    return prisma.role.findFirst({
      where: { name },
    });
  },

  findById: async (id: number) => {
    return prisma.role.findUnique({
      where: { id },
    });
  },

  create: async (data: CreateRoleDtoType) => {
    const { permissions, ...rest } = data;
    return prisma.role.create({
      data: {
        ...rest,
        rolePermissions: {
          create: permissions?.map((permissionId) => ({
            permissionId,
          })),
        },
      },
    });
  },

  update: async (id: number, data: UpdateRoleDtoType) => {
    const { permissions, ...rest } = data;
    return prisma.role.update({
      where: { id },
      data: {
        ...rest,
        rolePermissions: {
          deleteMany: {
            roleId: id,
          },
          create: permissions?.map((permissionId) => ({
            permissionId,
          })),
        },
      },
    });
  },

  delete: async (id: number) => {
    return prisma.role.delete({
      where: { id },
    });
  },
};
