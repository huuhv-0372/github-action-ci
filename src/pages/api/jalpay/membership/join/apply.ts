import type { NextApiRequest, NextApiResponse } from 'next';
import { serverHttpReq } from '@/services/server/http-request';
import { AxiosError } from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { data } = await serverHttpReq.axiosInstance.post(
      '/jalpay/membership/join/apply',
      req.body,
      {
        headers: {
          authorization: req.headers.authorization,
        },
      },
    );
    res.send(data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return res
        .status(error.response?.status ?? 500)
        .send(error.response?.data);
    }

    res.status(500).json({ message: 'Internal Server Error' });
  }
}
