import { Controller, Query, UseGuards, UseInterceptors } from '@nestjs/common';
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

    @UseGuards(AuthGuard('jwt'))
    @Override()
    getMany(
        @Query('limit') limit: number = 10,
        @Query('start') start: number = 1,
    ) {
        return this.service.getGames({ limit, start });
    }
}
