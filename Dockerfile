# 使用官方的 Node.js 镜像作为基础镜像
FROM node:18

# 安装 nginx 和 supervisor
RUN apt-get update && apt-get install -y nginx && apt-get clean
RUN npm install -g pm2

# 创建并设置工作目录
WORKDIR /app

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制 supervisord 配置文件
# COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 复制 out 到 app
COPY out/ /app/
RUN rm -rf /app/apps/web
RUN rm -rf /app/apps/admin-client

# 安装 @qiqiao/admin-server 需要的依赖
RUN yarn install --production

# 复制 ecosystem.config.js 文件
COPY ecosystem.config.js /app
COPY out/apps/web/.output /app/apps/web
COPY out/apps/admin-client/dist /app/apps/admin-client
COPY start.sh /app

# 暴露应用运行的端口
EXPOSE 8080 3000

# 启动应用
CMD ["sh", "start.sh"]