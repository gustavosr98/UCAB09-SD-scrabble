import { Controller, Get, Param, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import {
    Crud,
    CrudAuth,
    CrudController,
    CrudRequest,
    CrudRequestInterceptor,
    Override,
    ParsedBody,
    ParsedRequest,
} from '@nestjsx/crud';

import { UsersService } from './users.service';
import { User } from '@/entities';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { LoggingControllerInterceptor } from '@/common/interceptors/logging-controller.interceptor';
import { AuthGuard } from '@nestjs/passport';

@Crud({
    model: {
        type: User,
    },
})
@ApiBearerAuth()
@ApiTags('Users')
@UseInterceptors(LoggingControllerInterceptor)
@Controller('users')
export class UsersController implements CrudController<User> {
    constructor(public service: UsersService) {}

    get base(): CrudController<User> {
        return this;
    }

    @UseGuards(AuthGuard('jwt'))
    @Override()
    getMany(@ParsedRequest() req: CrudRequest) {
        return this.base.getManyBase(req);
    }

    @Override('getOneBase')
    getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
        return this.base.getOneBase(req);
    }

    @Override()
    @ApiBody({
        description: 'User to create',
        type: User,
    })
    @ApiCreatedResponse({
        description: 'User created successfully',
        type: User,
    })
    public async createOne(@ParsedBody() user: User): Promise<User> {
        return await this.service.create(user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Override('updateOneBase')
    coolFunction(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: User) {
        return this.base.updateOneBase(req, dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Override('replaceOneBase')
    awesomePUT(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: User) {
        return this.base.replaceOneBase(req, dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Override()
    async deleteOne(@ParsedRequest() req: CrudRequest) {
        return this.base.deleteOneBase(req);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(CrudRequestInterceptor)
    @Get('users/ranking')
    async getRanking(@Query('limit') limit, @Query('page') page, @Query('username') username) {
        return await this.service.getRanking(Number(limit), page, username)
    }
}
