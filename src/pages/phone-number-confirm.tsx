// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import Input from '@/components/input';
import StepList from '@/components/Step';
import router from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next/types';
import { getPhoneNumberJMB } from '@/services/server/api';
import { requestSms } from '@/services/client/api';
import Loading from '@/components/loading';
import { logMessageEvent } from '@/utils/function';
import ModalError from '@/components/modal-error';
import {
  MESSAGE_EMPTY_PHONE,
  MESSAGE_ERROR_API,
  MESSAGE_ERROR_NETWORK,
  MESSAGE_INVALID_PHONE,
  MESSAGE_PATTERN_PHONE,
} from '@/constants/message';
import Link from 'next/link';
import { AUTHENTICATION_TYPE, REGEX_NUMBER, SWITCH } from '@/constants';
import Error from 'next/error';
import { ErrorCode } from '@/utils/types';

type FormData = {
  phoneNumber: string;
};

interface Props {
  data: any;
  dataQuery: any;
}

const PhoneNumberConfirm = ({ data, dataQuery }: Props) => {
  const currentStep = useRef(2);
  const [showModal, setShowModal] = useState(false);
  const [contentError, setContentError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisableBtn, setIsDisableBtn] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (data) setValue('phoneNumber', data);
  }, []);

  const onSubmit = async (data: any) => {
    const checkError = handleCheckValidate(data.phoneNumber);
    if (checkError) {
      if (navigator.onLine) {
        setCookie('phoneNumber', getValues('phoneNumber'));
        const getDeviceToken = getCookie('device-token');
        setIsDisableBtn(true);
        let authenType = '';
        if (dataQuery === SWITCH.JGW) authenType = AUTHENTICATION_TYPE.JGW;
        else if (dataQuery === SWITCH.CHANGE_DEVICE)
          authenType = AUTHENTICATION_TYPE.CHANGE_DEVICE;
        else if (dataQuery === SWITCH.DEVICE_1PAY)
          authenType = AUTHENTICATION_TYPE.DEVICE_1PAY;
        else authenType = AUTHENTICATION_TYPE.JALPAY_REGISTRATION;
        const dataRequest = {
          authenticationType: authenType,
          mobilePhoneNumber: data.phoneNumber,
          deviceToken: getDeviceToken as string,
        };
        const response = await requestSms(dataRequest);
        if (response.status === 200) {
          router.push(
            `/confirmation-sent${dataQuery ? `?switch=${dataQuery}` : ''}`,
          );
        } else if (response.status === 401) {
          logMessageEvent(
            'ON_ERROR',
            response.data.errors[0],
            `/view/phone-number-confirm${
              dataQuery ? `?switch=${dataQuery}` : ''
            }`,
          );

          setIsLoading(true);
        } else {
          setShowModal(true);
          setContentError(MESSAGE_ERROR_API);
          setIsDisableBtn(false);
        }
      } else {
        setShowModal(true);
        setContentError(MESSAGE_ERROR_NETWORK);
        setIsDisableBtn(false);
      }
    }
  };

  const handleCheckValidate = (value: string, event?: string) => {
    if (value.includes('-') && value.length !== 12) {
      setError('phoneNumber', {
        type: 'pattern',
      });
      return false;
    }
    if (!REGEX_NUMBER.test(value) && value.length !== 0) {
      value.length !== 12 &&
        setError('phoneNumber', {
          type: 'minLength',
        });
      return false;
    }
    if (value.length === 11) {
      if (['090', '080', '070'].includes(value.substr(0, 3))) {
        clearErrors('phoneNumber');
        return true;
      } else {
        setError('phoneNumber', {
          type: 'minLength',
        });
        return false;
      }
    } else {
      if (event === 'blur') {
        if (value.length !== 0) {
          setError('phoneNumber', {
            type: 'minLength',
          });
        } else {
          setError('phoneNumber', {
            type: 'required',
          });
        }
      }
    }
  };

  const handleNumChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    handleCheckValidate(value);
    setValue('phoneNumber', event.target.value.slice(0, 11));
  };

  const handleBlurPhone = (event: ChangeEvent<HTMLInputElement>) => {
    handleCheckValidate(event.target.value, 'blur');
  };

  const checkShowError = () => {
    if (errors.phoneNumber?.type === 'minLength') return MESSAGE_INVALID_PHONE;
    else if (errors.phoneNumber?.type === 'required')
      return MESSAGE_EMPTY_PHONE;
    else if (errors.phoneNumber?.type === 'pattern')
      return MESSAGE_PATTERN_PHONE;
    return '';
  };

  if (
    Array.isArray(data) &&
    data?.findIndex((it: ErrorCode) => it.code === 'E01001') !== -1
  ) {
    logMessageEvent('ON_ERROR', data[0], '/view/phone-number-confirm');

    return <Loading />;
  }

  if (
    Array.isArray(data) &&
    data?.findIndex((it: ErrorCode) => it.code === 'E01001') === -1
  ) {
    return <Error statusCode={data[0].message} />;
  }

  if (data === 'ERROR_API') {
    return (
      <ModalError
        content={MESSAGE_ERROR_API}
        isShow={true}
        handleCancel={() => logMessageEvent('ON_CLICK_BUTTON_BACK_POLICY')}
      />
    );
  }

  const handleCancelModalErr = () => {
    if (dataQuery) router.reload();
    else setShowModal(false);
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <ModalError
            content={contentError}
            isShow={showModal}
            handleCancel={handleCancelModalErr}
          />
          {!dataQuery && (
            <StepList currentStep={currentStep.current}></StepList>
          )}
          <div
            className={`bg-linear-gradient ${
              !dataQuery ? 'content-container' : 'h-[calc(100vh-68px)]'
            }`}
          >
            <div className='px-4 py-8'>
              <p className='text-base-16-24 font-semibold mb-2'>携帯電話認証</p>
              <p className='text-black-535C66'>
                以下の携帯電話番号に認証メッセージを送信します。
              </p>
              <p className='mt-6 mb-3'>携帯電話番号</p>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='d-flex flex-col'
              >
                <Input
                  type='tel'
                  name='phoneNumber'
                  register={register}
                  minLength={11}
                  required
                  onChange={e => handleNumChange(e)}
                  onBlur={e => handleBlurPhone(e)}
                  error={checkShowError()}
                />
                <div className='flex items-center text-base-12-120 text-red-E62E2E cursor-pointer mt-4'>
                  <Link href='https://www.jal.co.jp/jp/ja/help/jmb/'>
                    上記の電話番号がご利用になれない方はこちら
                  </Link>
                  <span className='icon-arrow-right text-base-16'></span>
                </div>
                <button
                  type='submit'
                  className='absolute bottom-3 left-4 font-weight-600 rounded-md text-white bg-red-E62E2E h-11 w-[calc(100%-32px)]'
                  disabled={isDisableBtn}
                >
                  認証メッセージを送信
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneNumberConfirm;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  query,
}) => {
  let data: any;
  let dataQuery = query.switch ?? '';
  const getCookies = getCookie('phoneNumber', { req, res });
  const getToken = getCookie('app-token', { req, res });
  if (getCookies) {
    data = getCookies;
  } else {
    const response = await getPhoneNumberJMB(getToken as string);
    if (response.status === 200) {
      const getPhone =
        response.data.memberprofile.profile.phoneNumber.phoneNumber1;
      if (getPhone && ['090', '080', '070'].includes(getPhone.substr(0, 3)))
        data = getPhone;
      else data = '';
    } else data = response.data.errors;
  }

  return {
    props: {
      data,
      dataQuery,
    },
  };
};
