---
id: PAT-editor-003
title: Markdown 編輯與衝突處理模式
category: Editor
related-flows: [FLOW-editor-003]
description: |
  提供 Markdown 檔案的預覽/編輯切換、快捷鍵儲存，以及 409 衝突提示與重新載入。
components:
  - MarkdownViewer
  - MarkdownEditor
  - SaveBar
  - Conflict Dialog/Toast
usage: |
  多工具並行（外部 IDE）時，避免覆蓋他人或外部修改。
acceptance: |
  - 儲存成功更新 mtime
  - 發生衝突時不覆蓋並可重新載入
---
