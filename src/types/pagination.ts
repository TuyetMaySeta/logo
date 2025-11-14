export const PaginationRequest = {
  page: 1,
  page_size: 10,
};

export interface PaginationResponse {
  total: number;
  page: number;
  page_size: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface Pagination<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  next_page?: number | null;
  prev_page?: number | null;
}

export const PaginationInit = <T = unknown>(items: T[] = []): Pagination<T> => ({
  items,
  total: 0,
  page: PaginationRequest.page,
  page_size: PaginationRequest.page_size,
  total_pages: 0,
  has_next: false,
  has_prev: false,
  next_page: null,
  prev_page: null,
});