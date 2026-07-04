export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: string;
  };
  timestamp: string;
  requestId?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  timestamp: string;
  requestId?: string;
}
