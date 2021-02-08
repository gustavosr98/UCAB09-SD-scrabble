import { Controller, UseGuards, UseInterceptors } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";

import { UserGame } from "@/entities";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { LoggingControllerInterceptor } from "@/common/interceptors/logging-controller.interceptor";
import { AuthGuard } from "@nestjs/passport";
import { UserGameService } from "./user-game.service";


@Crud({
  model: {
    type: UserGame,
  },
})
@ApiBearerAuth()
@ApiTags('UserGame')
@UseInterceptors(LoggingControllerInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller("status")
export class UserGameController implements CrudController<UserGame> {
  constructor(public service: UserGameService) {}
}