// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import StepList from '@/components/Step';
import Image from 'next/image';
import { useRef } from 'react';
import { logMessageEvent } from '@/utils/function';
import { GetServerSideProps } from 'next';

interface Props {
  dataQuery: any;
}

const ConfirmationSent = ({ dataQuery }: Props) => {
  const currentStep = useRef(2);

  const handleClick = () => {
    logMessageEvent('ON_CLICK_BUTTON_BACK');
  };

  return (
    <div>
      {!dataQuery && <StepList currentStep={currentStep.current} />}
      <div className='bg-black-5 '>
        <div className='px-4 pt-8 border-b border-b-black-10'>
          <div className='font-weight-600 text-base-16-120 text-center'>
            <p>ご登録の携帯電話番号へ</p>
            <p>認証用メッセージを送信しました</p>
          </div>
          <Image
            src='/view/noti-sms.svg'
            alt='Image confirmation sent'
            width={0}
            height={0}
            className='m-auto my-4 w-full'
          />
          <p>この画面を閉じずに届いたURLをタップしてください。</p>
          <div className='bg-black-5 p-4 rounded-lg mt-4 mb-4'>
            <p className='font-weight-600 mb-2'>SMSが届かない方</p>
            <ul className='list-disc pl-6'>
              <li>前の画面に戻り携帯電話番号をお確かめください。</li>
              <li>未登録の番号を着信拒否している場合、SMSも届きません。</li>
              <li>当社SMSの送信元番号は[xxxxxxxx]です。</li>
              <li>電波のよい場所でお試しください。</li>
              <li>
                通信状態に問題がない場合、ご利用中の通信業者様に、お客様の端末がSMSサービスに登録されているかご確認ください。
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='px-3'>
        <button
          type='button'
          className='font-weight-600 text-base-14-14 rounded-md text-red-E62E2E border border-red-E62E2E h-11 w-full my-3'
          onClick={handleClick}
        >
          前の画面に戻る
        </button>
      </div>
    </div>
  );
};

export default ConfirmationSent;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  let dataQuery = query.switch ?? '';

  return {
    props: {
      dataQuery,
    },
  };
};
