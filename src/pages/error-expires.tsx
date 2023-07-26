// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import { logMessageEvent } from '@/utils/function';
import { GetServerSideProps } from 'next';
import Image from 'next/image';

type Props = {
  data?: any;
};

const ErrorExpires = ({ data }: Props) => {
  const handleClick = () => {
    logMessageEvent('ON_CLICK_BUTTON_RESET_URL_EXPIRES');
  };

  return (
    <div className='pt-8 px-4 h-screen bg-gray-FAFAFA'>
      <p className='text-base-16-120 font-weight-600 text-center'>
        URLの有効期限が切れています。
      </p>
      <div className='flex justify-center my-8'>
        <Image src='/view/icons/warning.png' alt='' width={80} height={80} />
      </div>
      {data?.mail && (
        <div className='mt-8 mb-4'>
          説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト
        </div>
      )}
      <button
        type='submit'
        className='text-base-14-14 font-weight-600 rounded-md text-white bg-red-E62E2E h-11 w-full'
        onClick={handleClick}
      >
        やり直す
      </button>
    </div>
  );
};

export default ErrorExpires;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const data = query;

  return {
    props: {
      data,
    },
  };
};
