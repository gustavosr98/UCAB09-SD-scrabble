import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException, Inject, NotFoundException } from '@nestjs/common';

import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class FinalFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  catch(exception: any , host: ArgumentsHost) {
    const httpContext = host.switchToHttp();
    const response = httpContext.getResponse();
    const request = httpContext.getRequest();

    let status = null;
    if (exception instanceof HttpException){ status = exception.getStatus()}
    else if (exception instanceof EntityNotFoundError) {status = HttpStatus.NOT_FOUND}
    else {status = HttpStatus.INTERNAL_SERVER_ERROR;}

    const errorResponse = {
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(`${errorResponse.path}: ` + exception.message + ' ' + exception);

    response.status(status).json(errorResponse);
  }
}
