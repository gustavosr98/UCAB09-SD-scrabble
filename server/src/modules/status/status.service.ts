import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

import { Status } from "@/entities";

@Injectable()
export class StatusService extends TypeOrmCrudService<Status> {
  constructor(@InjectRepository(Status) repo) {
    super(repo);
  }
}