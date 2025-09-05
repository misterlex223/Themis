# SFS — 部署與 DevOps（Docker）

## 1. 目標
- 以單一 Docker image 發佈，內含已編譯的前端靜態檔與後端服務。
- 使用者以 Volume 掛載本機專案目錄；透過環境變數宣告可用專案。

## 2. 環境變數
- `PORT`（預設 `8080`）
- `HOST`（預設 `127.0.0.1`）
- `PROJECTS_JSON`：JSON 陣列，元素 `{ id, name, rootPath }`，`rootPath` 為容器內絕對路徑。
- `IGNORE_DIRS`：以逗號分隔的忽略目錄清單，預設 `.git,node_modules,dist,build,.next,.cache`

## 3. Dockerfile（多階段建置，示意）
```Dockerfile
# --- frontend build ---
FROM node:22-alpine AS fe
WORKDIR /app
COPY app/frontend/package*.json ./app/frontend/
RUN --mount=type=cache,target=/root/.npm npm --prefix ./app/frontend ci
COPY app/frontend ./app/frontend
RUN npm --prefix ./app/frontend run build

# --- backend build ---
FROM node:22-alpine AS be
WORKDIR /app
COPY app/backend/package*.json ./app/backend/
RUN --mount=type=cache,target=/root/.npm npm --prefix ./app/backend ci
COPY app/backend ./app/backend
RUN npm --prefix ./app/backend run build

# --- runtime ---
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=fe /app/app/frontend/dist ./public
COPY --from=be /app/app/backend/dist ./backend
COPY docker/entrypoint.sh ./entrypoint.sh
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:8080/health || exit 1
CMD ["sh", "./entrypoint.sh"]
```

`entrypoint.sh`（示意）：
```sh
#!/usr/bin/env sh
# 將 PROJECTS_JSON 解析並檢查 rootPath 是否存在
node ./backend/server.js
```

## 4. docker run 範例
```bash
docker run --rm -p 8080:8080 \
  -v /Users/me/Notes:/app/workspaces/notes \
  -e PROJECTS_JSON='[{"id":"notes","name":"Notes","rootPath":"/app/workspaces/notes"}]' \
  markdown-app:latest
```

## 5. 開發模式（非容器）
- 後端：`npm run dev`（Fastify with ts-node / tsx）
- 前端：`npm run dev`（Vite）
- CORS：開啟 `http://localhost:5173`（或實際 Vite 埠）

## 6. CI/CD（建議）
- Lint + Test + Build；產出 Docker image 並標記 `:latest` 與 git sha。
- 供內部分發（本地使用者拉取 image）。
