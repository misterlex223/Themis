---
id: FLOW-index-002
title: 索引刷新流程
module: indexing
related-requirements: [IDX-01, IDX-02]
actors: [使用者, 系統]
status: draft
---

## Flow 步驟
1. 使用者位於 `/p/:projectId` 工作區。
2. 使用者點擊頂部工具列的 `Refresh` 按鈕。
3. 系統以 POST `/api/projects/:id/refresh` 觸發重建索引，UI 顯示 Loading/禁用按鈕。
4. 後端開始遞迴掃描 `.md` 並建立樹狀索引（忽略清單生效）。
5. 後端完成後回傳最新 IndexStatus（version、lastRefreshedAt、fileCount）。
6. 前端更新狀態列並重新擷取樹狀索引（GET `/api/projects/:id/index`）。
7. UI 更新左側樹狀清單，顯示最新檔案結構。
