import fs from "node:fs";

/**
 * 获取标题名
 *
 * 即文件内容第一个大标题作为名称，如果是目录的话找目录下的index.md
 * 如果找不到标题名，就使用文件名作为标题名
 * @param path
 */
export const getFileTitle = (path: string) => {
  const filename = path.split("/").pop()!;

  const stat = fs.statSync(path);
  const p = stat.isDirectory() ? getDirDefaultEntryFile(path) : path;
  if (!p) return filename;

  const content = fs.readFileSync(p, "utf-8");
  const title = getContentTitle(content);
  if (title) return title;

  return filename;
};

export const getContentTitle = (content: string) => {
  const match = content.match(/^#\s+(.+)/);
  if (match?.[1]) return match[1];
};

export const getDirDefaultEntryFile = (path: string) => {
  if (fs.existsSync(`${path}/index.md`)) {
    return `${path}/index.md`;
  }
};
