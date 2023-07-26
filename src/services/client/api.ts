// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import { clientHttpReq } from '@/services/client/http-request';
import { RequestSms } from '@/utils/types';

export const saveSelectFlag = async (isNeobankApplicationSelected: boolean) => {
  try {
    return await clientHttpReq.axiosInstance.post(
      '/view/api/neobank/membership/join/select-flag/save',
      {
        isNeobankApplicationSelected,
      },
    );
  } catch (e) {
    throw e;
  }
};

export const requestSms = async (params: RequestSms) => {
  try {
    return await clientHttpReq.axiosInstance.post(
      '/view/api/sms/auth/request',
      params,
    );
  } catch (e) {
    throw e;
  }
};

export const saveInfoCustomer = async (params: any) => {
  try {
    return await clientHttpReq.axiosInstance.post(
      '/view/api/jalpay/membership/join/apply',
      params,
    );
  } catch (e) {
    throw e;
  }
};
