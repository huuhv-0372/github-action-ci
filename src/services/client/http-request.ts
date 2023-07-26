import { BaseHttpRequest } from '@/utils/base-http-request';

export const clientHttpReq = new BaseHttpRequest({
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});
