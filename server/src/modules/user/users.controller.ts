import { Controller, Get, Param, UseGuards, UseInterceptors } from "@nestjs/common";
import { Crud, CrudAuth, CrudController, CrudRequest, CrudRequestInterceptor, Override, ParsedBody, ParsedRequest } from "@nestjsx/crud";

import { UsersService } from "./users.service";
import { User } from "@/entities";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { LoggingControllerInterceptor } from "@/common/interceptors/logging-controller.interceptor";
import { AuthGuard } from "@nestjs/passport";


@Crud({
  model: {
    type: User,
  },
})
@ApiBearerAuth()
@ApiTags('Users')
@UseInterceptors(LoggingControllerInterceptor)
@Controller("users")
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}

  get base(): CrudController<User> {
    return this;
  }

  @UseGuards(AuthGuard('jwt'))
  @Override()
  getMany(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getOneAndDoStuff(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.getOneBase(req);
  }

  @Override()
  createOne(
    @ParsedBody() dto: User,
  ) {
    return this.service.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Override('updateOneBase')
  coolFunction(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
  ) {
    return this.base.updateOneBase(req, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Override('replaceOneBase')
  awesomePUT(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
  ) {
    return this.base.replaceOneBase(req, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Override()
  async deleteOne(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.deleteOneBase(req);
  }
}