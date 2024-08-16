import { BaseWithAudit } from "../base";

export interface User extends BaseWithAudit {
  /**
   * 用户名
   */
  username: string;

  /**
   * 密码哈希
   */
  password: string;
}

declare module "knex/types/tables" {
  interface Tables {
    sys_users: User;
  }
}
