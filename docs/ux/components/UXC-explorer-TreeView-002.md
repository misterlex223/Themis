---
id: UXC-explorer-TreeView-002
title: TreeView
module: explorer
level: organism
parent: null
children: []
related-personas: [P-project-Dev, P-project-Writer]
related-scenarios: [SC-index-Dev-02, SC-project-Writer-01]
related-stories: [US-index-Dev-02, US-project-Writer-01]
related-requirements: [IDX-01, IDX-02]
related-patterns: [PAT-index-002]
states: [default, loading, empty, error]
variants: [dense, comfy]
a11y: 支援鍵盤展開/收合
responsiveness: 固定寬度側欄，可縱向滾動
status: draft
owner: UX
version: 1.0.0
last_reviewed: 2025-09-05
---

## Purpose
以樹狀結構呈現 `.md` 檔案與目錄，支援展開/收合。

## Context
Workspace 左側 Sidebar。

## Composition
- Node（icon + name）
- Expand/Collapse caret

## Interaction Model
- 點擊目錄展開/收合；點擊檔案載入右側內容

## States & Feedback
- loading：Skeleton；empty：顯示提示

## Variants & Rules
- dense（開發者偏好），comfy（寫作者偏好）

## Content Schema
- name, type, path, children[]

## Validation & Errors
- 非 `.md` 禁用點擊

## Accessibility
- ARIA tree pattern；鍵盤方向鍵操作

## Responsiveness
- 高度可滾動

## Telemetry
- 展開/收合次數（本地）

## Non-goals
- 不負責檔案新增/刪除

## Figma Make Prompt
建立可展開/收合的樹狀列表，節點包含資料夾與 Markdown 檔案圖示，支援鍵盤導覽。

## References
- `docs/ux/requirements/UXR-Indexing.md`
- `docs/ux/flows/FLOW-index-002.md`
