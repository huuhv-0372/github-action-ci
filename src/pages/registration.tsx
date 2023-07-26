// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import CustomDatePicker from '@/components/datePicker';
import Footer from '@/components/footer';
import Input from '@/components/input';
import Select from '@/components/select';
import StepList from '@/components/Step';
import { getCookie, setCookie } from 'cookies-next';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  OPTION_PROFESSTION,
  OPTION_DESTINATION,
  OPTION_TRANSACTION_PURPOSES,
  CARD_NUMBER_DUPLICATE,
  REGEX_NUMBER,
} from '@/constants';
import router from 'next/router';
import { GetServerSideProps } from 'next/types';
import { CustomerInfo, ISelect, KeyCustomerInfo } from '@/types';
import { getMemberInfo } from '@/services/server/api';
import Loading from '@/components/loading';
import { logMessageEvent } from '@/utils/function';
import ModalError from '@/components/modal-error';
import {
  MESSAGE_4_DIGITS,
  MESSAGE_CHECK_PIN,
  MESSAGE_COMBINATION_DATE,
  MESSAGE_COMBINATION_JMB_NUMBER,
  MESSAGE_COMBINATION_PHONE,
  MESSAGE_DIFFIRENT_NUMBER,
  MESSAGE_ERROR_API,
  MESSAGE_PIN_PATTERN,
  MESSAGE_REQUIRED,
} from '@/constants/message';
import moment from 'moment';

interface Props {
  dataRegis?: any;
}

const customLabel = (errors: boolean, label: string, required = true) => {
  return (
    <div className='flex items-center mt-8 gap-2'>
      <p
        className={`text-base-16-120 font-weight-600 ${
          errors ? 'text-pink-FF3355' : 'text-black-1A2533'
        }`}
      >
        {label}
      </p>
      {required && (
        <p className='text-red-E62E2E font-weight-600 px-1 py-0.5 bg-red-10 rounded text-base-11-120 min-w-[30px]'>
          必須
        </p>
      )}
    </div>
  );
};

