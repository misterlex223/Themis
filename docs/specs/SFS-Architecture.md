# SFS — 架構與技術選型

## 1. 總覽
本系統為本地端 Markdown 瀏覽/編輯 Web App，前後端分離並以 Docker 容器部署。前端使用 React + Vite + TypeScript + Tailwind CSS + shadcn/ui；後端採用 Node.js（TypeScript）+ Express/Fastify（建議 Fastify 以獲得較佳效能與型別支援）。

## 2. 目標
- 滿足 SRS 之功能與非功能需求（無登入、多專案、Refresh 建索引、樹狀瀏覽、編輯與儲存）。
- 清晰模組邊界與契約，確保可維護性與擴充性。
- 容器化一鍵啟動，Volume 掛載本機目錄即用。

## 3. 技術選型
- 前端：React 18、Vite 5、TypeScript 5、Tailwind CSS 3、shadcn/ui（Radix UI 基礎）、React Query（TanStack Query）
- 後端：Node.js 22 LTS、TypeScript 5、Fastify 4（或 Express 5 二選一，預設 Fastify）、zod（輸入驗證）、pino（日誌）
- Markdown：react-markdown + remark plugins 或 @tanstack/markdown-editor（視選擇），預設 react-markdown
- 測試：Vitest（前端）、Jest/Vitest（後端）、Playwright（E2E）
- 程式碼品質：ESLint、Prettier、lint-staged、husky（可選）

## 4. 目錄結構（建議）
```
/ (repo root)
├─ app/
│  ├─ backend/
│  │  ├─ src/
│  │  │  ├─ api/               # route handlers
│  │  │  ├─ services/          # domain services (indexing, fs)
│  │  │  ├─ lib/               # utils: path, schema, logger
│  │  │  ├─ types/             # backend TS types (API contracts)
│  │  │  └─ server.ts          # app bootstrap
│  │  ├─ test/
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  └─ frontend/
│     ├─ src/
│     │  ├─ app/               # routes, providers
│     │  ├─ components/        # UI components (shadcn)
│     │  ├─ features/
│     │  │  ├─ projects/
│     │  │  ├─ explorer/
│     │  │  └─ editor/
│     │  ├─ lib/               # api client, query hooks, utils
│     │  └─ types/             # FE types aligned with API
│     ├─ public/
│     ├─ index.html
│     ├─ package.json
│     ├─ tailwind.config.ts
│     └─ tsconfig.json
├─ docker/
│  ├─ Dockerfile               # multi-stage
│  └─ docker-compose.yml       # optional dev
├─ docs/
│  ├─ SRS.md
│  └─ specs/
│     ├─ SFS-Architecture.md
│     ├─ SFS-Backend-API.md
│     ├─ SFS-Frontend-UI.md
│     ├─ SFS-Indexing-and-Filesystem.md
│     ├─ SFS-Deployment-and-DevOps.md
│     └─ SFS-Testing-and-Acceptance.md
└─ package.json                # workspace manager (pnpm/npm)
```

## 5. 模組邊界
- frontend：僅透過 REST API 與 backend 溝通；不直接碰檔案系統。
- backend：封裝檔案系統存取與索引快取；對外僅暴露經驗證/正規化後的 API。
- services/indexer：負責掃描與樹狀索引構建、快取維護與狀態匯報。
- services/files：負責讀寫 `.md`，檢查副檔名、路徑與衝突檢測（mtime）。
- api 層：輸入驗證（zod）、錯誤轉換（至統一錯誤格式）、日誌。

## 6. 資料契約與型別策略
- 以後端 `types/contract.ts` 定義 API 請求/回應介面，並維持與 SFS-Backend-API 一致。
- 前端 `src/types/api.ts` 手動同步或由 openapi/json schema 產生（初版採手動，維持簡潔）。
- 日期時間統一 ISO 字串；mtime 以 UNIX epoch ms（number）。

## 7. 非功能性需求對應
- 效能：
  - indexer 採單次遞迴掃描 + 記憶體快取；大案量支援 lazy 展開（可於 v2）。
  - Fastify + pino 減少開銷。
- 穩定性：
  - Refresh 採互斥鎖防止並發重掃；
  - 大案量提供進度事件（可選 SSE）。
- 安全：
  - 僅允許專案 root 之下的相對路徑；
  - 僅 `.md` 副檔名可讀寫；
  - 服務綁定 `127.0.0.1` 預設。

## 8. 建置與執行策略
- 單一 Docker multi-stage：先建置 FE 靜態資源，再與 BE 一起提供（BE 可靜態服務 FE build）。
- Dev 模式：前後端各自起 server（FE 使用 Vite dev server；BE 使用 Fastify），以環境變數設置 API URL。

## 9. 可觀測性
- 後端：pino JSON logs；健康檢查 `/health`；啟動時輸出專案數目與忽略清單。
- 前端：使用者操作以 UI 提示（toast），不做遙測。

## 10. 里程碑與交付
- M1：後端 API 可用 + 單元測試通過。
- M2：前端 UI/UX 可操作（專案選擇、樹狀、預覽/編輯/儲存、Refresh）。
- M3：Docker 化，提供 run 指令與範例 Volume 掛載。
- M4：效能/穩定性驗證與優化。
