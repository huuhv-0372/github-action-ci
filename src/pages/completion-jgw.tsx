// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { verifyMail } from '@/services/server/api';
import Loading from '@/components/loading';
import { logMessageEvent } from '@/utils/function';
import ModalError from '@/components/modal-error';
import { MESSAGE_ERROR_API } from '@/constants/message';

type Props = {
  data?: any;
};

const CompletionJGW = ({ data }: Props) => {
  const [isIphone, setIsIphone] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    if (window.navigator.userAgent.match(/Android/i)) {
      setIsIphone(false);
    }
    if (
      window.navigator.userAgent.match(/iPhone/i) ||
      window.navigator.userAgent.match(/iPad/i)
    ) {
      setIsIphone(true);
    }
    window.screen.width > 800 && setIsMobile(false);
  }, []);

  const handleClick = () => {
    logMessageEvent('ON_CLICK_BUTTON_DO_IT_LATER');
  };

  if (data.message == 'Invalid appToken') {
    logMessageEvent('ON_ERROR', data, '/view/registration');

    return <Loading />;
  }

  if (data === 'ERROR_API') {
    return <ModalError content={MESSAGE_ERROR_API} isShow={true} />;
  }

  return (
    <div>
      {isMobile ? (
        <>
          <div className='px-4 pb-10 pt-4 bg-linear-gradient border-b border-b-black-rgba-01 content-container'>
            <div className='bg-black-5 rounded-lg px-4 py-2'>
              <div className='grid grid-cols-[auto,128px] items-center'>
                <div className='font-weight-600 pr-4'>
                  携帯電話番号の登録が完了しました。
                  <br />
                  JAL Payをお使いいただけます。
                </div>
                <Image
                  src='/view/card_completion.svg'
                  alt=''
                  width='128'
                  height='79'
                  className='cursor-pointer min-h-[79px]'
                />
              </div>
              <p className='text-base-11-150 text-center mt-4'>
                現在お持ちいただいているJAL Global
                WALLETカードもそのままお使いいただけます。
              </p>
            </div>
            {isIphone && (
              <div className='my-6'>
                <p className='text-base-16-24 font-weight-600 text-center'>
                  続いてApple Payに設定しましょう。
                  <br />
                  スマホでタッチ決済が可能になります。
                </p>
                <Image
                  src='/view/guide-apple-pay.png'
                  alt=''
                  width='216'
                  height='228'
                  className='m-auto mt-2'
                />
              </div>
            )}
          </div>
          <div className='p-3'>
            {isIphone ? (
              <div>
                <button className='mb-4 h-11 rounded-[4px] w-full flex items-center justify-center bg-black font-weight-600 text-base-14-100 text-white'>
                  <Image
                    className='pr-2 h-6'
                    src='/view/icons/apple_pay.svg'
                    alt=''
                    width={55}
                    height={20}
                  />
                  <span>Apple Payに設定する</span>
                </button>
                <button
                  className='h-11 rounded-[6px] w-full flex items-center justify-center bg-black-5 font-weight-600 text-base-14-100 text-black-75'
                  onClick={handleClick}
                >
                  あとで設定する
                </button>
              </div>
            ) : (
              <button
                type='submit'
                className='font-weight-600 rounded-md text-white bg-red-E62E2E h-11 w-full'
                onClick={handleClick}
              >
                認証メッセージを送信
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className='text-center mt-12'>
            <p className='text-base-24-120 font-weight-600 mb-10'>承認完了</p>
            <p className='text-base-14-21'>
              JMBアプリを開き、手続きを進めてください。
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CompletionJGW;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  query,
}) => {
  let data: any;
  const getToken = getCookie('app-token', { req, res });
  const getAuthCode = query.s;
  if (getAuthCode) {
    const response = await verifyMail(
      getAuthCode as string,
      getToken as string,
    );
    if (response.status == 200) {
      data = response.data;
    } else if (response.status == 401) {
      data = response.data.errors[0];
    } else if (response.status == 400) {
      return {
        redirect: {
          permanent: false,
          destination: '/error-expires?mail=true',
        },
      };
    } else {
      data = 'ERROR_API';
    }
  }

  return {
    props: {
      data: [],
    },
  };
};