const Registration = ({ dataRegis }: Props) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dayOfBirth, setDayOfBirth] = useState('');
  const [monthOfBirth, setMonthOfBirth] = useState('');
  const [yearOfBirth, setYearOfBirth] = useState('');
  const [jpYear, setJpYear] = useState('');
  const [isShowModalPdf, setIsShowModalPdf] = useState(false);

  const currentStep = useRef(3);
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    getValues,
    setError,
    watch,
    formState: { errors },
    control,
  } = useForm<CustomerInfo>({
    defaultValues: dataRegis ?? {},
  });

  useEffect(() => {
    const phoneNumber = getCookie('phoneNumber');
    phoneNumber && setPhoneNumber(phoneNumber as string);
    if (dataRegis?.dateOfBirth) {
      setDayOfBirth(moment(dataRegis.dateOfBirth).format('DD'));
      setMonthOfBirth(moment(dataRegis.dateOfBirth).format('MM'));
      setYearOfBirth(moment(dataRegis.dateOfBirth).format('YYYY'));
      const convertJpYear = new Intl.DateTimeFormat('ja-JP-u-ca-japanese')
        .format(new Date(dataRegis.dateOfBirth).valueOf())
        .split('/')[0]
        .slice(1);
      setJpYear(('0' + convertJpYear).slice(-2));
    }
  }, []);

  const watchTravelSchedule = watch('travelSchedule');
  useEffect(() => {
    if (watchTravelSchedule === 'no') {
      clearErrors(['travelDate', 'destination']);
      setValue('travelDate', '');
      setValue('destination', { value: '', label: '' });
    }
  }, [watchTravelSchedule]);

  const onSubmit: SubmitHandler<CustomerInfo> = data => {
    if (data) {
      const setData = {
        ...data,
        phoneNumber,
      };
      setCookie('data-regis', JSON.stringify(setData));
      router.push('/confirm-input');
    }
  };

  const changeNumber = (event: ChangeEvent<HTMLInputElement>, name: string) => {
    const value = event.target.value;
    if (name === 'card') {
      if (CARD_NUMBER_DUPLICATE.includes(value)) {
        setError('card', {
          type: 'duplication',
        });
      } else if (
        yearOfBirth === value ||
        monthOfBirth + dayOfBirth === value ||
        yearOfBirth.slice(2) + monthOfBirth.slice(1) + dayOfBirth.slice(1) ===
          value ||
        yearOfBirth.slice(2) + monthOfBirth.slice(0) === value ||
        jpYear + monthOfBirth.slice(1) + dayOfBirth.slice(1) === value ||
        jpYear + monthOfBirth === value
      ) {
        setError('card', {
          type: 'checkDate',
        });
      } else if (phoneNumber?.includes(value)) {
        setError('card', {
          type: 'validatePhoneNumber',
        });
      } else if (dataRegis?.jmbCustomerId?.includes(value)) {
        setError('card', {
          type: 'validateNumberJMB',
        });
      } else value.length === 4 && clearErrors(name);
      // TODO: check validate jpYear
    }
    if (name === 'card' || name === 'cardConfirm') {
      setValue(name, value.slice(0, 4));
      if (!REGEX_NUMBER.test(value)) {
        return setError(name, {
          type: 'pattern',
        });
      }
      if (getValues('card') !== getValues('cardConfirm')) {
        getValues('card') &&
          getValues('cardConfirm') &&
          setError(name, {
            type: 'other',
          });
      } else {
        if (value.length === 4) {
          clearErrors('card');
          clearErrors('cardConfirm');
        }
      }
    }
  };

  const handleBlurCard = (
    event: ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    const value = event.target.value;
    if (value.length === 0 && (name === 'card' || name === 'cardConfirm')) {
      return setError(name, {
        type: 'required',
      });
    }
    if (value.length !== 4 && (name === 'card' || name === 'cardConfirm')) {
      return setError(name, {
        type: 'minLength',
      });
    }
  };

  const handleBlurSelect = (name: KeyCustomerInfo) => {
    if (!getValues(name)) {
      return setError(name, {
        type: 'required',
      });
    }
  };

  const handleChangeSelect = (value: ISelect, name: KeyCustomerInfo) => {
    setValue(name, value);
    clearErrors(name);
  };

  const checkShowErrorCard = () => {
    if (errors.card?.type === 'minLength') return MESSAGE_4_DIGITS;
    if (errors.card?.type === 'required') return MESSAGE_REQUIRED;
    if (errors.card?.type === 'other') return MESSAGE_CHECK_PIN;
    if (errors.card?.type === 'pattern') return MESSAGE_PIN_PATTERN;
    if (errors.card?.type === 'duplication') return MESSAGE_DIFFIRENT_NUMBER;
    if (errors.card?.type === 'checkDate') return MESSAGE_COMBINATION_DATE;
    if (errors.card?.type === 'validatePhoneNumber')
      return MESSAGE_COMBINATION_PHONE;
    if (errors.card?.type === 'validateNumberJMB')
      return MESSAGE_COMBINATION_JMB_NUMBER;
  };

  const checkShowErrorCardConfirm = () => {
    if (errors.cardConfirm?.type === 'minLength') return MESSAGE_4_DIGITS;
    if (errors.cardConfirm?.type === 'required') return MESSAGE_REQUIRED;
    if (errors.cardConfirm?.type === 'other') return MESSAGE_CHECK_PIN;
    if (errors.cardConfirm?.type === 'pattern') return MESSAGE_PIN_PATTERN;
  };

  if (dataRegis?.message && dataRegis?.message == 'Invalid appToken') {
    logMessageEvent('ON_ERROR', dataRegis, '/view/registration');

    return <Loading />;
  }

  if (dataRegis === 'ERROR_API') {
    return (
      <ModalError
        content={MESSAGE_ERROR_API}
        isShow={true}
        handleCancel={() => logMessageEvent('ON_CLICK_BUTTON_BACK_PHONE')}
      />
    );
  }

  return (
    <div>
      {isShowModalPdf && (
        <div>
          <div className='w-screen h-screen bg-black-50 fixed z-10'></div>
          <div className='flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 w-[320px] mx-auto'>
            <div className='relative bg-white rounded-xl shadow'>
              <div className='relative px-4 pt-10 py-5'>
                <p className='font-weight-600 text-base-16-120 text-center'>
                  居住地国について
                </p>
                <button
                  type='button'
                  className='text-black-50 bg-black-10 rounded-[40px] text-sm w-6 h-6 ml-auto inline-flex justify-center items-center absolute top-3 right-4'
                  onClick={() => setIsShowModalPdf(false)}
                >
                  <svg
                    className='w-2 h-2'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 14 14'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                    />
                  </svg>
                </button>
              </div>
              <div className='px-4 pb-10'>
                <p className='mb-2'>
                  ・2017年1月1日以降に新規に口座開設を行うお客さまは、租税条約等の実施に伴う所得税法、法人税法及び地方税法の特例等に関する法律等の規定により、金融機関において、所定のお取引を行う場合には、お客さまによる届出書のご提出と金融機関による届出書記載内容の確認、記録の作成・保存が義務付けられています。
                </p>
                <p>
                  ・届出をいただけない場合、または虚偽の内容を含む届出をされた場合には、お取引をお断りすることがある他、お客さまへの罰則が科される可能性もございますので、ご理解・ご協力のほどよろしくお願いいたします。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <StepList currentStep={currentStep.current} />
      <div className='bg-linear-gradient'>
        <div className='px-4 py-8'>
          {!!Object.keys(errors).length && (
            <div className='p-4 mb-8 h-[53px] rounded-lg bg-red-rgba-01 border border-pink-FF3355 border-solid flex items-center'>
              <span className='icon-icon-report'></span>
              <span className='ml-2 font-weight-600 text-base-14-150 text-red-FF3355'>
                入力不備があります。
              </span>
            </div>
          )}
          <p className='font-weight-600 text-base-24-120'>お客様情報の入力</p>
          <p className='text-black-75 py-3'>
            ご入力内容と本人確認書類の内容が異なる場合は、住信SBIネット銀行
            JAL支店口座がご利用いただけませんのでご注意ください。{' '}
          </p>
          <p className='text-base-11-150 text-black-50'>
            JAL Payご入会者さま情報の入力兼、JAL NEOBANK
            住信SBIネット銀行JAL支店-口座開設入力兼特定取引を行う者の届出{' '}
          </p>
          <p className='font-weight-600 text-base-16-120 mb-4 mt-8'>
            メールアドレス
          </p>
          <Input
            name='mailAddress'
            placeholder='sample@kayac.com'
            register={register}
            disabled
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            {customLabel(
              errors.hasOwnProperty('lastNameKanji') ||
                errors.hasOwnProperty('firstNameKanji'),
              'お名前（漢字）',
            )}
            <div className='flex gap-4'>
              <Input
                label='姓'
                name='lastNameKanji'
                register={register}
                disabled
              />
              <Input
                label='名'
                name='firstNameKanji'
                register={register}
                disabled
              />
            </div>

            {customLabel(
              errors.hasOwnProperty('lastNameKana') ||
                errors.hasOwnProperty('firstNameKana'),
              'お名前（カナ）',
            )}
            <div className='flex gap-4'>
              <Input
                label='姓'
                name='lastNameKana'
                register={register}
                disabled
              />
              <Input
                label='名'
                name='firstNameKana'
                register={register}
                disabled
              />
            </div>

            {customLabel(
              errors.hasOwnProperty('lastNameRomaji') ||
                errors.hasOwnProperty('firstNameRomaji'),
              'お名前（ローマ字）',
            )}
            <p className='text-black-75 pt-3'>
              パスポートに記載のとおりにご入力ください。
              <br />
              パスポートをお持ちでない場合は、
              <span
                className='font-weight-600 text-black-1A2533'
                onClick={() =>
                  logMessageEvent(
                    'ON_WEB_TO',
                    null,
                    'https://www.jal.co.jp/121/world/enrollproposal.html?_ga=2.186122985.1122588496.1685336282-987692732.1634618259&_gl=1*6qqqk9*_ga*OTg3NjkyNzMyLjE2MzQ2MTgyNTk.*_ga_GZCRTB3L9M*MTY4NTMzNjI4Mi43MC4xLjE2ODUzMzYyOTcuNDUuMC4w*_fplc*VENhWlc1T1RIRENzT1ZBakFjQVo4cDFWTkVwV1Bubm4xU2c4QjAxTVFNdHdXVmZtNndmcnU4UTVGTnVGTEZ1dFV1bE5mTW1HbGElMkZKSFVWcU1aV0diUHRheVJkanl3WFlUQzFMekd0eEtSYzhHVkJhYXAyaW02R2NTcU1iU1ElM0QlM0Q',
                  )
                }
              >
                こちら
              </span>
              にしたがってご入力ください。
              <br />
              JALの航空券予約時に使用します。
            </p>
            <div className='flex gap-4'>
              <Input
                label='姓'
                name='lastNameRomaji'
                register={register}
                disabled
              />
              <Input
                label='名'
                name='firstNameRomaji'
                register={register}
                disabled
              />
            </div>
            <Input
              label='ミドルネーム'
              name='middleName'
              register={register}
              disabled
              onChange={e => setValue('middleName', e.target.value)}
            />
            <p className='text-black-75 my-3'>
              ※既にJALマイレージバンク（JMB）会員の方はお名前が自動的に表示されています。
            </p>
            <p className='text-black-75'>
              ※お名前を修正する場合は、JALマイレージバンクまでお問い合わせください。
            </p>

            {customLabel(
              errors.hasOwnProperty('country'),
              '居住地国の確認（特定取引を行う者の届出）',
            )}
            <p className='text-black-75 mb-4 mt-3'>
              お客さまの居住地国（納税国）を選択してください。居住地国が複数ある場合は、「日本のみ以外」を選択してください。
              くわしくは
              <span
                className='font-weight-600 text-black-1A2533'
                onClick={() => setIsShowModalPdf(true)}
              >
                こちら
              </span>
            </p>
            <div className='flex flex-col gap-5 mb-6'>
              <p className='flex items-center'>
                <input
                  id='japanOnly'
                  type='radio'
                  className='w-[20px] h-[20px] accent-red-E62E2E'
                  value='japanOnly'
                  {...register('country', { required: true })}
                />
                <label htmlFor='japanOnly' className='ml-4 text-base-16-24'>
                  日本のみ
                </label>
              </p>
              <p className='flex items-center'>
                <input
                  id='ortherThanJapan'
                  type='radio'
                  className='w-[20px] h-[20px] accent-red-E62E2E'
                  value='ortherThanJapan'
                  {...register('country', { required: true })}
                />
                <label
                  htmlFor='ortherThanJapan'
                  className='ml-4 text-base-16-24'
                >
                  日本のみ以外
                </label>
              </p>
            </div>
            {errors.country && (
              <p className='flex align-items-center mt-6'>
                <span className='icon-icon-report'></span>
                <span className='text-pink-FF3355 text-base-12-120 pl-1'>
                  選択してください
                </span>
              </p>
            )}

            <p className='font-weight-600 text-base-16-120 mb-4 mt-8'>住所</p>
            <div className='w-[105px]'>
              <Input
                label='郵便番号'
                name='addressZipCode'
                register={register}
                disabled
              />
            </div>
            <Input
              label='住所'
              name='addressLine1'
              register={register}
              disabled
            />
            <Input name='addressLine2' register={register} disabled />
            <Input name='addressLine3' register={register} disabled />

            {customLabel(errors.hasOwnProperty('country'), '電話番号', false)}
            <p className='text-black-75 mb-4 mt-3'>
              電話番号は、当社からの緊急のご連絡のほか、アカウントの復旧や認証、電話番号の変更などに利用します。
            </p>
            <Input
              type='number'
              label='携帯電話'
              name='phoneNumber'
              value={phoneNumber}
              register={register}
              disabled
            />

            {customLabel(errors.hasOwnProperty('profession'), '職業')}
            <div>
              <Select
                name='profession'
                instanceId='profession'
                placeholder='選択してください'
                options={OPTION_PROFESSTION}
                control={control}
                required
                error={errors.profession ? '選択してください' : ''}
                onBlur={() => handleBlurSelect('profession')}
                onChange={e => handleChangeSelect(e, 'profession')}
              />
            </div>

            {customLabel(
              errors.hasOwnProperty('transaction'),
              '取引目的（JAL Pay）',
            )}
            <div>
              <Select
                name='transaction'
                instanceId='transaction'
                placeholder='選択してください'
                options={OPTION_TRANSACTION_PURPOSES}
                control={control}
                required
                error={errors.transaction ? '選択してください' : ''}
                onBlur={() => handleBlurSelect('transaction')}
                onChange={e => handleChangeSelect(e, 'transaction')}
              />
            </div>

            {customLabel(errors.hasOwnProperty('travelSchedule'), '渡航予定')}
            <div className='flex flex-col gap-5 mt-5'>
              <p className='flex items-center'>
                <input
                  id='haveSchedule'
                  type='radio'
                  className='w-[20px] h-[20px] accent-red-E62E2E'
                  value='yes'
                  {...register('travelSchedule', { required: true })}
                />
                <label htmlFor='haveSchedule' className='ml-4 text-base-16-24'>
                  あり
                </label>
              </p>
              <p className='flex items-center'>
                <input
                  id='noSchedule'
                  type='radio'
                  className='w-[20px] h-[20px] accent-red-E62E2E'
                  value='no'
                  {...register('travelSchedule', { required: true })}
                />
                <label htmlFor='noSchedule' className='ml-4 text-base-16-24'>
                  なし
                </label>
              </p>
            </div>
            {errors.travelSchedule && (
              <p className='flex align-items-center mt-6'>
                <span className='icon-icon-report'></span>
                <span className='text-pink-FF3355 text-base-12-120 pl-1'>
                  選択してください
                </span>
              </p>
            )}

            {customLabel(errors.hasOwnProperty('travelDate'), '渡航日')}
            <Controller
              control={control}
              name='travelDate'
              rules={{ required: watchTravelSchedule === 'no' ? false : true }}
              render={({ field: { value } }) => (
                <CustomDatePicker
                  name='travelDate'
                  value={value}
                  disabled={watchTravelSchedule === 'no' ? true : false}
                  onChange={date => handleChangeSelect(date, 'travelDate')}
                  onBlur={() => handleBlurSelect('travelDate')}
                  error={errors.travelDate ? MESSAGE_REQUIRED : ''}
                />
              )}
            />

            {customLabel(errors.hasOwnProperty('destination'), '渡航先')}
            <div>
              <Select
                name='destination'
                instanceId='destination'
                placeholder='選択してください'
                options={OPTION_DESTINATION}
                control={control}
                required={watchTravelSchedule === 'no' ? false : true}
                disabled={watchTravelSchedule === 'no' ? true : false}
                error={errors.destination ? '選択してください' : ''}
                onBlur={() => handleBlurSelect('destination')}
                onChange={e => handleChangeSelect(e, 'destination')}
              />
            </div>

            {customLabel(
              errors.hasOwnProperty('card') ||
                errors.hasOwnProperty('cardConfirm'),
              'カード暗証番号',
            )}
            <p className='text-black-75 my-3'>
              カードをご利用いただく際に必要となる4桁の数字を入力してください。
            </p>
            <Input
              inputMode='numeric'
              type='password'
              name='card'
              required
              register={register}
              minLength={4}
              error={checkShowErrorCard()}
              onChange={e => changeNumber(e, 'card')}
              onBlur={e => handleBlurCard(e, 'card')}
            />
            <p className='text-black-75 my-3'>
              確認のためもう一度入力してください。
            </p>
            <div className='mb-8'>
              <Input
                inputMode='numeric'
                type='password'
                name='cardConfirm'
                required
                register={register}
                minLength={4}
                error={checkShowErrorCardConfirm()}
                onChange={e => changeNumber(e, 'cardConfirm')}
                onBlur={e => handleBlurCard(e, 'cardConfirm')}
              />
            </div>
            <div className='bg-white ml-[-16px] w-screen pt-8'>
              <button
                type='submit'
                className='rounded-md text-white font-weight-600 bg-red-E62E2E h-11 w-[calc(100%-32px)] ml-4'
              >
                入力内容の確認へ進む
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Registration;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  let dataRegis: any;
  const getCookies = getCookie('data-regis', { req, res });
  const getToken = getCookie('app-token', { req, res });
  const getAuthCode = getCookie('authentication-code', { req, res });
  if (getCookies) {
    dataRegis = JSON.parse(getCookies as string);
  } else {
    if (getAuthCode) {
      const response = await getMemberInfo(
        getAuthCode as string,
        getToken as string,
      );
      if (response.status == 200) {
        const memberprofile = response.data.jmbMemberProfile.memberprofile;
        let firstNameRomaji, lastNameRomaji, middleName;
        if (memberprofile.profile.romajiName.split(' ').length === 3) {
          (lastNameRomaji =
            memberprofile.profile.romajiName.split(' ')[0] || ''),
            (middleName = memberprofile.profile.romajiName.split(' ')[1] || '');
          firstNameRomaji =
            memberprofile.profile.romajiName.split(' ')[2] || '';
        } else {
          (lastNameRomaji =
            memberprofile.profile.romajiName.split(' ')[0] || ''),
            (firstNameRomaji =
              memberprofile.profile.romajiName.split(' ')[1] || '');
          middleName = '';
        }
        dataRegis = {
          jmbCustomerId: response.data.jmbMemberProfile.jmbCustomerId,
          firstNameKanji: memberprofile.profile.kanjiName.split(' ')[1] || '',
          lastNameKanji: memberprofile.profile.kanjiName.split(' ')[0] || '',
          firstNameKana: memberprofile.profile.kanaName.split(' ')[1] || '',
          lastNameKana: memberprofile.profile.kanaName.split(' ')[0] || '',
          firstNameRomaji,
          lastNameRomaji,
          middleName,
          gender: memberprofile.profile.gender,
          dateOfBirth: memberprofile.profile.dateOfBirth,
          country:
            memberprofile.profile.addressInfo.countryOfResidence === 'JP'
              ? 'japanOnly'
              : 'ortherThanJapan',
          addressZipCode: memberprofile.profile.addressInfo.homeAddress.zipCode,
          addressLine1:
            memberprofile.profile.addressInfo.homeAddress?.addressLine1 || '',
          addressLine2:
            memberprofile.profile.addressInfo.homeAddress?.addressLine2 || '',
          addressLine3:
            memberprofile.profile.addressInfo.homeAddress?.addressLine3 || '',
          mailAddress:
            memberprofile.profile.emailAddress.emailAddress1 ||
            memberprofile.profile.emailAddress.emailAddress2 ||
            '',
        };
      } else if (response.status == 401) {
        dataRegis = response.data.errors[0];
      } else if (response.status == 400) {
        return {
          redirect: {
            permanent: false,
            destination: '/error-expires',
          },
        };
      } else {
        dataRegis = 'ERROR_API';
      }
    } else return { props: {} };
  }

  return {
    props: {
      dataRegis,
    },
  };
};
