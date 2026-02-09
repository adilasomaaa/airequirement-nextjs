import { NextRequest } from "next/server";
import { usersUseCase } from "@/server/users/users.usecase";
import { UpdateUserDto } from "@/server/users/users.dto";
import {
  successWithData,
  errorResponse,
  errorWithData,
} from "@/lib/api-response";
import { rolesUseCase } from "@/server/roles/roles.usecase";
import { RoleAlreadyExistsError, RoleNotFoundError } from "@/server/roles/roles.error";
import { UpdateRoleDto } from "@/server/roles/roles.dto";

interface Props {
  params: {
    id: string;
  };
}

function parseId(params: { id: string }) {
  const id = parseInt(params.id);
  if (isNaN(id)) return null;
  return id;
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = parseId(params);
  if (!id) return errorResponse("ID user tidak valid", 400);

  try {
    const permission = await rolesUseCase.getRoleById(id);
    return successWithData(permission, "Data permission berhasil diambil");
  } catch (error) {
    if (error instanceof RoleNotFoundError) {
      return errorResponse(error.message, 404);
    }
    console.error(error);
    return errorResponse("Terjadi kesalahan internal server", 500);
  }
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = parseId(params);
  if (!id) return errorResponse("ID user tidak valid", 400);

  try {
    const body = await req.json();
    const validation = UpdateRoleDto.safeParse(body);

    if (!validation.success) {
      return errorWithData(
        validation.error.flatten().fieldErrors,
        "Validasi gagal",
        400
      );
    }

    const permission = await rolesUseCase.updateRole(id, validation.data);
    return successWithData(permission, "Permission berhasil diupdate");
  } catch (error) {
    if (error instanceof RoleNotFoundError) {
      return errorResponse(error.message, 404);
    }
    if (error instanceof RoleAlreadyExistsError) {
      return errorResponse(error.message, 400);
    }
    console.error(error);
    return errorResponse("Terjadi kesalahan internal server", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = parseId(params);
  if (!id) return errorResponse("ID user tidak valid", 400);

  try {
    await rolesUseCase.deleteRole(id);
    return successWithData(null, "Role berhasil dihapus");
  } catch (error) {
    if (error instanceof RoleNotFoundError) {
      return errorResponse(error.message, 404);
    }
    console.error(error);
    return errorResponse("Terjadi kesalahan internal server", 500);
  }
}
