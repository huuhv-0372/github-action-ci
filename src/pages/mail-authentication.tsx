// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import { getMemberInfo } from '@/services/server/api';
import Loading from '@/components/loading';
import { logMessageEvent } from '@/utils/function';
import ModalError from '@/components/modal-error';
import { MESSAGE_ERROR_API } from '@/constants/message';
import router from 'next/router';
type Props = {
  data?: any;
};

const MailApprove = ({ data }: Props) => {
  if (data.message == 'Invalid appToken') {
    logMessageEvent('ON_ERROR', data, '/view/mail-authentication');

    return <Loading />;
  }

  if (data === 'ERROR_API') {
    return (
      <ModalError
        content={MESSAGE_ERROR_API}
        isShow={true}
        handleCancel={() => router.push('/phone-number-confirm?switch=jgw')}
      />
    );
  }

  return (
    <div>
      <div className='pt-8 px-4 h-screen bg-linear-gradient-8'>
        <div className='w-full text-center font-weight-600 text-base-16-120'>
          <p>ご登録のメールアドレスへ</p>
          <p>電話番号承認メールを送信しました</p>
        </div>
        <div className='my-4 w-full flex justify-center'>
          <div className='relative'>
            <Image
              src='/view/noti-mail.png'
              alt='notice-mail'
              className='w-full h-[111px]'
              width={100}
              height={111}
            />
          </div>
        </div>
        <div className='text-base-14-150'>
          <p>メールアドレス</p>
          <p>{data.mailAddress}</p>
          <p>に承認メールを送信しました。</p>
          <p className='my-4'>
            メールに記載されたURLをタップして、電話番号登録を承認してください。
          </p>
        </div>
        <button className='h-11 rounded-[6px] w-full bg-black-5 font-weight-600 text-base-14-100 text-black-75'>
          メールが届かない場合
        </button>
      </div>
    </div>
  );
};

export default MailApprove;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  let data: any;
  const getToken = getCookie('app-token', { req, res });
  const getAuthCode = getCookie('authentication-code', { req, res });
  if (getAuthCode) {
    const response = await getMemberInfo(
      getAuthCode as string,
      getToken as string,
    );
    if (response.status == 200) {
      data = {
        mailAddress: response.data.mailAddress || '',
      };
    } else if (response.status == 401) {
      data = response.data.errors[0];
    } else if (response.status == 400) {
      return {
        redirect: {
          permanent: false,
          destination: '/error-expires',
        },
      };
    } else {
      data = 'ERROR_API';
    }
  }

  return {
    props: {
      data,
    },
  };
};
