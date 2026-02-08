import { toast } from "sonner";

type FetcherOptions = RequestInit & {
  headers?: Record<string, string>;
};

async function http<T>(path: string, config: FetcherOptions): Promise<T> {
  const requestConfig: RequestInit = {
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
    },
  };

  const isMutation = config.method !== "GET";

  try {
    const response = await fetch(path, requestConfig);

    if (!response.ok) {
      let errorMessage = "Terjadi kesalahan";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || response.statusText;
        
        if (isMutation) {
          toast.error(errorMessage);
        }
        
        throw errorData;
      } catch (e: any) {
        if (e && typeof e === 'object' && 'message' in e) {
           throw e;
        }
        if (isMutation) {
          toast.error(errorMessage);
        }
        throw new Error(errorMessage);
      }
    }

    if (response.status === 204) {
      if (isMutation) {
        toast.success("Berhasil");
      }
      return {} as T;
    }

    const data = await response.json();

    if (isMutation) {
      if (data && typeof data === 'object' && 'success' in data && data.success) {
         toast.success(data.message || "Berhasil");
      } else {
         toast.success("Berhasil");
      }
    }

    return data;
  } catch (error: any) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
       if (isMutation) toast.error("Gagal terhubung ke server");
    }
    throw error;
  }
}

export const fetcher = {
  get: <T>(path: string, config?: FetcherOptions) =>
    http<T>(path, { ...config, method: "GET" }),

  post: <T>(path: string, body: any, config?: FetcherOptions) =>
    http<T>(path, { ...config, method: "POST", body: JSON.stringify(body) }),

  put: <T>(path: string, body: any, config?: FetcherOptions) =>
    http<T>(path, { ...config, method: "PUT", body: JSON.stringify(body) }),

  patch: <T>(path: string, body: any, config?: FetcherOptions) =>
    http<T>(path, { ...config, method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(path: string, config?: FetcherOptions) =>
    http<T>(path, { ...config, method: "DELETE" }),
};
