---
id: FLOW-project-001
title: 專案切換流程
module: project
related-requirements: [PROJ-01, PROJ-02]
actors: [使用者, 系統]
status: draft
---

## Flow 步驟
1. 使用者打開首頁 `/`。
2. 系統載入專案清單（名稱/描述）。
3. 使用者以滑鼠或鍵盤選取一個專案。
4. 系統導向 `/p/:projectId`，顯示當前專案名稱與索引狀態（版本/最後刷新時間）。
5. 若索引不存在，系統自動觸發 Refresh 並顯示 Skeleton（參見 FLOW-index-002）。
6. 索引就緒後，左側顯示樹狀清單，右側顯示空狀態或上次開啟的檔案。
