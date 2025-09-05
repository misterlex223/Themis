# SFS — 前端 UI/UX 與應用程式規格（React/Vite/TS/Tailwind/shadcn）

## 1. 路由結構
- `/`：專案選擇頁（Project Switcher）
- `/p/:projectId`：主工作區（左：樹狀；右：內容）
  - Query 參數：
    - `path`：目前選取的相對路徑（檔案）
    - `mode`：`preview` | `edit`（預設 `preview`）

## 2. UI 版面
- 頂部工具列：
  - Project Switcher（shadcn `Select`）
  - Refresh 按鈕（`Button` + loading 狀態）
  - 狀態/提示區（索引版本、最後刷新時間）
- 左側（Explorer）：樹狀檢視
  - 可展開/收合目錄
  - 檔案節點（僅 `.md`）
  - 可選快速搜尋框（v2）
- 右側（Viewer/Editor）：
  - 預覽（react-markdown 渲染）
  - 編輯（`textarea` 或 Monaco/CodeMirror，初版使用 `textarea` + Tailwind）
  - 工具列：切換模式、儲存、顯示檔名/mtime

## 3. 元件清單（shadcn/ui）
- Button, Input, Textarea, Select, Dialog, DropdownMenu, ScrollArea, Separator, Skeleton, Toast（useToast）
- TreeView（自訂）

## 4. 狀態管理與資料流
- 使用 React Query 管理 API 請求/快取：
  - `useProjects()`：GET `/api/projects`
  - `useIndex(projectId)`：GET `/api/projects/:id/index`
  - `useStatus(projectId)`：GET `/api/projects/:id/status`
  - `useFile(projectId, path)`：GET `/api/projects/:id/file`
  - `useSaveFile()`：PUT `/api/projects/:id/file`
  - `useRefresh(projectId)`：POST `/api/projects/:id/refresh`
- URL 是單一真實狀態（projectId、path、mode）。
- 樹狀大案量：可在 v2 實作 lazy/virtualized；初版一次載入整棵索引。

## 5. 互動與快捷鍵
- 切換預覽/編輯：按鈕或 `E`/`Esc`（可選）
- 儲存：`Ctrl/Cmd + S`（阻止預設，觸發 PUT）
- 展開/收合目錄：滑鼠點擊；鍵盤方向鍵（可選）

## 6. API Client 規格
- `lib/api.ts`：
  - `getProjects()` → Project[]
  - `refresh(projectId)` → IndexStatus
  - `getIndex(projectId, path?)` → IndexNode
  - `getStatus(projectId)` → IndexStatus
  - `getFile(projectId, path)` → FileContent
  - `saveFile(projectId, { path, content, baseMtime? })` → { mtime }
- 錯誤處理：將後端 `error` 對映為使用者可讀訊息並以 toast 呈現。

## 7. 型別（TypeScript）
與後端 `SFS-Backend-API.md` 定義一致：`Project`, `IndexNode`, `FileContent`, `IndexStatus`。

## 8. Tailwind 與 shadcn 設定
- Tailwind：`tailwind.config.ts` 啟用 `container`, `typography`（markdown 渲染加強）
- shadcn：導入 Button, Select, Dialog, Toast 等必要元件，採用 CSS Variables 主題。

## 9. Markdown 渲染與編輯
- 預覽：`react-markdown` + `remark-gfm`；支援連結、表格、程式碼區塊。
- 編輯：初版 `textarea`；之後可替換為 Monaco/CodeMirror 以獲得語法高亮與 diff。

## 10. 邊界與錯誤
- 非 `.md` 檔不可點擊（後端也會阻擋）。
- 儲存衝突（409）：
  - 顯示提示「檔案已被外部修改」，提供覆蓋或重新載入選項（初版至少提供重新載入）。

## 11. 載入與骨架畫面
- 專案清單：Skeleton
- 索引/樹：Skeleton + Spinner
- 檔案內容：Skeleton + 行為提示（例如快捷鍵）

## 12. 可及性與國際化
- 初版中文介面；保留 i18n 擴充點（字串集中在 `lib/i18n.ts`）。
- 鍵盤操作可及性，Focus 樣式（Tailwind ring）。

## 13. 檔案路徑與導覽
- 以 URL Query `path` 紀錄目前檔案；切換檔案會更新 Query。
- 樹狀節點與 Viewer 同步高亮選取檔案。

## 14. 錯誤與 Toast 規範
- `invalid_argument` → 顯示「參數錯誤」
- `not_found` → 顯示「檔案不存在或已移除」
- `forbidden` → 顯示「無權限或非法路徑」
- `conflict` → 顯示「檔案已被外部修改」
- `io_error`/`internal_error` → 顯示「系統發生錯誤」

## 15. 開發指引
- 先完成 API Client 與 React Query hooks。
- 以 `ProjectLayout` 封裝共用 UI（頂部工具列 + 左側樹）。
- Component 原則：
  - `features/projects/ProjectSwitcher.tsx`
  - `features/explorer/TreeView.tsx`
  - `features/editor/MarkdownViewer.tsx`
  - `features/editor/MarkdownEditor.tsx`
  - `features/editor/SaveBar.tsx`
- 測試：
  - 元件測試（渲染與互動），E2E 測試（載入專案、Refresh、開啟檔案、編輯、儲存）。
