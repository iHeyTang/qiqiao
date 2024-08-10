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

  /**
   * 发布时间
   */
  published_at: Date;

  /**
   * 发布人
   */
  published_by: string;

  /**
   * 发布标题
   */
  published_title: string;

  /**
   * 发布内容
   */
  published_content: string;
}

declare module "knex/types/tables" {
  interface Tables {
    sys_articles: Article;
  }
}
