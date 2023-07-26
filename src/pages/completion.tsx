// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import StepList from '@/components/Step';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { logMessageEvent } from '@/utils/function';

type Props = {};

const Completion = (props: Props) => {
  const currentStep = useRef(5);
  const [isIphone, setIsIphone] = useState(true);

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
  });

  const handleClick = () => {
    logMessageEvent('ON_CLICK_BUTTON_DO_IT_LATER');
  };

  return (
    <div className='h-100vh '>
      <StepList currentStep={currentStep.current}></StepList>
      <div className='px-4 py-4 bg-linear-gradient border-b border-b-black-rgba-01 '>
        {isIphone ? (
          <>
            <div className='bg-black-5 rounded-lg px-4 pt-2 grid grid-cols-[auto,128px] items-center'>
              <div className='font-weight-600'>
                JAL Payの申し込みが完了しました。
              </div>
              <Image
                src='/view/card_completion.svg'
                alt=''
                width='128'
                height='79'
                className='cursor-pointer min-h-[79px]'
              />
            </div>
            <div className='my-6'>
              <p className='text-base-16-24 font-weight-600 text-center'>
                続いてGoogle Pay™に設定しましょう。
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
          </>
        ) : (
          <>
            <div className='w-full text-center font-weight-600 text-base-16-120 my-10'>
              JAL Payのお申し込みが完了しました。
            </div>
            <Image
              src='/view/card_completion.svg'
              alt=''
              width='343'
              height='212'
              className='cursor-pointer sepia-image'
            />
            <div className='text-base-16-24 w-full text-center font-weight-600'>
              お申し込みが完了しました。
              <br />
              早速アプリを開いてみましょう。
            </div>
          </>
        )}
      </div>

      <div className='p-3'>
        {isIphone && (
          <button className='mb-4 h-11 rounded-[4px] w-full flex items-center justify-center bg-black font-weight-600 text-base-14-100 text-white'>
            <Image
              className='pr-2 h-6'
              src='/view/icons/apple_pay.svg'
              alt=''
              width={55}
              height={20}
            />
            <span>{isIphone ? 'Apple Payに設定する' : 'に追加'}</span>
          </button>
        )}
        {isIphone ? (
          <button
            className='h-11 rounded-[6px] w-full flex items-center justify-center bg-black-5 font-weight-600 text-base-14-100 text-black-75'
            onClick={handleClick}
          >
            あとでやる
          </button>
        ) : (
          <button
            type='submit'
            className='font-weight-600 rounded-md text-white bg-red-E62E2E h-11 w-full'
            onClick={handleClick}
          >
            ホーム画面へ
          </button>
        )}
      </div>
    </div>
  );
};

export default Completion;
