# PLAN-00 — 倉庫與工作區初始化

本計畫定義初始化專案與工作區（pnpm workspaces）的步驟。請依序執行，完成後再進行 PLAN-01。

## 目標
- 建立 pnpm 工作區，包含 `app/backend` 與 `app/frontend` 兩個子專案。
- 設定 Node 版本、共用 NPM 腳本與基本 `.gitignore`。

## 產出
- `package.json`（workspace root）
- `pnpm-workspace.yaml`
- 目錄結構：
  - `app/backend/`
  - `app/frontend/`（由後續腳手架建立）

## 步驟
1. 建立根目錄工作區描述：
   - `package.json`：設定 private: true、工作區腳本（lint、typecheck、build、dev:be、dev:fe）。
   - `pnpm-workspace.yaml`：包含 `app/*`。
2. 版本與引擎：Node.js 22 LTS；套件管理器 pnpm。
3. Git 設定：
   - `.gitignore`：`node_modules/`, `dist/`, `.DS_Store`, `coverage/`。
4. 完成後提交 Git：`chore: init pnpm workspaces`。

## 注意事項
- 僅在本地端執行，勿加入密鑰。
- 後續 PLAN-02 會建立前端骨架（Vite + Tailwind + shadcn）。
