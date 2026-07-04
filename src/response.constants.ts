export const RESPONSE_FILTERS = {
  GLOBAL: 'global',
  VALIDATION: 'validation',
  HTTP: 'http',
  DATABASE: 'database',
  AUTH: 'auth',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  MULTI_STATUS: 207,
  FOUND: 302,
  BAD_REQUEST: 400,
} as const;

export const RESPONSE_MESSAGES = {
  SUCCESS: 'Success',
  CREATED: 'Created successfully',
  ACCEPTED: 'Request accepted',
  NO_CONTENT: 'No content',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  PARTIAL_SUCCESS: 'Partially successful',
  REDIRECTING: 'Redirecting',
  FILE_READY: 'File ready for download',
} as const;
