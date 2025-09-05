# User Story — Refresh 與索引快取（Dev-02）

作為一個開發者（Dev），
我希望能手動按下 Refresh 讓系統重新掃描並建立索引快取，
以便我能立即在樹狀清單中看到檔案系統的最新變化。

Acceptance Criteria（驗收標準）：
- [ ] 在 `/p/:projectId` 可見 `Refresh` 按鈕與 Loading 狀態。
- [ ] 觸發 Refresh 後，後端開始掃描並於完成後更新索引版本與最後刷新時間。
- [ ] 小型專案 < 1 秒、中型 < 5 秒；若超過則顯示進度或 Loading 提示。
- [ ] Refresh 完成後樹狀清單與檔案數量、節點即時更新。
