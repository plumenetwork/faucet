'use client';

import { datadogRum } from '@datadog/browser-rum';
import { config } from '@/app/config';

datadogRum.init({
  applicationId: config.dataDogApplicationId,
  clientToken: config.dataDogClientToken,
  site: 'datadoghq.com',
  service: config.dataDogService,
  env: config.dataDogEnv,
  // Specify a version number to identify the deployed version of your application in Datadog
  // version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
});

const DatadogInit = () => {
  // Render nothing - this component is only included so that the init code
  // above will run client-side
  return null;
};

export default DatadogInit;
