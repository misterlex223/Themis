# 開發計畫索引（Plans Index）

本計畫依據 `docs/SRS.md` 與 `docs/specs/*.md`（SFS）制定，採用 Fastify（Node.js + TS）與 pnpm 工作區，並以 Docker 發佈。

請依序閱讀並執行以下計畫文件：

1. PLAN-00 — 倉庫與工作區初始化
   - `plans/PLAN-00-repo-and-workspaces.md`
   - 目標：建立 pnpm 工作區、目錄結構、Git 基礎設定。

2. PLAN-01 — 後端（Backend, Fastify + TS）
   - `plans/PLAN-01-backend.md`
   - 目標：依 `docs/specs/SFS-Backend-API.md` 完成 API；索引快取與檔案存取依 `SFS-Indexing-and-Filesystem.md`。

3. PLAN-02 — 前端（Frontend, React + Vite + TS + Tailwind + shadcn/ui）
   - `plans/PLAN-02-frontend.md`
   - 目標：依 `docs/ux`（Requirements/Flows/Layouts/Components/Pages）實作 UI 與交互，對齊 `SFS-Frontend-UI.md`。

4. PLAN-03 — Docker 與 DevOps
   - `plans/PLAN-03-docker-and-devops.md`
   - 目標：建立 Docker 多階段建置、entrypoint、環境變數與本地執行方式。

關聯規格索引：
- Backend API：`docs/specs/SFS-Backend-API.md`
- 索引/檔案系統：`docs/specs/SFS-Indexing-and-Filesystem.md`
- 前端 UI：`docs/specs/SFS-Frontend-UI.md`
- 架構：`docs/specs/SFS-Architecture.md`
- UX：`docs/ux/*`
