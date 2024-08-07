import { pg } from "@qiqiao/dao";

/**
 * 获取文章详情
 */
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const articleId = url.searchParams.get("id");
  if (!articleId) return;
  return await pg("sys_articles")
    .where({ id: articleId })
    .select(
      "id",
      "title",
      "content",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by"
    )
    .first();
});
