import { NextResponse } from "next/server";

export function successResponse(message: string, code = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
    },
    { status: code }
  );
}

export function successWithData<T>(
  data: T,
  message: string,
  code = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: code }
  );
}

export function successWithPaginate<T>(
  data: T,
  metadata: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  },
  message: string,
  code = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      meta: metadata,
    },
    { status: code }
  );
}

export function errorResponse(message: string, code = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: code }
  );
}

export function errorWithData<T>(
  error: T,
  message: string,
  code = 400
) {
  return NextResponse.json(
    {
      success: false,
      message,
      error,
    },
    { status: code }
  );
}
