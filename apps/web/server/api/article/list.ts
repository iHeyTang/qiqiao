import { pg } from "@qiqiao/dao";

/**
 * 获取文章列表
 */
export default defineEventHandler(() => {
  return pg("sys_articles").select("id", "title", "created_at", "updated_at");
});
