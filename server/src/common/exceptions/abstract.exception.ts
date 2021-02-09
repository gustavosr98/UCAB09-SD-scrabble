import { HttpException } from '@nestjs/common';

export class ScrabbleException extends HttpException {
    errorMessage: string;
    statusException: string;

    constructor(message: string, status: number, statusException: string) {
        super(message, status);
        this.errorMessage = message;
        this.statusException = statusException;
    }

    getErrorMessage(): string {
        return this.errorMessage;
    }

    getStatusException(): string {
        return this.statusException;
    }
}
