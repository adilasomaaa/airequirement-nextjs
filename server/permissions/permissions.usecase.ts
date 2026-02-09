import bcrypt from "bcrypt";
import { permissionsRepository } from "./permissions.repository";
import { CreatePermissionDtoType, UpdatePermissionDtoType, PermissionsQueryDtoType } from "./permissions.dto";
import { PermissionAlreadyExistsError, PermissionNotFoundError } from "./permissions.error";
import { createLogger } from "@/lib/logger";
import { createPaginationMeta, PaginatedResponse } from "@/lib/dto/pagination.dto";

const logger = createLogger("PermissionsUseCase");

export const permissionsUseCase = {
  getAllPermissions: async (query: PermissionsQueryDtoType): Promise<PaginatedResponse<any>> => {
    logger.useCaseStart("getAllPermissions", { page: query.page, limit: query.limit, search: query.search });
    try {
      const [permissions, total] = await Promise.all([
        permissionsRepository.findAll(query),
        permissionsRepository.count(query),
      ]);
      
      const meta = createPaginationMeta(query.page, query.limit, total);
      logger.useCaseSuccess("getAllPermissions", { count: permissions.length, total });
      
      return { data: permissions, meta };
    } catch (error) {
      logger.useCaseError("getAllPermissions", error);
      throw error;
    }
  },

  getPermissionById: async (id: number) => {
    logger.useCaseStart("getPermissionById", { id });
    try {
      const permission = await permissionsRepository.findById(id);
      if (!permission) {
        throw new PermissionNotFoundError();
      }
      logger.useCaseSuccess("getPermissionById", { id });
      return permission;
    } catch (error) {
      logger.useCaseError("getPermissionById", error, { id });
      throw error;
    }
  },

  createPermission: async (data: CreatePermissionDtoType) => {
    logger.useCaseStart("createPermission", { name: data.name });
    try {
      const existingPermission = await permissionsRepository.findByName(data.name);
      if (existingPermission) {
        throw new PermissionAlreadyExistsError();
      }

      const permission = await permissionsRepository.create({
        ...data,
      });
      logger.useCaseSuccess("createPermission", { id: permission.id, name: permission.name });
      return permission;
    } catch (error) {
      logger.useCaseError("createPermission", error, { name: data.name });
      throw error;
    }
  },

  updatePermission: async (id: number, data: UpdatePermissionDtoType) => {
    logger.useCaseStart("updatePermission", { id, fields: Object.keys(data) });
    try {
      const permission = await permissionsRepository.findById(id);
      if (!permission) {
        throw new PermissionNotFoundError();
      }

      if (data.name) {
         const existingPermission = await permissionsRepository.findByName(data.name);
         if (existingPermission && existingPermission.id !== id) {
             throw new PermissionAlreadyExistsError("Permission sudah digunakan oleh permission lain");
         }
      }

      const updatedPermission = await permissionsRepository.update(id, data);
      logger.useCaseSuccess("updatePermission", { id });
      return updatedPermission;
    } catch (error) {
      logger.useCaseError("updatePermission", error, { id });
      throw error;
    }
  },

  deletePermission: async (id: number) => {
    logger.useCaseStart("deletePermission", { id });
    try {
      const permission = await permissionsRepository.findById(id);
      if (!permission) {
        throw new PermissionNotFoundError();
      }
      await permissionsRepository.delete(id);
      logger.useCaseSuccess("deletePermission", { id });
    } catch (error) {
      logger.useCaseError("deletePermission", error, { id });
      throw error;
    }
  },
};

