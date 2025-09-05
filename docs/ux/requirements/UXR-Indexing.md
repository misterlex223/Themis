# UX Requirements - Indexing

## 模組簡介
負責索引快取的建立/刷新與樹狀清單的即時同步。

## Requirements

- Requirement ID：IDX-01
  - 對應 User Story：US-index-Dev-02
  - 需求描述：提供 Refresh 按鈕以手動重建索引。
  - 互動細節：
    - 元件：Refresh Button，顯示 loading/disabled 狀態；
    - 操作：點擊觸發 POST `/api/projects/:id/refresh`；
    - 系統回饋：Toast「正在重建索引…」；完成後更新版本與時間，樹狀清單同步刷新。
  - 成功條件：小型 <1s、中型 <5s；UI 有明確進度或 Loading 提示。
  - 異常情境：索引進行中 → 禁用或排隊；錯誤 → 顯示錯誤訊息與重試。
  - 銜接點：FLOW-index-002 全流程。

- Requirement ID：IDX-02
  - 對應 User Story：US-project-Dev-01, US-project-Writer-01
  - 需求描述：進入專案工作區時若無索引，需自動建立並提示。
  - 互動細節：初次載入自動觸發 Refresh，顯示 Skeleton 與提示。
  - 成功條件：索引完成後自動顯示樹狀清單。
  - 異常情境：建立失敗 → 顯示重試按鈕。
  - 銜接點：FLOW-project-001 第 3–4 步。
