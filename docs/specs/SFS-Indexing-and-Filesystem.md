# SFS — 索引快取與檔案系統規格

## 1. 目標
- 在可接受的時間內掃描大量 `.md` 檔案並構建樹狀索引。
- 保障安全：僅允許專案 root 下 `.md`，嚴格路徑正規化。
- 支援 Refresh 手動重建；可擴充為增量更新與檔案系統監聽（未來版）。

## 2. 掃描與索引演算法
- 初版全量掃描：
  - DFS 遞迴遍歷目錄；忽略清單內目錄；
  - 只收集 `.md` 檔案；
  - 為每一層建立 `IndexNode`：
    - 目錄：`{ type: 'dir', name, path, children: [...] }`
    - 檔案：`{ type: 'file', name, path, size, mtime }`
- 路徑：
  - `path` 為相對於專案 root 的 POSIX 路徑（使用 `/`）。
  - 名稱 `name` 為實際檔/目錄名（區分大小寫）。

## 3. 忽略清單
- 預設：`.git`, `node_modules`, `dist`, `build`, `.next`, `.cache`。
- 透過 `IGNORE_DIRS` 以逗號指定（相對或名稱匹配，遇到同名目錄則忽略）。

## 4. 快取策略
- 進程內記憶體儲存（Map：`projectId -> { root, tree, status }`）。
- `status`：
  - `lastRefreshedAt`（ISO）、`version`（自增）、`fileCount`。
- 可選寫入 JSON 檔以保留最新索引（初版可不做）。

## 5. Refresh 行為
- 入口：`POST /api/projects/:id/refresh`。
- 互斥：若已在執行，直接回傳現況，不重入。
- 完成：更新快取與 `status`，並回傳最新狀態。
- 大案量：
  - 可於未來提供進度事件（SSE `/api/projects/:id/refresh/events`）。

## 6. 檔案讀寫規格
- 讀取：
  - 正規化 `path`，取得實際檔案絕對路徑；
  - `fs.readFile` 以 UTF-8；回傳 `content` 與當前 `mtime`。
- 寫入：
  - 檢查 `.md` 副檔名與路徑合法；
  - 若 `baseMtime` 提供且與當前不同，回 `409 conflict`；
  - `fs.writeFile` 後重新讀取 `mtime` 回傳；
  - 局部更新索引：僅更新該檔案節點之 `mtime`/`size`；必要時同步父目錄存在性。

## 7. 路徑正規化與安全
- 禁止：絕對路徑、`..`、符號連結逃逸；
- 使用 `path.resolve(root, candidate)` 後以 `realpath` 確認仍在 `root` 下；
- 僅允許 `.md`（副檔名以小寫比對，多副檔名視為非法）。

## 8. 效能目標（對應 SRS）
- 小型（<1k 檔）：Refresh < 1s
- 中型（1k–10k）：Refresh < 5s
- 大型（>10k）：線性擴展，提供進度提示

## 9. 併發與一致性
- Refresh 與寫入同時進行時：
  - Refresh 優先讀取最新磁碟狀態；
  - 寫入成功後更新該檔案節點（避免整體重掃）。
- I/O 錯誤：
  - 轉換為 `io_error` 並附說明訊息；
  - 不使服務崩潰。

## 10. 例外與邊界
- 非 UTF-8 檔案：回 `invalid_argument` 或以最佳努力讀取並警告（初版直接拒絕）。
- 超大檔案：讀寫前檢查大小（> 10 MB 發出警告，仍允許）。
