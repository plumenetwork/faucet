'use client';

import * as Sentry from '@sentry/nextjs';
import Error from 'next/error';
import { FC, useEffect } from 'react';

type GlobalErrorProps = {
  error: Error;
};

const GlobalError: FC<GlobalErrorProps> = ({ error }) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <Error statusCode={500} title='An unexpected error has occurred' />
      </body>
    </html>
  );
};

export default GlobalError;
