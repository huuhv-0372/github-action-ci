// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import Head from 'next/head';
import { useRef } from 'react';
import StepList from '@/components/Step';
import { getCodeChallenge, getAppToken } from '@/services/client/auth';
import { setCookie } from 'cookies-next';

export default function Home() {
  const currentStep = useRef(6);

  const handleGetAppToken = async () => {
    const codeChallenge = await getCodeChallenge();
    const dataGetToken = {
      codeChallenge: codeChallenge,
      authenCode: 'lPFEnHKOfDWpekLvYZc9GfntDyXzmioDHCcowimxGzw',
    };
    const response = await getAppToken(dataGetToken);
    setCookie('app-token', response.data.appToken);
  };

  return (
    <>
      <Head>
        <title>JAL MILEAGE BANK</title>
        <meta name='description' content='JAL MILEAGE BANK' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <StepList currentStep={currentStep.current}></StepList>
        <button
          type='button'
          className='font-weight-600 text-base-14-14 rounded-md text-red-FF3355 border border-red-FF3355 h-11 w-full'
          onClick={handleGetAppToken}
        >
          Get app token
        </button>
      </main>
    </>
  );
}
