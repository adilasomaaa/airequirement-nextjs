import bcrypt from "bcrypt";
import { rolesRepository } from "./roles.repository";
import { RoleAlreadyExistsError, RoleNotFoundError } from "./roles.error";
import { createLogger } from "@/lib/logger";
import { createPaginationMeta, PaginatedResponse } from "@/lib/dto/pagination.dto";
import { CreateRoleDtoType, RolesQueryDtoType, UpdateRoleDtoType } from "./roles.dto";

const logger = createLogger("RolesUseCase");

export const rolesUseCase = {
  getAllRoles: async (query: RolesQueryDtoType): Promise<PaginatedResponse<any>> => {
    logger.useCaseStart("getAllRoles", { page: query.page, limit: query.limit, search: query.search });
    try {
      const [roles, total] = await Promise.all([
        rolesRepository.findAll(query),
        rolesRepository.count(query),
      ]);
      
      const meta = createPaginationMeta(query.page, query.limit, total);
      logger.useCaseSuccess("getAllRoles", { count: roles.length, total });
      
      return { data: roles, meta };
    } catch (error) {
      logger.useCaseError("getAllRoles", error);
      throw error;
    }
  },

  getRoleById: async (id: number) => {
    logger.useCaseStart("getRoleById", { id });
    try {
      const role = await rolesRepository.findById(id);
      if (!role) {
        throw new RoleNotFoundError();
      }
      logger.useCaseSuccess("getRoleById", { id });
      return role;
    } catch (error) {
      logger.useCaseError("getRoleById", error, { id });
      throw error;
    }
  },

  createRole: async (data: CreateRoleDtoType) => {
    logger.useCaseStart("createRole", { name: data.name });
    try {
      const existingRole = await rolesRepository.findByName(data.name);
      if (existingRole) {
        throw new RoleAlreadyExistsError();
      }

      const role = await rolesRepository.create({
        ...data,
      });
      logger.useCaseSuccess("createRole", { id: role.id, name: role.name });
      return role;
    } catch (error) {
      logger.useCaseError("createRole", error, { name: data.name });
      throw error;
    }
  },

  updateRole: async (id: number, data: UpdateRoleDtoType) => {
    logger.useCaseStart("updateRole", { id, fields: Object.keys(data) });
    try {
      const role = await rolesRepository.findById(id);
      if (!role) {
        throw new RoleNotFoundError();
      }

      if (data.name) {
         const existingRole = await rolesRepository.findByName(data.name);
         if (existingRole && existingRole.id !== id) {
             throw new RoleAlreadyExistsError("Role sudah digunakan oleh role lain");
         }
      }

      const updatedRole = await rolesRepository.update(id, data);
      logger.useCaseSuccess("updateRole", { id });
      return updatedRole;
    } catch (error) {
      logger.useCaseError("updateRole", error, { id });
      throw error;
    }
  },

  deleteRole: async (id: number) => {
    logger.useCaseStart("deleteRole", { id });
    try {
      const role = await rolesRepository.findById(id);
      if (!role) {
        throw new RoleNotFoundError();
      }
      await rolesRepository.delete(id);
      logger.useCaseSuccess("deleteRole", { id });
    } catch (error) {
      logger.useCaseError("deleteRole", error, { id });
      throw error;
    }
  },
};

