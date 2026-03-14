export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiError {
  detail: string | { msg: string; type: string }[];
  status?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
