# PLAN-01 — 後端（Fastify + TypeScript）

目標：依 `docs/specs/SFS-Backend-API.md` 與 `SFS-Indexing-and-Filesystem.md` 完成後端 API。語言使用 TypeScript，框架採 Fastify，日誌使用 pino。

## 範圍
- 健康檢查 `/health`
- 專案管理 `/api/projects`（讀取 `PROJECTS_JSON` 或設定檔）
- 索引：`POST /api/projects/:id/refresh`、`GET /api/projects/:id/index`、`GET /api/projects/:id/status`
- 檔案：`GET /api/projects/:id/file?path=...`、`PUT /api/projects/:id/file`
- 安全：路徑正規化、限制 `.md`、越權阻擋

## 目錄與檔案
- `app/backend/`
  - `src/server.ts`（啟動、路由註冊、CORS/dev）
  - `src/api/*.ts`（各資源路由）
  - `src/services/indexer.ts`（掃描索引與快取）
  - `src/services/files.ts`（檔案讀寫、衝突檢查）
  - `src/lib/{logger.ts, path.ts, env.ts}`
  - `src/types/contract.ts`（API 型別）
  - `test/`（單元/整合測試）

## 開發步驟
1. 初始化專案：`pnpm init -y`（在 `app/backend`），安裝：
   - 生產：`fastify pino zod`；開發：`typescript tsx @types/node vitest supertest`。
2. 建 `tsconfig.json` 與 `package.json` scripts：`dev`, `build`, `start`, `test`。
3. 實作 `contract.ts`：`Project`, `IndexNode`, `FileContent`, `IndexStatus`。
4. 實作 `env.ts`：解析 `PORT`, `HOST`, `PROJECTS_JSON`, `IGNORE_DIRS`。
5. 實作 `path.ts`：路徑正規化、防越權（realpath）。
6. 實作 `indexer.ts`：
   - 全量掃描（DFS），忽略目錄，產出樹與 `IndexStatus`；
   - 進程內快取與互斥鎖；
   - 局部更新：寫入後更新節點 `mtime/size`。
7. 實作 `files.ts`：
   - 讀取：UTF-8，回 `content`+`mtime`；
   - 寫入：校驗 `baseMtime` → 409；成功回最新 `mtime`。
8. 路由：
   - `/health`；
   - `/api/projects` GET；（可選 POST/DELETE 保留 stub）
   - `/api/projects/:id/{refresh,index,status}`；
   - `/api/projects/:id/file` GET/PUT。
9. 錯誤與日誌：統一 `success/error` 格式；pino 中介層；
10. 測試：
   - 單元：path 正規化、md 篩選、索引統計；
   - 整合：各端點 200/4xx；衝突 409。

## 驗收
- 對齊 `SFS-Backend-API.md` 範例；
- 小型索引 <1s；中型 <5s（以 fixtures 模擬）。

## Git 建議提交
- feat(backend): init fastify server with health
- feat(backend): add projects service (env-driven)
- feat(backend): add indexer and refresh endpoints
- feat(backend): file read/write with conflict detection
- test(backend): add unit and integration tests
