# 軟體需求規格書（SRS）— Markdown 瀏覽與編輯器（Docker 發佈）

## 1. 簡介
本文件為一個以 Docker Container 形式發佈的「本地 Markdown 文件瀏覽與編輯器」之軟體需求規格書（Software Requirements Specification, SRS）。系統在使用者本機執行，不需要登入機制，提供多專案目錄對應、文件樹狀瀏覽、內容檢視與編輯、儲存，以及手動 Refresh 以重建索引快取的能力。

## 2. 目標與範疇
- 目標：提供在本地端快速瀏覽與編輯 `.md` 檔案的輕量 Web App，並透過快取索引提升大量檔案時的操作效率。
- 範疇：
  - 多專案目錄管理（選擇與切換）。
  - 掃描專案目錄下的所有 Markdown 檔（副檔名 `.md`）。
  - 建立並維護快取索引（手動 Refresh 重建）。
  - 樹狀結構瀏覽。
  - 檔案內容檢視、編輯與儲存。
  - 以 Docker 容器形式部署於本機。

## 3. 名詞定義
- 專案（Project）：對應到本機檔案系統中的某個根目錄，該目錄下的 `.md` 檔皆屬於該專案管理範圍。
- 索引快取（Index Cache）：將掃描所得之檔案樹、檔案中必要的中繼資料（例如路徑、檔名、更新時間、大小）快取至記憶體或本地快取檔，以加速清單與樹狀瀏覽。
- Refresh：手動觸發重新掃描專案根目錄並重建索引快取的操作。

## 4. 系統總覽
系統採前後端分離：
- 前端 Web：提供專案選擇、樹狀瀏覽、內容檢視/編輯、儲存、與 Refresh 操作。
- 後端 API：負責專案管理、目錄掃描、索引快取管理、檔案存取（讀/寫），並暴露 REST API。
- 執行環境：以 Docker Container 打包，使用者以 Volume 掛載本機之專案目錄至容器內的可存取路徑。

## 5. 使用者故事（User Stories）
- 作為使用者，我想在打開網頁後看到可選擇的專案清單，以便快速切換不同目錄。
- 作為使用者，我想按下 Refresh 後，系統能快速重掃 `.md` 檔並更新樹狀結構，以確保與檔案系統同步。
- 作為使用者，我想從樹狀結構中點擊一個檔案並預覽其 Markdown 內容。
- 作為使用者，我想切換到編輯模式，對 Markdown 內容進行編輯，並按下儲存將修改寫回檔案。
- 作為使用者，我想要在面對大量檔案時，瀏覽/展開目錄與載入列表的速度仍然順暢。

## 6. 功能需求
6.1 專案管理
- F-1：支援多個專案，每個專案對應一個根目錄路徑。
- F-2：顯示可用專案清單；使用者可從清單中選擇一個專案成為「目前專案」。
- F-3：支援新增/移除專案（後端可選功能，若初版不開放 UI 新增，則由設定檔或啟動環境變數提供）。

6.2 目錄掃描與索引快取
- F-4：對目前專案進行目錄遞迴掃描，僅納入 `.md` 副檔名檔案。
- F-5：建立樹狀結構索引（包含目錄與檔案節點）。
- F-6：索引應包含必要中繼資料（完整相對路徑、檔名、修改時間、大小）。
- F-7：提供 Refresh 操作，手動觸發重新掃描並重建索引快取。
- F-8：索引快取儲存在記憶體或本地檔案，重建時間應可接受（見非功能需求）。

6.3 文件瀏覽與編輯
- F-9：樹狀結構瀏覽：可展開/收合目錄，顯示 `.md` 檔案清單。
- F-10：點選檔案節點後，前端載入並顯示檔案內容（預覽或原始 Markdown 文字）。
- F-11：支援預覽與編輯模式切換。
- F-12：編輯模式下可修改內容並透過「儲存」送出更新；成功後後端寫回檔案系統。
- F-13：儲存後應更新檔案的修改時間與索引（必要時可局部更新該檔索引）。

6.4 健康檢查與基本狀態
- F-14：提供 `/health` API 回報健康狀態（例如 `ok`）。
- F-15：提供目前專案與索引狀態查詢（例如索引版本、最後刷新時間、檔案數量）。

6.5 安全與權限（本地場景）
- F-16：不需登入機制。
- F-17：對於可寫入之路徑必須限制在專案根目錄（防止寫出界外）。
- F-18：拒絕存取非 `.md` 檔案與目錄外之路徑（路徑正規化）。

## 7. 非功能性需求
- NFR-1 性能：
  - 小型專案（< 1,000 檔）Refresh 時間應在 1 秒以內；
  - 中型專案（1,000–10,000 檔）Refresh 時間應在 5 秒以內；
  - 大型專案（> 10,000 檔）允許線性延展，但應有進度回報或 UI 提示。
