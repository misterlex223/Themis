---
id: PAT-index-002
title: 索引刷新模式
category: Indexing
related-flows: [FLOW-index-002]
description: |
  透過顯著的 Refresh 按鈕觸發後端重建索引，完成後自動更新樹狀清單與狀態列。
components:
  - Refresh Button
  - Status Indicator (version/lastRefreshedAt)
  - TreeView
usage: |
  當檔案系統可能被外部工具修改時，保證 UI 與磁碟狀態一致。
acceptance: |
  - 小型 <1s；中型 <5s 完成
  - 刷新過程有 Loading/進度提示
---
