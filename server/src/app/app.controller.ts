import { Controller, Get, Post, UseGuards, Request, Body, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';

import { LoggingControllerInterceptor } from '@/common/interceptors/logging-controller.interceptor';
import { AuthService } from '@/auth/auth.service';

@ApiTags('App')
@UseInterceptors(LoggingControllerInterceptor)
@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private readonly authService: AuthService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @ApiBody({
        description: 'User',
    })
    @Post('authorize')
    @UseGuards(AuthGuard('local'))
    async authorize(@Request() req) {
        return this.authService.login(req.user);
    }
}
