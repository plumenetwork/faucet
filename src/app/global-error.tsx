'use client';

import Error from 'next/error';
import { FC } from 'react';

type GlobalErrorProps = {
  error: Error;
};

const GlobalError: FC<GlobalErrorProps> = ({ error }) => {
  return (
    <html>
      <body>
        <Error statusCode={500} title='An unexpected error has occurred' />
      </body>
    </html>
  );
};

export default GlobalError;
