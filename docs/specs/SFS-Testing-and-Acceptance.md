# SFS — 測試與驗收

## 1. 測試策略
- 單元測試：
  - 後端：path 正規化、md 檢查、掃描與索引、檔案讀寫與衝突處理。
  - 前端：API client、React Query hooks、核心元件（TreeView、Editor）。
- 整合測試：
  - 後端 API 端點（使用 supertest / light-my-request）。
- 端到端（E2E）：
  - Playwright：載入專案、Refresh、展開樹、開啟檔案、切換編輯、儲存、重新載入驗證。

## 2. 測試資料
- 建立樣本專案目錄：`/fixtures/notes`，含多層目錄與 50+ `.md` 檔案，並混合忽略目錄。

## 3. 驗收（對應 SRS UAT）
- UAT-1：啟動容器後可見專案清單並可切換。
- UAT-2：Refresh 時間符合規格（小型 <1s；中型 <5s）。
- UAT-3：可預覽、編輯、儲存並在重新載入後保留變更。
- UAT-4：越權與非 `.md` 路徑請求被拒絕。
- UAT-5：大案量樹狀展開/清單在 200–500ms 內（索引就緒）。

## 4. 效能測試（建議）
- 生成 1k / 10k `.md` 測試集，測量 Refresh 時間與 API 延遲。

## 5. 日誌與除錯
- 後端：pino 等級 `info`；測試時可降至 `silent`。
- 前端：開發模式顯示 React Query devtools（可選）。