- NFR-2 延遲：
  - 展開樹節點或載入檔案清單操作應在 200ms–500ms 內完成（索引快取就緒時）。
- NFR-3 穩定性：
  - 連續多次 Refresh 不應造成服務不可用或記憶體洩漏。
- NFR-4 可用性：
  - UI 簡潔直覺，支持淺色/深色主題（可選）。
- NFR-5 可維護性：
  - 模組化設計，清晰的 API 契約與錯誤碼；
  - 註解與 README 清楚。
- NFR-6 相容性：
  - 支援 macOS、Linux 以 Docker 執行；瀏覽器支援最新版 Chromium/Chrome/Edge/Safari/Firefox。
- NFR-7 安全性（本地）：
  - 嚴格的路徑正規化與白名單根目錄控制；
  - 關閉跨來源寫入；
  - 不收集個資與遙測（除非用戶自願開啟）。

## 8. 系統架構與技術選型（建議）
- 前端：
  - 現代前端框架（React/Vite/TypeScript）或等價實作；
  - Markdown 預覽器（如 `markdown-it` 或 `react-markdown`）。
- 後端：
  - Node.js（Express/Fastify）或 Python（FastAPI）皆可；
  - 檔案系統操作（讀/寫/遞迴掃描）。
- 索引快取：
  - 記憶體快取（進程內）；可選擇將結果持久化至本地檔案（JSON）。
- 容器化：
  - 提供 `Dockerfile` 與範例 `docker run` 指令。

（實作時以實際採用技術為準，但需滿足以下 API 與行為規格。）

## 9. 資料模型（示意）
- Project
  - id: string（內部識別）
  - name: string（顯示用名稱）
  - rootPath: string（容器內掛載後的可存取路徑）
  - createdAt: ISO string

- IndexNode（樹狀節點）
  - type: "dir" | "file"
  - name: string
  - path: string（相對於專案根的相對路徑，以 `/` 分隔）
  - children?: IndexNode[]（當 type=dir 時）
  - size?: number（bytes, 當 type=file 時）
  - mtime?: number（UNIX epoch ms, 當 type=file 時）

- FileContent
  - path: string（相對路徑）
  - content: string（UTF-8 Markdown 文字）
  - mtime: number（讀取時的最後修改時間）

- IndexStatus
  - lastRefreshedAt: ISO string
  - version: number（索引重建次數或遞增版本）
  - fileCount: number

## 10. REST API 規格
說明：所有路徑以 `/api` 作為前綴（可調整）。回應格式統一為 JSON；如成功 `success: true`，失敗 `success: false` 並附 `error`。

10.1 健康檢查
- GET `/health`
  - 200 OK → `{ status: "ok", time: <ISO> }`

10.2 專案管理
- GET `/api/projects`
  - 回傳已註冊之專案清單。
  - 200 → `{ success: true, data: Project[] }`
- POST `/api/projects`
  - 新增專案（可選，若不開放 UI，仍保留 API 以利自動化）。
  - Body: `{ name: string, rootPath: string }`
  - 201 → `{ success: true, data: Project }`
- DELETE `/api/projects/:id`
  - 移除專案（可選）。
  - 200 → `{ success: true }`

10.3 索引與樹狀瀏覽
- POST `/api/projects/:id/refresh`
  - 觸發重掃索引。
  - 202 → `{ success: true, data: IndexStatus }`
- GET `/api/projects/:id/index`
  - 取得樹狀索引（若大型可分頁/延遲載入；初版可回整棵樹）。
  - 200 → `{ success: true, data: IndexNode }`
- GET `/api/projects/:id/status`
  - 取得索引狀態與摘要。
  - 200 → `{ success: true, data: IndexStatus }`

10.4 檔案讀寫
- GET `/api/projects/:id/file`
  - Query: `path=<relativePath>`
  - 200 → `{ success: true, data: FileContent }`
  - 404 → `{ success: false, error: "not_found" }`
- PUT `/api/projects/:id/file`
  - Body: `{ path: string, content: string, baseMtime?: number }`
  - 200 → `{ success: true, data: { mtime: number } }`
  - 409 → `{ success: false, error: "conflict" }`（當 `baseMtime` 與目前檔案 mtime 不符時，提示有外部修改）

10.5 錯誤處理與通用格式
- 錯誤回應格式：`{ success: false, error: string, message?: string }`
- 常見錯誤碼：`invalid_argument`, `not_found`, `io_error`, `forbidden`, `conflict`, `internal_error`。

