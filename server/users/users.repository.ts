import { prisma } from "@/lib/prisma";
import { CreateUserDtoType, UpdateUserDtoType, UsersQueryDtoType } from "./users.dto";
import { calculatePagination } from "@/lib/dto/pagination.dto";

export const usersRepository = {
  findAll: async (query: UsersQueryDtoType) => {
    const { skip, take } = calculatePagination(query.page, query.limit);
    const where = query.search ? {
      OR: [
        { name: { contains: query.search } },
        { email: { contains: query.search } },
      ],
    } : undefined;

    return prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  },

  count: async (query: UsersQueryDtoType) => {
    const where = query.search ? {
      OR: [
        { name: { contains: query.search } },
        { email: { contains: query.search } },
      ],
    } : undefined;

    return prisma.user.count({ where });
  },

  findById: async (id: number) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  create: async (data: CreateUserDtoType) => {
    return prisma.user.create({
      data,
    });
  },

  update: async (id: number, data: UpdateUserDtoType) => {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  delete: async (id: number) => {
    return prisma.user.delete({
      where: { id },
    });
  },
};
