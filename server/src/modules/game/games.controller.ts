import { Controller, Get, Param, Patch, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequest, Override, ParsedRequest } from '@nestjsx/crud';

import { Game } from '@/entities';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoggingControllerInterceptor } from '@/common/interceptors/logging-controller.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { GamesService } from './games.service';

@Crud({
    model: {
        type: Game,
    },
})
@ApiBearerAuth()
@ApiTags('Games')
@UseInterceptors(LoggingControllerInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('games')
export class GamesController implements CrudController<Game> {
    constructor(public service: GamesService) {}

    @Override()
    async getMany(@Query('limit') limit: number = 10, @Query('start') start: number = 1) {
        return await this.service.getGames({ limit, start });
    }

    @Get(':id/users')
    async getGame(@Param('id') id) {
        return await this.service.getGame(id);
    }

    @Patch(':id/status/:statusId')
    async updateGameStatus(@Param('id') id: number, @Param('statusId') statusId: number) {
        return await this.service.updateGameStatus(id, statusId);
    }
}
