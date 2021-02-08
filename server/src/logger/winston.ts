import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';

import * as rTracer from 'cls-rtracer';

interface createOptionsParams {
  fileName: string;
}

function createOptions(params: createOptionsParams): WinstonModuleOptions {
  let transports: winston.transport[] = [];

  transports.push(
    new winstonDailyRotateFile({
      datePattern: 'YYYY.MM.DD',
      level: 'silly',
      format: commonFormat,
      filename: `logs/${Boolean(process.env.PRODUCTION) ? 'prod' : 'dev'}/%DATE%_${
        params.fileName
      }.log`,
      maxFiles: '30d',
    }),
  );

  if (process.env.PRODUCTION !== 'true') {
    transports.push(
      new winston.transports.Console({
        level: 'silly',
        format: commonFormat,
      }),
    );
  }

  return {
    transports,
  };
}

const commonFormat: winston.Logform.Format = winston.format.combine(
  winston.format.simple(),
  winston.format.timestamp(),
  winston.format.colorize({ message: true }),
  winston.format.printf((info: winston.Logform.TransformableInfo) => {
    const colorizer: winston.Logform.Colorizer = winston.format.colorize();
    const requestId: string = rTracer.id() ? `[${rTracer.id()}]` : '';
    const tzoffset: number = new Date().getTimezoneOffset() * 60000;
    const localISOTime: string = new Date(Date.now() - tzoffset).toISOString();
    const level: string = colorizer.colorize(info.level, info.level.toUpperCase());
    const context: string = info.context || 'N/D';
    const msg: string = info.message;

    return `${localISOTime} ${requestId} ${level} [${context}] ${msg}`;
  }),
);

export default createOptions;
