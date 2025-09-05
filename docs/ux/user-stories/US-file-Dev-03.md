# User Story — 開啟、編輯與衝突處理（Dev-03）

作為一個開發者（Dev），
我希望能在編輯 Markdown 檔時偵測外部修改並避免覆蓋，
以便確保多人或多工具並行作業時不會遺失內容。

Acceptance Criteria（驗收標準）：
- [ ] 在 `/p/:projectId` 選取 `.md` 檔後可看到內容預覽。
- [ ] 切換至 `Edit` 模式後可編輯文字（支援 Ctrl/Cmd+S）。
- [ ] 送出儲存時帶上 `baseMtime`；若後端回 `409 conflict`，顯示「檔案已被外部修改」並提供「重新載入」。
- [ ] 成功儲存後以 toast 顯示成功，並更新目前檔案的 mtime。
