// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import Loading from '@/components/loading';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const License = () => {
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
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='bg-black-F5F5F5 px-4 py-6 h-screen w-screen'>
      {isIphone ? (
        <div>
          <div className='mb-6'>
            <p className='text-base-16-120 font-weight-600 text-black'>
              Alamofire
            </p>
            <p className='text-black my-1'>The MIT license, version 5.6.4</p>
            <Link
              className='text-blue-2563eb break-words'
              href='https://github.com/Alamofire/Alamofire'
            >
              https://github.com/Alamofire/Alamofire
            </Link>
          </div>
          <div className='mb-6'>
            <p className='text-base-16-120 font-weight-600 text-black'>
              CombineCocoa
            </p>
            <p className='text-black my-1'>The MIT license, version 0.4.1</p>
            <Link
              className='text-blue-2563eb break-words'
              href='https://github.com/CombineCommunity/CombineCocoa'
            >
              https://github.com/CombineCommunity/CombineCocoa
            </Link>
          </div>
          <div className='mb-6'>
            <p className='text-base-16-120 font-weight-600 text-black'>
              ESPullToRefresh
            </p>
            <p className='text-black my-1'>The MIT license, version 2.9.3</p>
            <Link
              className='text-blue-2563eb break-words'
              href='https://github.com/eggswift/pull-to-refresh'
            >
              https://github.com/eggswift/pull-to-refresh
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className='mb-6'>
            <p className='text-base-16-120 font-weight-600 text-black'>
              Retrofit
            </p>
            <p className='text-black my-1'>Apache license, version 2.0</p>
            <Link
              className='text-blue-2563eb break-words'
              href='https://github.com/square/retrofit'
            >
              https://github.com/square/retrofit
            </Link>
          </div>
          <div className='mb-6'>
            <p className='text-base-16-120 font-weight-600 text-black'>
              OkHttp
            </p>
            <p className='text-black my-1'>Apache license, version 2.0</p>
            <Link
              className='text-blue-2563eb break-words'
              href='https://square.github.io/okhttp/'
            >
              https://square.github.io/okhttp/
            </Link>
          </div>
          <div className='mb-6'>
            <p className='text-base-16-120 font-weight-600 text-black'>Glide</p>
            <p className='text-black my-1'>Apache license, version 2.0</p>
            <Link
              className='text-blue-2563eb break-words'
              href='https://github.com/bumptech/glide'
            >
              https://github.com/bumptech/glide
            </Link>
          </div>
          <div className='mb-6'>
            <p className='text-base-16-120 font-weight-600 text-black'>
              Countdown timer
            </p>
            <p className='text-black my-1'>Apache license, version 2.0</p>
            <Link
              className='text-blue-2563eb break-words'
              href='https://github.com/arkivanov/android-dev-challenge-compose-2'
            >
              https://github.com/arkivanov/android-dev-challenge-compose-2
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default License;
