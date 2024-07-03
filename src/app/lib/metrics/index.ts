import { metrics } from '@opentelemetry/api';

export const addGaugeMetric = (
  name: string,
  description: string,
  value: number,
  labels?: Record<string, string>
) => {
  const meterName = 'faucet';

  const meter = metrics.getMeter(meterName);

  const gaugeMetric = meter.createGauge(name, {
    description,
  });

  gaugeMetric.record(value, labels);
};
