---
id: FLOW-editor-003
title: 檔案開啟、編輯與儲存流程
module: editor
related-requirements: [EDT-01, EDT-02]
actors: [使用者, 系統]
status: draft
---

## Flow 步驟
1. 使用者在 `/p/:projectId` 的樹狀清單中點選某 `.md` 檔（更新 URL `?path=...&mode=preview`）。
2. 系統以 GET `/api/projects/:id/file?path=...` 載入內容，顯示預覽（react-markdown）。
3. 使用者點擊 `Edit` 或按 `E` 切換至編輯模式（更新 URL `mode=edit`），顯示 `textarea` 與 `Save`。
4. 使用者按下 `Ctrl/Cmd + S` 或點擊 `Save`，系統發出 PUT `/api/projects/:id/file`，Body 含 `path`, `content`, `baseMtime`。
5. 若成功：
   - 系統顯示成功 toast，更新目前檔案的 `mtime` 與內容。
   - 返回編輯模式或切回預覽（依設定，初版保持在編輯）。
6. 若回 `409 conflict`：
   - 顯示對話框/提示「檔案已被外部修改」，提供「重新載入」。
   - 使用者點擊後重新 GET 檔案，更新內容與 `baseMtime`，回到編輯。