## 11. 前端 UI/UX 規格（概要）
- 導航區域：
  - 專案選擇器（下拉或左側清單）。
  - Refresh 按鈕（顯著位置，重建索引）。
- 左側：樹狀目錄
  - 目錄可展開/收合；
  - `.md` 檔以檔名顯示，支援快速搜尋（可選）。
- 右側：內容區
  - 預覽模式：渲染 Markdown；
  - 編輯模式：文字編輯器（支援基本語法高亮、自動換行、行號可選、快捷鍵 Ctrl/Cmd+S 儲存）。
- 狀態提示：
  - Refresh 中顯示進度或 Loading；
  - 儲存成功/失敗 toast；
  - 衝突（409）提示使用者比對差異（可選：顯示簡易 diff）。

## 12. 索引快取設計
- 觸發：
  - 使用者點擊 Refresh；
  - 專案切換時，如無索引則自動建立。
- 範圍：遞迴只納入 `.md`；忽略 `.git`、`node_modules`、`dist` 等常見目錄（可藉設定調整忽略清單）。
- 資料：樹狀結構與檔案中繼資料；內容不納入索引（僅在開檔時讀取）。
- 優化：
  - 大型專案可採延遲展開（按需讀取子節點）；
  - 可選增量更新（偵測 mtime/size 變化）；
  - 可選檔案系統監聽（watcher），初版可不做，僅手動 Refresh。

## 13. 安全性與權限控管
- 僅允許存取專案根目錄之下的相對路徑（正規化，消除 `..`）。
- 僅允許副檔名為 `.md` 的檔案。
- 檔案寫入前須再次驗證目標路徑合法性。
- 伺服器僅在本地埠提供服務（例如預設 `127.0.0.1`），避免對外暴露（可由使用者自行調整）。

## 14. 部署與執行（Docker）
- 提供 `Dockerfile`：
  - 建置後端與前端，產出可運行的映像；
  - 預設啟動 Web 伺服器於埠號 `8080`（可環境變數調整）。
- Volume 掛載：
  - 使用者以 `-v /local/path:/app/workspaces/<projectName>` 掛載實體目錄；
  - 或以環境變數提供專案清單與對應容器內路徑（例如 `PROJECTS_JSON`）。
- 範例：
  ```bash
  docker run --rm -p 8080:8080 \
    -v /Users/me/Notes:/app/workspaces/notes \
    -e PROJECTS_JSON='[{"id":"notes","name":"Notes","rootPath":"/app/workspaces/notes"}]' \
    markdown-app:latest
  ```
- 設定：
  - `PORT`（預設 8080）
  - `PROJECTS_JSON`（JSON 陣列）或 `PROJECTS_CONFIG`（檔案路徑）
  - `IGNORE_DIRS`（以逗號分隔）

## 15. 日誌與監控
- 後端：
  - 重要事件（啟動、Refresh 開始/完成、檔案讀寫、錯誤）以結構化日誌輸出（JSON）。
- 前端：
  - 使用者重要操作（切換專案、儲存、Refresh）以非侵入方式提示；不做遠端遙測。

## 16. 驗收標準（UAT）
- UAT-1：本地啟動容器後，開啟網頁可看到專案清單；可選擇專案。
- UAT-2：點擊 Refresh 可於可接受時間內建立樹狀索引，並顯示 `.md` 檔案。
- UAT-3：點選任一 `.md` 檔可顯示內容；切換編輯模式修改並儲存成功；再次開啟可見更動。
- UAT-4：嘗試存取非 `.md` 或越權路徑會被拒絕（後端回傳錯誤）。
- UAT-5：大量檔案時，樹狀展開與列表呈現仍於目標延遲範圍內。

## 17. 可擴充方向（未來版本）
- 內建全文搜尋與標籤系統。
- 檔案/目錄新增、刪除、搬移作業。
- 同步雲端（Git、雲端硬碟）與版本控制整合。
- 行內圖片與附件預覽、拖放上傳。
- 多人協作鎖定機制（雖目前定位為本地單人）。

## 18. 風險與限制
- 不支援雲端身分與遠端訪問（預設本地）。
- 大型專案的初次索引可能較慢，需要 UI 進度回報與提示。
- 不支援非 UTF-8 編碼檔案（可於文件中註記或轉碼）。

## 19. 專案里程碑（建議）
- M1：後端 API 原型（健康檢查、掃描、索引、讀寫）。
- M2：前端 UI（專案選擇、樹狀、預覽/編輯、儲存、Refresh）。
- M3：Docker 化與本地驗收（UAT）。
- M4：效能優化與穩定性驗證。

---
本 SRS 規格提供完整的功能/非功能需求與介面契約，實作可依此作為驗收依據與後續開發基準。
