// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G

import { TERM_OF_USE } from '@/constants/termOfUse';

const TermOfUse = () => {
  return (
    <div className='px-4 py-6 w-screen'>
      <p className='mb-6 text-black'>
        JALマイレージバンクアプリサービス利用規約
      </p>
      {TERM_OF_USE.map((it, index) => (
        <>
          <div className='text-black mt-6' key={index}>
            <p className='label-term-of-use border-b-3 border-black-DCDCDC text-base-16-175 font-weight-600 relative'>
              {it.title}
            </p>
            <div
              className='mt-4'
              dangerouslySetInnerHTML={{ __html: it.content }}
            />
          </div>
        </>
      ))}
      <p className='my-6 text-black'>以上</p>
    </div>
  );
};

export default TermOfUse;
