// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import { logMessageEvent } from '@/utils/function';
import Image from 'next/image';

interface IPDF {
  url: string;
  text?: string;
}
const PDF = ({ text, url }: IPDF) => {
  const handleClickPDF = () => {
    logMessageEvent('ON_WEB_TO', null, url);
  };

  return (
    <div
      className='w-full bg-white rounded-[8px] border-[1px] border-black-rgba-01 border-solid shadow-btn-pdf flex items-center p-[8px] mt-[16px]'
      onClick={handleClickPDF}
    >
      <Image
        src='/view/icons/pdf.png'
        alt=''
        width={24}
        height={24}
        className='w-6 h-6'
      />
      <span className='ml-[10px] w-full text-left font-weight-600 text-base-14-150 text-black-1A2533'>
        {text}
      </span>
      <span className='icon-arrow-right text-[25px] text-black-50'></span>
    </div>
  );
};

export default PDF;
