import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { pick } from 'src/utils/object';

@Injectable()
export class UserService extends BaseService {
  async list() {
    return this.knex('sys_users').select('id', 'username');
  }

  async findOneWithPass(username: string) {
    return this.knex('sys_users')
      .where({ username })
      .select('id', 'username', 'password')
      .first();
  }

  async createUser(params: { username: string; password: string }) {
    const now = new Date();
    const inserts = await this.knex('sys_users')
      .insert({
        username: params.username,
        password: params.password,
        created_by: '',
        created_at: now,
        updated_by: '',
        updated_at: now,
      })
      .returning('*');
    if (inserts.length === 0) {
      throw new Error('创建用户失败');
    }
    return pick(inserts[0], ['id', 'username']);
  }
}
