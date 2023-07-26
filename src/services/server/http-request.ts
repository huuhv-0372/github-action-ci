import { apiBaseUri, apiKey } from '@/config/envs';
import { BaseHttpRequest } from '@/utils/base-http-request';

export const serverHttpReq = new BaseHttpRequest({
  baseURL: apiBaseUri,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'x-api-key': apiKey,
  },
});
