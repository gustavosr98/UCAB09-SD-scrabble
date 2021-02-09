import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';

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
}
