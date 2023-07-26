// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import Footer from '@/components/footer';
import StepList from '@/components/Step';
import { useEffect, useRef, useState } from 'react';
import router from 'next/router';
import { GetServerSideProps } from 'next/types';
import { deleteCookie, getCookie } from 'cookies-next';
import moment from 'moment';
import { CustomerInfo } from '@/types';
import ModalError from '@/components/modal-error';
import { saveInfoCustomer, saveSelectFlag } from '@/services/client/api';
import { logMessageEvent } from '@/utils/function';
import { MESSAGE_ERROR_API, MESSAGE_ERROR_NETWORK } from '@/constants/message';
import { JALPAY_REGIS_STATUS, STATUS_CODE } from '@/constants';

type Props = {
  cookieValue: any;
};

const ConfirmInput = ({ cookieValue }: Props) => {
  const [dataRegis, setDataRegis] = useState<CustomerInfo>();
  const [isShowModalPending, setIsShowModalPending] = useState(false);
  const [isShowModalReject, setIsShowModalReject] = useState(false);
  const [isShowModalNetwork, setIsShowModalNetwork] = useState(false);
  const [isShowModalErrorApi, setIsShowModalErrorApi] = useState(false);

  useEffect(() => {
    cookieValue && setDataRegis(JSON.parse(cookieValue));
  }, []);
  const currentStep = useRef(4);

  const handleClick = async () => {
    if (navigator.onLine) {
      // Handle save flag NeoBank
      const getFlagNeoBank = getCookie('policy');
      const isUseNeoBank = JSON.parse(getFlagNeoBank as string).checkUseNeobank;
      if (isUseNeoBank) {
        const dataFlag = await saveSelectFlag(isUseNeoBank);
        if (dataFlag.status === STATUS_CODE.UNAUTHORIZED) {
          logMessageEvent(
            'ON_ERROR',
            dataFlag.data.errors[0],
            '/view/confirm-input',
          );
        }
      }

      // Handle save data info
      const data = {
        jmbCustomerId: dataRegis?.jmbCustomerId,
        email: dataRegis?.mailAddress,
        firstNameKanji: dataRegis?.firstNameKanji,
        lastNameKanji: dataRegis?.lastNameKanji,
        firstNameKana: dataRegis?.firstNameKana,
        lastNameKana: dataRegis?.lastNameKana,
        firstNameEnglish: dataRegis?.firstNameRomaji,
        lastNameEnglish: dataRegis?.lastNameRomaji,
        middleNameEnglish: dataRegis?.middleName,
        birthday: dataRegis?.dateOfBirth,
        gender: dataRegis?.gender,
        postalCode: dataRegis?.addressZipCode,
        address1: dataRegis?.addressLine1,
        address2: dataRegis?.addressLine2,
        address3: dataRegis?.addressLine3,
        mobilePhoneNumber: dataRegis?.phoneNumber,
        pin: dataRegis?.card,
        occupation: dataRegis?.profession.value,
        travelReason: dataRegis?.transaction.value,
        travelPlan: dataRegis?.travelSchedule === 'yes' ? true : false,
        travelPlanDate: moment(dataRegis?.travelDate).format('YYYY/MM/DD'),
        travelCountry: dataRegis?.destination.value,
      };
      const response = await saveInfoCustomer(data);
      if (response.status === STATUS_CODE.SUCCESS) {
        if (
          response.data.jalpayApplicationStatus ===
            JALPAY_REGIS_STATUS.UNCHECKED ||
          response.data.jalpayApplicationStatus === JALPAY_REGIS_STATUS.HOLD
        ) {
          setIsShowModalPending(true);
        } else if (
          response.data.jalpayApplicationStatus === JALPAY_REGIS_STATUS.REJECTED
        ) {
          setIsShowModalReject(true);
        } else {
          deleteCookie('policy');
          deleteCookie('phoneNumber');
          deleteCookie('data-regis');
          router.push('/completion');
        }
      } else if (response.status === STATUS_CODE.UNAUTHORIZED) {
        logMessageEvent(
          'ON_ERROR',
          response.data.errors[0],
          '/view/confirm-input',
        );
      } else {
        setIsShowModalErrorApi(true);
      }
    } else {
      setIsShowModalNetwork(true);
    }
  };

  const handleOkModal = () => {
    logMessageEvent('ON_CLICK_BUTTON_BACK_HOME');
  };

  return (
    <div>
      <ModalError
        content='審査を行っておりますので、JALPayのご利用開始までしばらくお待ちください。'
        isShow={isShowModalPending}
        handleOk={handleOkModal}
      />
      <ModalError
        content='申し訳ございませんが、総合的判断の結果、お客さまのJAL Payのご利用はお見送りとさせていただきました。'
        isShow={isShowModalReject}
        handleOk={handleOkModal}
      />
      <ModalError
        content={MESSAGE_ERROR_NETWORK}
        isShow={isShowModalNetwork}
        handleCancel={() => router.push('/phone-number-confirm')}
      />
      <ModalError
        content={MESSAGE_ERROR_API}
        isShow={isShowModalErrorApi}
        handleCancel={() => router.push('/phone-number-confirm')}
      />
      <StepList currentStep={currentStep.current}></StepList>
      <div className='px-4 py-8 bg-linear-gradient'>
        <p className='font-weight-600 text-base-24-120'>入力内容の確認</p>
        <p className='text-base-14-150 text-black-75 mt-3'>
          こちらの内容でJAL Payを設定します。
        </p>
        <p className='text-base-11-150 text-black-50 mt-3'>
          JAL Payご入会者さま情報の入力兼、JAL NEOBANK
          住信SBIネット銀行JAL支店-口座開設入力兼特定取引を行う者の届出{' '}
        </p>
        <div className='text-base-16-120 mt-8'>
          <p className='font-weight-600'>メールアドレス</p>
          {/* TODO: update email */}
          <p className='mt-4'>sample@kayac.com</p>
        </div>
        <div className='text-base-16-120 mt-8'>
          <p className='font-weight-600'>お名前（漢字）</p>
          <p className='mt-3'>
            {dataRegis?.lastNameKanji} {dataRegis?.firstNameKanji}
          </p>
        </div>
        <div className='text-base-16-120 mt-8'>
          <p className='font-weight-600 '>お名前（カナ）</p>
          <p className='mt-3'>
            {dataRegis?.lastNameKana} {dataRegis?.firstNameKana}
          </p>
        </div>
        <div className='text-base-16-120 mt-8'>
          <p className='font-weight-600'>お名前（ローマ字）</p>
          <p className='mt-3'>
            {dataRegis?.lastNameRomaji} {dataRegis?.middleName}{' '}
            {dataRegis?.firstNameRomaji}
          </p>
        </div>
        <div className='text-base-16-120 mt-8'>
          <p className='font-weight-600'>
            居住地国の確認（特定取引を行う者の届出）
          </p>
          <p className='mt-3'>
            {dataRegis?.country === 'japanOnly' ? '日本のみ' : '日本のみ以外'}
          </p>
        </div>
        <div className='text-base-16-150 mt-8'>
          <p className='font-weight-600'>住所</p>
          <div className='mt-3'>
            <div>{dataRegis?.addressZipCode}</div>
            <div className='mt-1'>
              {dataRegis?.addressLine1} <br /> {dataRegis?.addressLine2} <br />{' '}
              {dataRegis?.addressLine3}
            </div>
          </div>
        </div>
        <div className='text-base-16-120 mt-8'>
          <p className='font-weight-600'>電話番号</p>
          <div className='mt-3'>
            <div>{dataRegis?.phoneNumber}</div>
          </div>
        </div>
        <div className='text-base-16-120 mt-8'>
          <p className='font-weight-600'>職業</p>
          <p className='mt-3'>{dataRegis?.profession.label}</p>
        </div>
        <div className='text-base-16-120 mt-8'>
          <p className='font-weight-600'>取引目的（JAL Pay）</p>
          <p className='mt-3'>{dataRegis?.transaction.label}</p>
        </div>
        <div className='text-base-16-120 mt-8'>
          <p className='font-weight-600'>渡航予定</p>
          <p className='mt-3'>
            {dataRegis?.travelSchedule === 'yes' ? 'あり' : 'なし'}
          </p>
        </div>
        <div className='text-base-16-120 mt-8'>
          <p className='font-weight-600'>渡航日</p>
          <p className='mt-3'>
            {dataRegis?.travelDate &&
              moment(dataRegis?.travelDate).format('YYYY/MM/DD')}
          </p>
        </div>
        <div className='text-base-16-120 mt-8'>
          <p className='font-weight-600'>渡航先</p>
          <p className='mt-3'>{dataRegis?.destination?.label}</p>
        </div>
        <div className='text-base-16-120 mt-8'>
          <p className='font-weight-600'>カード暗証番号</p>
          <p className='mt-3'>●●●●</p>
        </div>
      </div>
      <div className='py-8 px-4'>
        <button
          className='h-11 rounded-[6px] w-full flex items-center justify-center bg-red-E62E2E font-weight-600 text-base-14-100 text-white'
          onClick={handleClick}
        >
          この内容で設定する
        </button>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ConfirmInput;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  const getCookies = getCookie('data-regis', { req, res }); // get cookie
  const cookieValue = getCookies ?? '';

  return {
    props: {
      cookieValue,
    },
  };
};
