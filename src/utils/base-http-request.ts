import { pinoLogger } from '@/server/logger';
import { getCookie } from 'cookies-next';
import Axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
// import { ResponseData } from './types';

export class BaseHttpRequest {
  public axiosInstance: AxiosInstance;

  constructor(config?: CreateAxiosDefaults) {
    this.axiosInstance = Axios.create(config);

    this.axiosInstance.interceptors.request.use(config => {
      pinoLogger.info({
        config,
        message: `${config.method} ${config.url}`,
      });

      const token = getCookie('app-token');
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }

      return config;
    });

    this.axiosInstance.interceptors.response.use(
      async response => {
        pinoLogger.info({
          message: `${response.config.method} ${response.config.url}`,
          headers: response.headers,
          body: response.data,
        });

        return response;
      },
      async error => {
        pinoLogger.error(
          {
            headers: error.response?.headers,
            message: error.message,
            body: error.response?.data,
          },
          error.stack,
          error.message,
        );

        return error.response;
      },
    );
  }
}
