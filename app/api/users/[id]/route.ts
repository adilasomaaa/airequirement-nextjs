import { NextRequest } from "next/server";
import { usersUseCase } from "@/server/users/users.usecase";
import { UpdateUserDto } from "@/server/users/users.dto";
import {
  successWithData,
  errorResponse,
  errorWithData,
} from "@/lib/api-response";
import { UserAlreadyExistsError, UserNotFoundError } from "@/server/users/users.error";

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
    const user = await usersUseCase.getUserById(id);
    return successWithData(user, "Data user berhasil diambil");
  } catch (error) {
    if (error instanceof UserNotFoundError) {
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
    const validation = UpdateUserDto.safeParse(body);

    if (!validation.success) {
      return errorWithData(
        validation.error.flatten().fieldErrors,
        "Validasi gagal",
        400
      );
    }

    const user = await usersUseCase.updateUser(id, validation.data);
    return successWithData(user, "User berhasil diupdate");
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return errorResponse(error.message, 404);
    }
    if (error instanceof UserAlreadyExistsError) {
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
    await usersUseCase.deleteUser(id);
    return successWithData(null, "User berhasil dihapus");
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return errorResponse(error.message, 404);
    }
    console.error(error);
    return errorResponse("Terjadi kesalahan internal server", 500);
  }
}
