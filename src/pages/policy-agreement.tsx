// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import Footer from '@/components/footer';
import StepList from '@/components/Step';
import Checkbox from '@/components/checkbox';
import { useEffect, useRef, useState } from 'react';
import PDF from '@/components/pdf';
import router from 'next/router';
import { getCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next/types';
import { logEventGA, logMessageEvent } from '@/utils/function';

interface Props {
  data?: any;
}

const PolicyAgreement = ({ data }: Props) => {
  const currentStep = useRef(1);
  const [checkUseJalpay, setCheckUseJalpay] = useState<boolean>(false);
  const [checkUseNeobank, setCheckUseNeobank] = useState<boolean>(true);
  const [checkAntiSocial, setAntiSocial] = useState<boolean>(false);
  const [errorUseJalpay, setErrorUseJalpay] = useState<boolean>(false);
  const [errorAntiSocial, setErrorAntiSocial] = useState<boolean>(false);

  useEffect(() => {
    const getValueChecked = data && JSON.parse(data);
    if (getValueChecked) {
      setCheckUseJalpay(getValueChecked['checkUseJalpay']);
      setCheckUseNeobank(getValueChecked['checkUseNeobank']);
      setAntiSocial(getValueChecked['checkAntiSocial']);
    }
  }, []);

  useEffect(() => {
    if (checkUseJalpay && errorUseJalpay) setErrorUseJalpay(false);
    if (checkAntiSocial && errorAntiSocial) setErrorAntiSocial(false);
  }, [checkUseJalpay, checkAntiSocial]);

  useEffect(() => {
    if (!checkUseNeobank) {
      setErrorAntiSocial(false);
      setAntiSocial(false);
    }
  }, [checkUseNeobank]);

  const changeUseJalpay = () => {
    setCheckUseJalpay(!checkUseJalpay);
  };

  const changeUseNeobank = () => {
    setCheckUseNeobank(!checkUseNeobank);
  };

  const changeAntiSocial = () => {
    setAntiSocial(!checkAntiSocial);
  };

  const handleSubmit = async () => {
    const isError = checkErrorWhenSubmit();
    if (isError) {
      window.scrollTo(0, 0);
    } else {
      const dataPolicy = {
        checkUseJalpay,
        checkUseNeobank,
        checkAntiSocial,
      };
      setCookie('policy', JSON.stringify(dataPolicy));
      router.push('/phone-number-confirm');
    }
  };

  const checkErrorWhenSubmit = () => {
    if (!checkUseJalpay) {
      setErrorUseJalpay(true);
      checkUseNeobank && !checkAntiSocial && setErrorAntiSocial(true);
      return true;
    }
    if (checkUseNeobank && !checkAntiSocial) {
      setErrorAntiSocial(true);
      return true;
    }
    return false;
  };

  const handleClickBack = () => {
    logMessageEvent('ON_CLICK_BUTTON_BACK');
    logEventGA('ON_CLICK_BACK_GA');
  };

  return (
    <div>
      <StepList currentStep={currentStep.current}></StepList>
      <div className='px-4 py-8 bg-linear-gradient-5'>
        {errorUseJalpay && (
          <div className='p-4 mb-8 h-[53px] rounded-lg bg-red-rgba-01 border border-pink-FF3355 border-solid flex items-center'>
            <span className='icon-icon-report'></span>
            <span className='ml-2 font-weight-600 text-base-14-150 text-red-FF3355'>
              JAL Pay会員規約に同意してください。
            </span>
          </div>
        )}
        {!errorUseJalpay && errorAntiSocial && (
          <div className='p-4 mb-8 h-[53px] rounded-lg bg-red-rgba-01 border border-pink-FF3355 border-solid flex items-center'>
            <span className='icon-icon-report'></span>
            <span className='ml-2 font-weight-600 text-base-14-150 text-red-FF3355'>
              反社会勢力ではないことの表明・確約を確認してください。
            </span>
          </div>
        )}
        <p className='text-base-16-120 font-weight-600 text-red-E62E2E'>
          規約同意
        </p>
        <p className='text-base-24-120 font-weight-600 pt-2'>JAL Pay</p>
        <p className='text-base-14-150 text-black-75 font-weight-300 pt-2'>
          JAL Pay会員規約にご同意ください。
        </p>
        <div className='mt-8 p-3 bg-white font-weight-300 border border-black-25 h-[192px] overflow-scroll'>
          <p>第1章 総則</p>
          <p>第1条 適用範囲</p>
          <p>
            1本規約は、JALペイメント・ポート株式会社（以下「当社」といいます。）の提供するJAL
            Global WALLETサービスに関する取扱いについて定めるものです。JAL
            Global
            WALLETサービスを利用しようとする者（以下「利用希望者」といいます。）は、本規約の内容を十分に理解し、本規約にご同意いただいたうえで、JAL
            Global WALLETアカウントを開設し、JAL Global
            WALLETサービスをご利用いただくものとします。
          </p>
          <p>
            2JAL Global
            WALLETサービスは、日本航空株式会社（以下「JAL」といいます。）が提供するJALマイレージバンク（以下「JMB」といいます。）の会員資格をお持ちの方向けのサービスとなります。JMBの会員資格をお持ちでない方は、JAL所定の手続に従い、JMB入会の申込をしてください。
          </p>
          <p>
            3未成年者は、法定代理人の同意を得たうえでJAL Global
            WALLETサービスをご利用いただくものとします。
          </p>
          <p>
            4第11条により積算されるマイルの利用については、JALまたはその提携先が定める規約等（以下「JMB会員規約等」といいます。）が別途適用されます。
          </p>
          <p>第2条 定義</p>
          <p>
            1「JAL Global WALLET」とは、当社所定の手続を経て開設されるJAL Global
            WALLETサービスにおけるアカウントをいいます。
          </p>
          <p>
            2「JAL Global
            WALLETサービス」とは、当社が提供する一切のサービスをいいます。
          </p>
          <p>
            3「ウォレット」とは、ショッピング専用ウォレットおよび出金可能ウォレットを個別にまたは総称していいます。
          </p>
          <p>
            4「ウォレット保有者」とは、ショッピング専用ウォレット保有者および出金可能ウォレット保有者を個別にまたは総称していいます。
          </p>
          <p>5「会員」とは、JAL Global WALLETを保有する者をいいます。 </p>
        </div>
        <div
          className={`mt-8 border-solid bg-white flex items-start p-4 rounded-lg border-2 shadow-box-rules ${
            errorUseJalpay ? 'border-red-FF3355' : 'border-black-rgba-01'
          }`}
          onClick={changeUseJalpay}
        >
          <Checkbox
            value={checkUseJalpay}
            onChange={e => setCheckUseJalpay(e.target.checked)}
          />
          <div className='pl-4'>
            <p className='font-weight-600'>
              JALペイメント・ポート株式会社が定める上記の「JAL
              Pay会員規約」および「個人情報のお取り扱いについて」に同意する
            </p>
            <p className='text-base-11-150 text-black-75 mt-2'>
              申込者が20歳未満の場合、親権者の同意を得て申し込みます。15歳未満の方はお申し込みいただけません。
            </p>
          </div>
        </div>
        {errorUseJalpay && (
          <div className='flex items-center mt-2'>
            <span className='icon-icon-report'></span>
            <span className='ml-1 text-base-12-120 text-red-FF3355'>
              必ず選択してください
            </span>
          </div>
        )}
        <div className='mt-8 w-full border border-black-25 border-dashed'></div>
        <div className='mt-8'>
          <p className='text-base-16-120 font-weight-600 text-red-E62E2E'>
            規約同意
          </p>
          <p className='my-2 text-base-24-120 font-weight-600'>JAL NEOBANK</p>
          <p className='text-base-14-150 text-black-535C66'>
            JAL Payのチャージ元となる、JAL NEOBANK（住信SBIネット銀行
            JAL支店）の銀行口座を開設してください。すでに住信SBIネット銀行の口座をお持ちの方も開設できます。{' '}
          </p>
          <p className='mt-2 text-base-14-150 text-black-535C66'>
            住信SBIネット銀行 JAL支店 口座開設 - 申込 - 兼
            特定取引を行う者の届出 - 同意
          </p>
        </div>
        <div
          className='mt-8 bg-white flex items-start p-4 border-2 border-solid border-black-rgba-01 rounded-[8px] shadow-box-rules'
          onClick={changeUseNeobank}
        >
          <div>
            <Checkbox
              value={checkUseNeobank}
              onChange={e => {
                setCheckUseNeobank(e.target.checked);
              }}
            ></Checkbox>
          </div>
          <div>
            <p className='ml-4 font-weight-600'>
              JAL NEOBANK（住信SBIネット銀行 JAL支店口座）を申し込む
            </p>
            <div className='ml-4 py-[2px] px-1 rounded-[4px] w-8 h-[17px] mt-[10px] text-green text-base-11-120 font-weight-600 bg-green-10'>
              任意
            </div>
            <p className='ml-4 mt-[10px] font-weight-300 text-base-11-150 text-black-75'>
              JAL Payへのチャージ手数料が無料。お取り引きがスムーズになります。
            </p>
          </div>
        </div>
        {checkUseNeobank && (
          <div className='mt-8'>
            <p className='text-base-16-120 font-weight-600 mb-4'>
              ご注意ください
            </p>
            <div className='font-weight-300 text-base-14-150 text-black-75'>
              <p>
                必ず口座名義人ご自身が当社規定等を理解されたうえでお申込みください。
                <br />
                なお、申込内容等について当社より確認させていただく場合があります。
                <br />
                ご本人さま以外のかた（ご家族を含む）が口座を開設した疑いがある場合にはご利用の停止または解約をさせていただくことがあります。
                <br />
                不正利用を目的とした第三者による口座開設や、第三者への口座譲渡・売却は犯罪です。
                <br />
                （法律により懲役もしくは罰金またはその両方に科せられる可能性があります。）
                <br />
                外国政府等における重要な公人等にあたらないこと（または過去に当該地位にないこと）をご確認のうえ、お申込みください。
              </p>
            </div>
            <PDF
              text='外国政府等における重要な公人等のご確認について'
              url='https://www.netbk.co.jp/contents/resources/pdf/doc_peps.pdf?_ebx=gozjgko6gu.1688092719.7r6gvp3'
            ></PDF>
            <p className='font-weight-600 text-base-16-120 mt-8'>
              以下の規定類をお読みください
            </p>
            <PDF
              text='JAL NEOBANK特約'
              url='https://www.netbk.co.jp/contents/resources/pdf/term_neobank-jal.pdf?_ebx=gozjgko6gu.1688092719.7r6gvar'
            ></PDF>
            <PDF
              text='個人情報のお取り扱いについて'
              url='https://www.netbk.co.jp/contents/resources/pdf/privacy_policy_03.pdf?_ebx=gozjgko6gu.1688092719.7r6gwjj'
            ></PDF>
            <PDF
              text='電子交付について'
              url='https://www.netbk.co.jp/contents/resources/pdf/term_denshi.pdf?_ebx=gozjgko6gu.1688092719.7r6gwm4'
            ></PDF>
            <PDF
              text='各種取引規定'
              url='https://www.netbk.co.jp/contents/resources/pdf/term_kakushu.pdf?_ebx=gozjgko6gu.1688092719.7r6gwpu'
            ></PDF>
            <PDF
              text='個人情報の第三者提供について（JALペイメント・ポート／住信SBIネット銀行）'
              url='https://www.jal-globalwallet.com/terms/member04.pdf?_gl=1*1gfodr*_ga*OTM0MDc2OTIuMTY4ODA5MjcxMA..*_ga_M78X2NBYF0*MTY4ODA5MjcxMC4xLjEuMTY4ODA5Mjk2OS4zOC4wLjA.*_fplc*dXhxRU5xREU0QXdaZmh2dldSNkJCdTFSZG45JTJGTTZLcm1aU0ljOTBrUHZqamhDa1RBbFRzaTBMNEJGTjFNVVhBclJzVUZTRDIyVlRXSUtDekh4Y2NYdnY2UFdzYiUyQnhrTkthbDREQWVXREVYSHNDJTJCelM5SFh1RmxlRG12c3lnJTNEJTNE*_ga_61WF43F8Q0*MTY4ODA5MjcxMC4xLjEuMTY4ODA5Mjk2OS4wLjAuMA..*_ga_GZCRTB3L9M*MTY4ODA5MjcxMy4xLjEuMTY4ODA5MjcxOS41NC4wLjA.&_ga=2.156048059.1452409715.1688092710-93407692.1688092710'
            ></PDF>
            <p className='text-base-16-120 font-weight-600 pt-8'>
              「租税条約等の実施に伴う所得税法、法人税法及び地方税法の特例等に関する法律」に基づく、特定取引の届出
            </p>
            <p className='text-base-14-150 text-black-75 pt-4'>
              私は、「租税条約等の実施に伴う所得税法、法人税法及び地方税法の特例等に関する法律」第10条の5第1項前段の規定に基づき、同条第7項第1号に規定する金融機関等である貴社に対して特定取引を行う者の届出をいたします。私は、本届出に入力した情報が正確であることを宣誓します。
              <br />
              また、居住地国等、届出内容に変更があった場合、変更日から3ヵ月以内に異動届出書を提出します。
            </p>
            <p className='text-base-16-120 font-weight-600 pt-8'>
              海外ATM現地通貨お引出しについて
            </p>
            <p className='mt-4 text-base-14-150 font-weight-300 text-black-75'>
              海外における預金のお引出しの目的は、外国為替及び外国貿易法、およびその関連法律上の許可または届け出を要しない範囲の滞在費等（※）に限定されます。
            </p>
            <p className='mt-6 text-base-14-150 font-weight-300 text-black-75'>
              ※現地での宿泊費、交通費、食事代、身の回りの品、土産物の購入費、学費、医療費等。
            </p>
            <p className='text-base-16-120 font-weight-600 pt-8'>
              反社会勢力ではないことの表明・確約
            </p>
            <p className='mt-4 text-base-14-150 font-weight-300 text-black-75'>
              以下のPDFファイルをお読み頂いた上で、反社会勢力ではないことの表明・確約を確認してください。
            </p>
            <PDF
              text='反社会勢力ではないことの表明・確約'
              url='https://www.netbk.co.jp/contents/resources/pdf/express_hansya.pdf'
            ></PDF>
            <div
              className={`mt-4 bg-white flex items-start p-4 ${
                errorAntiSocial ? 'border-red-FF3355' : 'border-black-rgba-01'
              } border-[2px] border-solid rounded-[8px] shadow-box-rules'`}
              onClick={changeAntiSocial}
            >
              <Checkbox
                value={checkAntiSocial}
                onChange={e => {
                  setAntiSocial(e.target.checked);
                }}
              ></Checkbox>
              <p className='ml-4 text-base-14-150  font-weight-600'>
                反社会勢力ではないことの表明・確約を確認しました
              </p>
            </div>
            {errorAntiSocial && (
              <div className='flex items-center mt-[9px]'>
                <span className='icon-icon-report'></span>
                <span className='ml-[5px] font-weight-300 text-base-12-120 text-red-FF3355'>
                  必ず選択してください
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className='px-4 py-8 bg-white'>
        <div>
          <button
            className='h-11 rounded-[6px] w-full flex items-center justify-center bg-red-E62E2E font-weight-600 text-base-14-100 text-white'
            onClick={handleSubmit}
          >
            規約に同意する
          </button>
        </div>
        <div>
          <button
            className='mt-4 h-11 rounded-[6px] w-full flex items-center justify-center bg-black-5 font-weight-600 text-base-14-100 text-black-75'
            onClick={handleClickBack}
          >
            規約に同意しない
          </button>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default PolicyAgreement;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  let data: any;
  const getCookies = getCookie('policy', { req, res });
  data = getCookies ?? '';

  return {
    props: {
      data,
    },
  };
};
