
export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface ApiResponseWithData<T> extends ApiResponse {
  success: true;
  data: T;
}

export interface ApiResponseWithPaginate<T> extends ApiResponse {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorResponse extends ApiResponse {
  success: false;
  error?: Record<string, string[]>;
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  lastPage: number;
}

export type ApiResult<T> = ApiResponseWithData<T> | ApiErrorResponse;
export type ApiPaginatedResult<T> = ApiResponseWithPaginate<T> | ApiErrorResponse;

export function isApiSuccess<T>(response: ApiResult<T>): response is ApiResponseWithData<T> {
  return response.success === true;
}

export function isApiError(response: ApiResponse): response is ApiErrorResponse {
  return response.success === false;
}

export function isPaginatedSuccess<T>(response: ApiPaginatedResult<T>): response is ApiResponseWithPaginate<T> {
  return response.success === true && 'meta' in response;
}
