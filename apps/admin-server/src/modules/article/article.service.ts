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
    list: Pick<
      Article,
      'id' | 'title' | 'created_at' | 'updated_at' | 'published_at'
    >[];
    total: number;
  }> {
    const { pagination } = params;

    const total = await this.knex('sys_articles').count('id').first();

    const list = await this.knex('sys_articles')
      .select('id', 'title', 'created_at', 'updated_at', 'published_at')
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
        created_at: new Date(),
        updated_at: new Date(),
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
    const origin = await this.knex('sys_articles')
      .where('id', id)
      .select('id', 'updated_at', 'title', 'content')
      .first();

    const updateData = pick(data, ['title', 'content']);
    if (
      updateData.title === origin.title &&
      updateData.content === origin.content
    ) {
      return {
        id: origin.id,
        updated_at: origin.updated_at,
      };
    }
    const res = await this.knex('sys_articles')
      .where('id', id)
      .update({
        ...updateData,
        updated_at: new Date(),
        updated_by: '',
      })
      .returning(['id', 'updated_at']);
    return res[0];
  }

  /**
   * 发布文章
   * @param id
   */
  async publishArticle(id: number) {
    const article = await this.knex('sys_articles')
      .where('id', id)
      .select('title', 'content')
      .first();

    if (article === undefined) {
      throw new Error('文章不存在');
    }
    if (article.title === '' || article.content === '') {
      throw new Error('文章标题和内容不能为空');
    }

    await this.knex('sys_articles').where('id', id).update({
      published_by: '',
      published_at: new Date(),
      published_title: article.title,
      published_content: article.content,
      updated_at: new Date(),
      updated_by: '',
    });
  }

  /**
   * 下架已发布的文章
   * @param id
   */
  async unpublishArticle(id: number) {
    await this.knex('sys_articles').where('id', id).update({
      published_by: '',
      published_at: null,
      published_title: '',
      published_content: '',
      updated_at: new Date(),
      updated_by: '',
    });
  }
}
