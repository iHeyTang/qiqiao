import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex } from '@qiqiao/dao';
import { InjectConnection as KnexInjectConnection } from 'nest-knexjs';

@Injectable()
export class BaseService {
  constructor(
    @KnexInjectConnection() protected readonly knex: Knex,
    private configService: ConfigService,
  ) {}
}
