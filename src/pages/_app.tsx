// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import '@/styles/globals.css';
import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import React, { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next/types';
import { ErrorBoundary } from 'react-error-boundary';

export type NextPageWithLayout = NextPage & {
  pageLayout?: (children: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function Fallback({ error }: any) {
  console.log(error);

  return (
    <div role='alert'>
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.props.message}</pre>
    </div>
  );
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const pageLayout = Component.pageLayout ?? (children => children);
  return pageLayout(
    <ErrorBoundary FallbackComponent={Fallback}>
      <SWRConfig value={{ provider: () => new Map() }}>
        <Component {...pageProps} />
      </SWRConfig>
    </ErrorBoundary>,
  );
}
