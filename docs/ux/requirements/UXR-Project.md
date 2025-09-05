# UX Requirements - Project

## 模組簡介
負責專案清單顯示與切換，作為進入工作區的入口。

## Requirements

- Requirement ID：PROJ-01
  - 對應 User Story：US-project-Dev-01, US-project-Writer-01
  - 需求描述：首頁顯示可用專案清單，支援鍵盤/滑鼠選取。
  - 互動細節：
    - 元件：Project Switcher（shadcn Select）或清單按鈕。
    - 操作：點擊或鍵盤上下/Enter 選擇；選取後導向 `/p/:projectId`。
    - 系統回饋：切換時顯示 Loading，完成後更新當前專案名稱與索引狀態。
  - 成功條件：3 秒內進入工作區並可見初始樹。
  - 異常情境：專案列表為空 → 顯示空狀態與設定指引。
  - 銜接點：FLOW-project-001 第 1–3 步。

- Requirement ID：PROJ-02
  - 對應 User Story：US-project-Dev-01
  - 需求描述：導航列顯示目前專案名稱與索引狀態。
  - 互動細節：即時顯示 `version` 與 `lastRefreshedAt`，提供手動 Refresh 按鈕。
  - 成功條件：索引狀態與後端一致，時間以本地時區格式化顯示。
  - 異常情境：狀態取得失敗 → 顯示重試按鈕。
  - 銜接點：FLOW-index-002 第 1 步。
