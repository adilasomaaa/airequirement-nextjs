import { NextRequest } from "next/server";
import {
  successWithPaginate,
  successWithData,
  errorResponse,
  errorWithData,
} from "@/lib/api-response";
import { CreateRoleDto, RolesQueryDto } from "@/server/roles/roles.dto";
import { rolesUseCase } from "@/server/roles/roles.usecase";
import { RoleAlreadyExistsError } from "@/server/roles/roles.error";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const queryValidation = RolesQueryDto.safeParse({
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

    const result = await rolesUseCase.getAllRoles(queryValidation.data);
    return successWithPaginate(result.data, result.meta, "Data role berhasil diambil");
  } catch (error) {
    console.error(error);
    return errorResponse("Terjadi kesalahan internal server", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = CreateRoleDto.safeParse(body);

    if (!validation.success) {
      return errorWithData(
        validation.error.flatten().fieldErrors,
        "Validasi gagal",
        400
      );
    }

    const role = await rolesUseCase.createRole(validation.data);

    return successWithData(role, "Role berhasil dibuat", 201);
  } catch (error) {
    console.error(error);
    if (error instanceof RoleAlreadyExistsError) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Terjadi kesalahan internal server", 500);
  }
}
