import { Injectable } from '@nestjs/common';
import { Article } from '@qiqiao/dao';
import { BaseService } from 'src/common/base/base.service';
import { pick } from 'src/utils/object';

@Injectable()
export class ArticleService extends BaseService {
  /**
   * 获取文章列表
   * @param pagination
   * @returns
   */
  async getArticleList(params: {
    pagination: {
      pageSize: number;
      current: number;
    };
  }): Promise<{
    list: Pick<Article, 'id' | 'title' | 'created_at' | 'updated_at'>[];
    total: number;
  }> {
    const { pagination } = params;

    const total = await this.knex('sys_articles').count('id').first();

    const list = await this.knex('sys_articles')
      .select('id', 'title', 'created_at', 'updated_at')
      .orderBy('updated_at', 'desc')
      .limit(pagination.pageSize)
      .offset((pagination.current - 1) * pagination.pageSize);
    return { list, total: Number(total.count) };
  }

  /**
   * 获取文章详情
   * @param id
   * @returns
   */
  async getArticleDetail(id: number): Promise<Article> {
    const detail = await this.knex('sys_articles').where('id', id).first();
    return detail;
  }

  /**
   * 删除文章
   * @param id
   */
  async deleteArticle(id: number) {
    await this.knex('sys_articles').where('id', id).delete();
  }

  /**
   * 创建文章
   * @param body
   */
  async createArticle(body: { title: string; content: string }) {
    const res = await this.knex('sys_articles')
      .insert({
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: '',
        updated_by: '',
      })
      .returning(['id', 'created_at']);
    return res[0];
  }

  /**
   * 修改文章标题和内容
   * @param id
   * @param data
   */
  async editArticle(
    id: number,
    data: Partial<Pick<Article, 'title' | 'content'>>,
  ): Promise<Pick<Article, 'id' | 'updated_at'>> {
    const updateData = pick(data, ['title', 'content']);
    const res = await this.knex('sys_articles')
      .where('id', id)
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
        updated_by: '',
      })
      .returning(['id', 'updated_at']);
    return res[0];
  }
}
