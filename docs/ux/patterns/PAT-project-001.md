---
id: PAT-project-001
title: 專案切換模式
category: Project Management
related-flows: [FLOW-project-001]
description: |
  提供使用者在首頁快速選擇並切換至指定專案工作區的標準模式。
components:
  - Project Switcher (shadcn Select / List)
  - TopBar (專案名稱與索引狀態)
usage: |
  適用於多倉庫、多專案的本地文件瀏覽場景，作為進入工作區的入口。
acceptance: |
  - 能在 3 秒內完成切換
  - 導航列同步顯示專案名稱與索引狀態
---
