import { NextRequest } from "next/server";
import { usersUseCase } from "@/server/users/users.usecase";
import { CreateUserDto, UsersQueryDto } from "@/server/users/users.dto";
import {
  successWithPaginate,
  successWithData,
  errorResponse,
  errorWithData,
} from "@/lib/api-response";
import { UserAlreadyExistsError } from "@/server/users/users.error";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const queryValidation = UsersQueryDto.safeParse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 10,
      search: searchParams.get("search") || undefined,
    });

    if (!queryValidation.success) {
      return errorWithData(
        queryValidation.error.flatten().fieldErrors,
        "Parameter tidak valid",
        400
      );
    }

    const result = await usersUseCase.getAllUsers(queryValidation.data);
    return successWithPaginate(result.data, result.meta, "Data user berhasil diambil");
  } catch (error) {
    console.error(error);
    return errorResponse("Terjadi kesalahan internal server", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = CreateUserDto.safeParse(body);

    if (!validation.success) {
      return errorWithData(
        validation.error.flatten().fieldErrors,
        "Validasi gagal",
        400
      );
    }

    const user = await usersUseCase.createUser(validation.data);

    return successWithData(user, "User berhasil dibuat", 201);
  } catch (error) {
    console.error(error);
    if (error instanceof UserAlreadyExistsError) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Terjadi kesalahan internal server", 500);
  }
}
