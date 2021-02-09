import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';

import { Status } from '@/entities';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoggingControllerInterceptor } from '@/common/interceptors/logging-controller.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { StatusService } from './status.service';

@Crud({
    model: {
        type: Status,
    },
})
@ApiBearerAuth()
@ApiTags('Status')
@UseInterceptors(LoggingControllerInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('status')
export class StatusController implements CrudController<Status> {
    constructor(public service: StatusService) {}
}
