import { GamesModule } from './game/games.module'
import { StatusModule } from './status/status.module'
import { UserGameModule } from './user-game/user-game.module'
import { UsersModule } from './user/users.module'

export const indexModules = [
    UsersModule,
    GamesModule,
    StatusModule,
    UserGameModule
]