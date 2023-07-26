// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import { serverHttpReq } from './http-request';

export const getPhoneNumberJMB = async (token?: string) => {
  try {
    return await serverHttpReq.axiosInstance.get(
      '/jmb/member/info?requestTag=flyonGrp,currencyGrp,targetMileGrp,memberprofileGrp,memberprofileOTPGrp,memberprofileAuthriskrefGrp',
      {
        headers: token
          ? {
              authorization: `Bearer ${token}`,
            }
          : {},
      },
    );
  } catch (e) {
    throw e;
  }
};

export const getMemberInfo = async (
  authenticationCode?: string,
  token?: string,
) => {
  try {
    return await serverHttpReq.axiosInstance.post(
      '/sms/auth/verify',
      { authenticationCode },
      {
        headers: token
          ? {
              authorization: `Bearer ${token}`,
            }
          : {},
      },
    );
  } catch (e) {
    throw e;
  }
};

export const verifyMail = async (authorizationCode: string, token?: string) => {
  try {
    return await serverHttpReq.axiosInstance.post(
      '/jalpay/jgw-switch/mobile-number/verify',
      { authorizationCode },
      {
        headers: token
          ? {
              authorization: `Bearer ${token}`,
            }
          : {},
      },
    );
  } catch (e) {
    throw e;
  }
};
