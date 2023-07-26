// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import { STEPS } from '@/constants';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Loading from './loading';

const steps = STEPS;

interface IStepList {
  currentStep: number;
}

const StepList = ({ currentStep }: IStepList) => {
  const [isIphone, setIsIphone] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='w-full h-[78px] p-4'>
      <div className='flex justify-around'>
        <div className='flex flex-col items-center justify-center w-[101px]'>
          {currentStep >= STEPS.PAY ? (
            <div className='w-6 h-6 bg-red-E62E2E rounded-xl flex items-center justify-center'>
              <span className='icon-check text-base-20'></span>
            </div>
          ) : (
            <Image
              src={`/view/step${currentStep}.svg`}
              alt=''
              width='0'
              height='0'
              priority={true}
              style={{ width: '62px', height: '24px' }}
            />
          )}
          <p className='mt-1.5 text-base-12-150'>JAL Pay申し込み</p>
        </div>
        {isIphone && (
          <>
            <span
              className={`h-[2px] w-3 bg-black-10 mt-[11px] mx-1 ${
                currentStep >= STEPS.PAY && 'bg-red-E62E2E'
              }`}
            ></span>
            <div className='flex flex-col items-center w-[101px]'>
              {currentStep >= STEPS.PAY ? (
                <Image
                  src={`/view/step-${currentStep}.svg`}
                  alt=''
                  width='36'
                  height='24'
                />
              ) : (
                <div className='rounded-full w-[24px] h-[24px] flex justify-center items-center bg-black-10 text-black-75'>
                  <span className='text-base-14-150 font-weight-600'>2</span>
                </div>
              )}
              <p className='mt-1.5 text-base-12-150'>Apple Pay設定</p>
            </div>
            <span className='h-[2px] w-3 bg-black-10 mt-[11px] mx-1'></span>
            <div className='flex flex-col items-center w-[101px]'>
              <div className='rounded-full w-[24px] h-[24px] flex justify-center items-center bg-black-10 text-black-75'>
                <span className='text-base-14-150 font-weight-600'>3</span>
              </div>
              <p className='mt-1.5 text-base-12-150'>完了</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StepList;
