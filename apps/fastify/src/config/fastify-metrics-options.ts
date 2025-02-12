import type { IMetricsPluginOptions } from 'fastify-metrics'

const fastifyMetricsOptions = {
  endpoint: '/metrics',
  defaultMetrics: { enabled: true },
  routeMetrics: { enabled: true },
} as IMetricsPluginOptions

export default fastifyMetricsOptions
