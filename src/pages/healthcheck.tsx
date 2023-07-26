// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import React from 'react';
import { useRouter } from 'next/router';

type Props = {};

const HealthCheck = (props: Props) => {
  const router = useRouter();
  const handleClick = () => {
    router.query.back = 'jmb-home';
    router.push(router);
  };
  return (
    <div className='bg-red-300 h-screen'>
      <button className='px-4 py-2 rounded-lg bg-sky-600' onClick={handleClick}>
        Click
      </button>
    </div>
  );
};

export default HealthCheck;
