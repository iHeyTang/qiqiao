import { BaseWithAudit } from "../base";

export interface Article extends BaseWithAudit {
  /**
   * 标题
   */
  title: string;

  /**
   * 正文内容
   */
  content: string;
}

declare module "knex/types/tables" {
  interface Tables {
    sys_articles: Article;
  }
}
