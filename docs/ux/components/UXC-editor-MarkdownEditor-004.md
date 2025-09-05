---
id: UXC-editor-MarkdownEditor-004
title: MarkdownEditor
module: editor
level: organism
parent: null
children: []
related-personas: [P-project-Dev, P-project-Writer]
related-scenarios: [SC-file-Dev-03]
related-stories: [US-file-Dev-03]
related-requirements: [EDT-01, EDT-02]
related-patterns: [PAT-editor-003]
states: [default, focus, saving, error]
variants: [textarea]
a11y: 鍵盤快捷鍵、可視焦點
responsiveness: 全寬高度自適應
status: draft
owner: UX
version: 1.0.0
last_reviewed: 2025-09-05
---

## Purpose
提供 Markdown 文字編輯，支援快捷鍵儲存與基本狀態顯示。

## Context
Workspace 右側 Content 區的編輯模式。

## Composition
- textarea（基本版）
- Save 按鈕（或 SaveBar 控件）

## Interaction Model
- `Ctrl/Cmd+S` 儲存，阻止瀏覽器預設行為

## States & Feedback
- saving：顯示旋轉圖示；error：toast

## Variants & Rules
- textarea（預設），未來可升級 Monaco/CodeMirror

## Content Schema
- content string，baseMtime

## Validation & Errors
- 空內容允許；提交流程處理衝突

## Accessibility
- 焦點顯著、ARIA label

## Responsiveness
- 區塊可伸縮

## Telemetry
- 儲存次數（本地）

## Non-goals
- 不含語法高亮

## Figma Make Prompt
建立簡潔的 Markdown 編輯區，呈現工具列與儲存動作（可含快捷鍵提醒）。

## References
- `docs/ux/flows/FLOW-editor-003.md`
