import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    HttpException,
    Inject,
    BadRequestException,
} from '@nestjs/common';

import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ScrabbleException } from '../exceptions/abstract.exception';

@Catch()
export class FinalFilter implements ExceptionFilter {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    catch(exception: any, host: ArgumentsHost) {
        const httpContext = host.switchToHttp();
        const response = httpContext.getResponse();
        const request = httpContext.getRequest();

        const status = exception instanceof ScrabbleException ? exception.getStatusException() : 'SERVER_ERROR';
        let httpStatus = null;
        let message = exception instanceof ScrabbleException ? exception.getErrorMessage() : 'Unknown Error';
       
        if (exception instanceof HttpException) {
            httpStatus = exception.getStatus();
        } else if (exception instanceof EntityNotFoundError) {
            httpStatus = HttpStatus.NOT_FOUND;
        } else {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        const errorResponse = {
            status,
            scrabbleMessage: message,
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        this.logger.error(`${errorResponse.path} [${status}]: ` + exception.message + ' | ' + exception);

        response.status(httpStatus).json(errorResponse);
    }
}
