import pino from 'pino';
import { pinoHttp, Options } from 'pino-http';
import { randomUUID } from 'crypto';

const levels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const;

export type Level = (typeof levels)[number];

const config: Options = {
  genReqId: (req, res) => {
    const existingID = req.id ?? req.headers['x-request-id'];
    if (existingID) {
      return existingID;
    }
    const requestId = randomUUID();
    res.setHeader('X-Request-Id', requestId);
    return requestId;
  },
  level: process.env.SERVER_LOG_LEVEL || 'info',
  transport:
    process.env.SERVER_ENABLE_PRETTY_LOG === 'true'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: false,
            levelFirst: false,
            translateTime: "yyyy-MM-dd'T'HH:mm:ss.l'Z'",
            messageFormat: '{req.headers.x-request-id} [{context}] {msg}',
            errorLikeObjectKeys: ['err', 'error'],
          },
        }
      : undefined,
  redact: [
    'req.headers.authorization',
    'req.headers["x-api-key"]',
    'res.headers["set-cookie"]',
    'req.headers.cookie',
  ],
  formatters: {
    level: label => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },
  autoLogging: {
    ignore: req => req.url === '/view/healthcheck',
  },
  customLogLevel: function (_, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      return 'silent';
    }
    return 'info';
  },
};

export const httpLogger = pinoHttp(config);

export const pinoLogger = pino(config);
