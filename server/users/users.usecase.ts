import bcrypt from "bcrypt";
import { usersRepository } from "./users.repository";
import { CreateUserDtoType, UpdateUserDtoType, UsersQueryDtoType } from "./users.dto";
import { UserAlreadyExistsError, UserNotFoundError } from "./users.error";
import { createLogger } from "@/lib/logger";
import { createPaginationMeta, PaginatedResponse } from "@/lib/dto/pagination.dto";

const logger = createLogger("UsersUseCase");

export const usersUseCase = {
  getAllUsers: async (query: UsersQueryDtoType): Promise<PaginatedResponse<any>> => {
    logger.useCaseStart("getAllUsers", { page: query.page, limit: query.limit, search: query.search });
    try {
      const [users, total] = await Promise.all([
        usersRepository.findAll(query),
        usersRepository.count(query),
      ]);
      
      const meta = createPaginationMeta(query.page, query.limit, total);
      logger.useCaseSuccess("getAllUsers", { count: users.length, total });
      
      return { data: users, meta };
    } catch (error) {
      logger.useCaseError("getAllUsers", error);
      throw error;
    }
  },

  getUserById: async (id: number) => {
    logger.useCaseStart("getUserById", { id });
    try {
      const user = await usersRepository.findById(id);
      if (!user) {
        throw new UserNotFoundError();
      }
      logger.useCaseSuccess("getUserById", { id });
      return user;
    } catch (error) {
      logger.useCaseError("getUserById", error, { id });
      throw error;
    }
  },

  createUser: async (data: CreateUserDtoType) => {
    logger.useCaseStart("createUser", { email: data.email });
    try {
      const existingUser = await usersRepository.findByEmail(data.email);
      if (existingUser) {
        throw new UserAlreadyExistsError();
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      const user = await usersRepository.create({
        ...data,
        password: hashedPassword,
      });
      logger.useCaseSuccess("createUser", { id: user.id, email: user.email });
      return user;
    } catch (error) {
      logger.useCaseError("createUser", error, { email: data.email });
      throw error;
    }
  },

  updateUser: async (id: number, data: UpdateUserDtoType) => {
    logger.useCaseStart("updateUser", { id, fields: Object.keys(data) });
    try {
      const user = await usersRepository.findById(id);
      if (!user) {
        throw new UserNotFoundError();
      }

      if (data.email) {
         const existingUser = await usersRepository.findByEmail(data.email);
         if (existingUser && existingUser.id !== id) {
             throw new UserAlreadyExistsError("Email sudah digunakan oleh user lain");
         }
      }

      let updateData = { ...data };
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
      }

      const updatedUser = await usersRepository.update(id, updateData);
      logger.useCaseSuccess("updateUser", { id });
      return updatedUser;
    } catch (error) {
      logger.useCaseError("updateUser", error, { id });
      throw error;
    }
  },

  deleteUser: async (id: number) => {
    logger.useCaseStart("deleteUser", { id });
    try {
      const user = await usersRepository.findById(id);
      if (!user) {
        throw new UserNotFoundError();
      }
      await usersRepository.delete(id);
      logger.useCaseSuccess("deleteUser", { id });
    } catch (error) {
      logger.useCaseError("deleteUser", error, { id });
      throw error;
    }
  },
};

