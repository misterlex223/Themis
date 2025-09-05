# SFS — 後端 API 規格（Node.js + Fastify）

本檔定義所有 REST API 契約、請求/回應結構、驗證規則、錯誤碼與安全控管。符合 `docs/SRS.md` 的功能與非功能需求。

## 1. 服務基本資訊
- Host：`127.0.0.1`
- Port：`PORT`（預設 8080）
- Base Path：`/api`（健康檢查例外）
- Content-Type：`application/json; charset=utf-8`
- 語系：UTF-8

## 2. 通用回應格式
- 成功：`{ success: true, data: <T> }`
- 失敗：`{ success: false, error: string, message?: string }`
- 常見錯誤碼：
  - `invalid_argument`、`not_found`、`io_error`、`forbidden`、`conflict`、`internal_error`

## 3. 資料模型（TypeScript 介面）
```ts
// Common
export interface Project {
  id: string;
  name: string;
  rootPath: string; // container internal absolute path
  createdAt: string; // ISO
}

export type IndexNode =
  | { type: "dir"; name: string; path: string; children: IndexNode[] }
  | { type: "file"; name: string; path: string; size: number; mtime: number };

export interface FileContent {
  path: string; // relative to project root, using '/'
  content: string; // UTF-8 Markdown
  mtime: number; // current file mtime in ms
}

export interface IndexStatus {
  lastRefreshedAt: string; // ISO
  version: number; // refresh count
  fileCount: number;
}
```

## 4. 健康檢查
- GET `/health`
  - 200 → `{ status: "ok", time: <ISO> }`

## 5. 專案管理
### 5.1 取得專案清單
- GET `/api/projects`
- 200 → `{ success: true, data: Project[] }`

### 5.2 新增專案（可選）
- POST `/api/projects`
- Body（zod）：
```ts
z.object({
  name: z.string().min(1),
  rootPath: z.string().min(1) // 必須為容器內可讀寫之絕對路徑
})
```
- 201 → `{ success: true, data: Project }`
- 400 → `invalid_argument`
- 403 → `forbidden`（rootPath 不在允許清單時）

### 5.3 刪除專案（可選）
- DELETE `/api/projects/:id`
- 200 → `{ success: true }`
- 404 → `not_found`

## 6. 索引與狀態
### 6.1 觸發重建索引
- POST `/api/projects/:id/refresh`
- 202 → `{ success: true, data: IndexStatus }`
- 行為：
  - 若正在重建，回傳目前狀態（不重複啟動）。
  - 後端採互斥鎖；可選提供進度事件（未在初版實作）。

### 6.2 取得樹狀索引
- GET `/api/projects/:id/index`
- Query（可選）：
  - `path`：指定子樹根路徑（支援 lazy 展開）；初版可不傳回整棵樹。
- 200 → `{ success: true, data: IndexNode }`
- 404 → `not_found`（專案不存在或索引尚未建立）

### 6.3 取得索引狀態
- GET `/api/projects/:id/status`
- 200 → `{ success: true, data: IndexStatus }`

## 7. 檔案讀寫
### 7.1 讀取檔案
- GET `/api/projects/:id/file?path=<relativePath>`
- 200 → `{ success: true, data: FileContent }`
- 400 → `invalid_argument`（path 缺漏或非法）
- 403 → `forbidden`（越權或非 .md）
- 404 → `not_found`

### 7.2 寫入檔案
- PUT `/api/projects/:id/file`
- Body（zod）：
```ts
z.object({
  path: z.string().min(1),
  content: z.string(),
  baseMtime: z.number().int().nonnegative().optional()
})
```
- 200 → `{ success: true, data: { mtime: number } }`
- 400 → `invalid_argument`
- 403 → `forbidden`（越權或非 .md）
- 404 → `not_found`
- 409 → `conflict`（當前檔案 mtime 與 baseMtime 不符）

## 8. 安全與驗證
- 僅允許 `.md` 副檔名存取（大小寫敏感統一為小寫判斷）。
- 路徑正規化：
  - 移除 `..` / 絕對路徑；
  - 禁止符號連結跳出專案根（使用 `realpath` 驗證）；
  - 以 POSIX `/` 儲存相對路徑。
- 讀寫權限：
  - 僅在專案 root 下；
  - 服務預設綁定 `127.0.0.1`。

## 9. 忽略清單與掃描規則
- 預設忽略目錄：`.git`, `node_modules`, `dist`, `build`, `.next`, `.cache`。
- 由環境變數 `IGNORE_DIRS` 以逗號覆寫/追加。
- 只納入 `.md` 檔案。

## 10. 日誌與錯誤對映
- pino 結構化日誌欄位：`time`, `level`, `msg`, `reqId`, `path`, `method`, `durationMs`, `error`。
- 例外統一轉換為上述錯誤碼與 `message`。

## 11. 版本與相容性
- API 為 v1，預設 Base Path `/api`；未來若破壞相容將升版 `/api/v2`。

## 12. 範例
### 12.1 讀取檔案（成功）
Request:
```
GET /api/projects/notes/file?path=README.md
```
Response:
```json
{
  "success": true,
  "data": {
    "path": "README.md",
    "content": "# Notes...",
    "mtime": 1725512345678
  }
}
```

### 12.2 寫入檔案（衝突）
Request Body:
```json
{
  "path": "README.md",
  "content": "# Notes (edited)",
  "baseMtime": 1725512345678
}
```
Response:
```json
{ "success": false, "error": "conflict", "message": "file modified by others" }
```
