# UX Requirements - Editor

## 模組簡介
負責 Markdown 預覽與編輯、儲存與衝突處理。

## Requirements

- Requirement ID：EDT-01
  - 對應 User Story：US-file-Dev-03
  - 需求描述：檔案檢視與編輯模式切換，支援快捷鍵儲存。
  - 互動細節：
    - 元件：MarkdownViewer、MarkdownEditor、SaveBar；
    - 操作：按鈕或鍵盤 `E`/`Esc` 切換模式；`Ctrl/Cmd+S` 觸發儲存。
    - 系統回饋：儲存成功顯示 toast 並更新檔案 mtime。
  - 成功條件：內容正確寫回、mtime 更新、預覽同步。
  - 異常情境：寫入失敗 → 顯示錯誤與重試；409 衝突 → 見 EDT-02。
  - 銜接點：FLOW-editor-003 第 1–5 步。

- Requirement ID：EDT-02
  - 對應 User Story：US-file-Dev-03
  - 需求描述：儲存時偵測 `409 conflict` 並避免覆蓋外部修改。
  - 互動細節：
    - 元件：Dialog/Toast；
    - 操作：顯示「檔案已被外部修改」並提供「重新載入」。
    - 系統回饋：重新載入後重設 `baseMtime` 與內容。
  - 成功條件：不覆蓋外部變更；使用者可繼續編輯新版本內容。
  - 異常情境：多次衝突 → 建議使用外部 diff（未來提供內建 diff）。
  - 銜接點：FLOW-editor-003 第 6–7 步。
