---
id: UXC-editor-SaveBar-005
title: SaveBar
module: editor
level: molecule
parent: null
children: []
related-personas: [P-project-Dev, P-project-Writer]
related-scenarios: [SC-file-Dev-03]
related-stories: [US-file-Dev-03]
related-requirements: [EDT-01]
related-patterns: [PAT-editor-003]
states: [default, saving, success, error]
variants: [inline, sticky]
a11y: 鍵盤可操作、明確的 aria-label
responsiveness: 固定於內容頂部或底部
status: draft
owner: UX
version: 1.0.0
last_reviewed: 2025-09-05
---

## Purpose
提供 Save 與模式切換按鈕，顯示狀態與 mtime。

## Context
Editor 上方或下方的控制列。

## Composition
- Save（主按鈕）
- Mode 切換（Preview/Edit）
- mtime 顯示

## Interaction Model
- 點擊 Save 或 `Ctrl/Cmd+S` 觸發儲存

## States & Feedback
- saving spinner、成功 toast、錯誤 toast

## Variants & Rules
- inline（預設）/ sticky（長文）

## Content Schema
- mtime, mode

## Validation & Errors
- 無表單驗證

## Accessibility
- 明確標籤

## Responsiveness
- 寬度自適應

## Telemetry
- Save 次數/成功率（本地）

## Non-goals
- 不處理衝突

## Figma Make Prompt
建立一個含 Save 與模式切換的工具列，顯示檔案更新時間。

## References
- `docs/ux/patterns/PAT-editor-003.md`
