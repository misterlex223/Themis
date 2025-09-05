# PLAN-02 — 前端（React + Vite + TS + Tailwind + shadcn/ui）

目標：依 `docs/ux/*` 與 `docs/specs/SFS-Frontend-UI.md` 建立前端應用，完成首頁與工作區基本功能，並與後端 API 串接。

## 範圍
- 腳手架：Vite v7（React + TS）、Tailwind v4、shadcn/ui、ESLint Flat Config。
- 路由：`/`（Home）、`/p/:projectId`（Workspace）。
- API Client 與 React Query hooks。
- 元件：ProjectSwitcher、TreeView、MarkdownViewer、MarkdownEditor、SaveBar、TopBar、Toast。

## 目錄
- `app/frontend/`
  - `src/app/main.tsx`, `src/app/router.tsx`（路由與 Providers）
  - `src/lib/api.ts`, `src/lib/query.ts`, `src/lib/i18n.ts`
  - `src/types/api.ts`
  - `src/features/...`（projects/explorer/editor）

## 開發步驟
1. 以 Vite 建立專案至 `app/frontend`、安裝依賴並啟動確認可跑。
2. 安裝 Tailwind v4 + `@tailwindcss/vite`，設定 `tailwind.config.ts` 與全域樣式。
3. 初始化 shadcn/ui（Vite 指南），導入 Button/Select/Dialog/Toast 等元件。
4. 安裝 React Query，建立 `QueryClientProvider` 與基本 hooks：
   - `useProjects`, `useIndex`, `useStatus`, `useFile`, `useSaveFile`, `useRefresh`。
5. 建立頁面與布局：
   - Home：`ProjectSwitcher` → 導向 `/p/:id`（見 `UXP-home.md`）。
   - Workspace：`TopBar + Sidebar(TreeView) + Content(Viewer/Editor + SaveBar)`（見 `UXP-workspace.md`）。
6. 行為：
   - Refresh 按鈕：呼叫 POST `/refresh` 並重取 `/status` 與 `/index`。
   - 檔案讀寫：GET `/file`、PUT `/file`（帶 `baseMtime`），處理 409 衝突。
7. 錯誤與 Loading：
   - Skeleton、Toast、重試按鈕。
8. 開發驗收：對照 `docs/ux/pages` 與 `SRS` UAT。

## Git 建議提交
- feat(frontend): scaffold vite + tailwind + shadcn
- feat(frontend): add api client and react-query hooks
- feat(frontend): implement Home with ProjectSwitcher
- feat(frontend): implement Workspace layout and TreeView
- feat(frontend): implement Viewer/Editor and Save flow (409 handling)
