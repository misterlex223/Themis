---
id: UXC-editor-MarkdownViewer-003
title: MarkdownViewer
module: editor
level: molecule
parent: null
children: []
related-personas: [P-project-Dev, P-project-Writer]
related-scenarios: [SC-file-Dev-03]
related-stories: [US-file-Dev-03]
related-requirements: [EDT-01]
related-patterns: [PAT-editor-003]
states: [default, loading, empty]
variants: [typography-default]
a11y: 語意化標題與清單
responsiveness: 文字區塊最大寬度控制
status: draft
owner: UX
version: 1.0.0
last_reviewed: 2025-09-05
---

## Purpose
渲染 Markdown 內容的可讀預覽。

## Context
Workspace 右側 Content 區的預覽模式。

## Composition
- 文本容器（Tailwind typography）

## Interaction Model
- 僅觀察，連結在新視窗開啟

## States & Feedback
- loading skeleton；空內容顯示提示

## Variants & Rules
- typography-default（預設）

## Content Schema
- markdown string

## Validation & Errors
- 不處理 HTML 注入

## Accessibility
- 可達標題階層

## Responsiveness
- 中等最大寬度、可滾動

## Telemetry
- 無

## Non-goals
- 不負責編輯

## Figma Make Prompt
建立一個具有良好排版的 Markdown 預覽區塊，使用 Tailwind Typography。

## References
- `docs/ux/requirements/UXR-Editor.md`
- `docs/ux/patterns/PAT-editor-003.md`
