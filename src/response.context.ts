import { AsyncLocalStorage } from 'async_hooks';

export interface ResponseContext {
  requestId?: string;
  path?: string;
  method?: string;
}

export const responseContext = new AsyncLocalStorage<ResponseContext>();
