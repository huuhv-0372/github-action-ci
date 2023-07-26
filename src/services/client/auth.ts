// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import { clientHttpReq } from '@/services/client/http-request';
import { ParamGetAppToken } from '@/utils/types';

export const getCodeChallenge = async () => {
  try {
    const response = await clientHttpReq.axiosInstance.post(
      '/view/api/jmb/auth/start',
    );
    return response.data.codeChallenge;
  } catch (e) {
    throw e;
  }
};

export const getAppToken = async (params: ParamGetAppToken) => {
  try {
    return await clientHttpReq.axiosInstance.post(
      '/view/api/jmb/auth/complete',
      params,
    );
  } catch (e) {
    throw e;
  }
};
