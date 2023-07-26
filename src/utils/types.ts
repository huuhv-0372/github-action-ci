// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import { AxiosRequestConfig } from 'axios';

export interface ResponseData<T = any> {
  [x: string]: any;
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
}

export interface ParamGetAppToken {
  codeChallenge: string;
  authenCode: string;
}

export interface RequestSms {
  authenticationType: string;
  mobilePhoneNumber: string;
  deviceToken: string;
}

export type DataError = {
  code: string;
  message: string;
};

export interface EventGAParams {
  value: string;
}

export interface ErrorCode {
  code: string;
  message: string;
}
