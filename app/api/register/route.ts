import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import {
  errorResponse,
  errorWithData,
  successResponse,
} from "@/lib/api-response";
import { RegisterDto } from "@/server/auth/register.dto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = RegisterDto.safeParse(body);

    if (!validation.success) {
      return errorWithData(
        validation.error.flatten().fieldErrors,
        "Validasi gagal",
        400
      );
    }

    const { email, name, password } = validation.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    return successResponse("User created", 201);
  } catch (error: any) {
    console.error("Register error:", error);

    if (error.code === "P2002") {
      return errorResponse("Email sudah terdaftar", 400);
    }

    return errorResponse("Terjadi kesalahan saat mendaftar", 500);
  }
}