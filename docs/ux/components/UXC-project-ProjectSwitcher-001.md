---
id: UXC-project-ProjectSwitcher-001
title: Project Switcher
module: project
level: molecule
parent: null
children: []
related-personas: [P-project-Dev, P-project-Writer]
related-scenarios: [SC-project-Dev-01, SC-project-Writer-01]
related-stories: [US-project-Dev-01, US-project-Writer-01]
related-requirements: [PROJ-01]
related-patterns: [PAT-project-001]
states: [default, focus, loading, empty, error]
variants: [select, list]
a11y: 支援鍵盤上下與 Enter 選擇，ARIA 標籤
responsiveness: xs-full, md-inline
status: draft
owner: UX
version: 1.0.0
last_reviewed: 2025-09-05
---

## Purpose
作為首頁入口讓使用者選擇目標專案。

## Context
出現於 `/` Home；引用於 Workspace TopBar。

## Composition
- Label（可選）
- Select/List（專案名稱/描述）

## Interaction Model
- 點擊/鍵盤選擇 → 觸發導向 `/p/:projectId`。

## States & Feedback
- loading：Skeleton
- empty：顯示設定指引
- error：重試

## Variants & Rules
- select（預設）；list（專案數量少時）

## Content Schema
- name（必填），description（選）

## Validation & Errors
- 無特殊驗證；讀取失敗提供重試

## Accessibility
- ARIA role=listbox；鍵盤操作

## Responsiveness
- 手機全寬、桌機內嵌

## Telemetry
- 切換成功率、平均切換時間（僅本地顯示，可不蒐集）

## Non-goals
- 不負責新增/刪除專案

## Figma Make Prompt
使用 shadcn Select 建立專案選擇器，包含名稱與（可選）描述；支援鍵盤上下與 Enter 選擇，樣式採用 Tailwind。

## References
- `docs/ux/requirements/UXR-Project.md`
- `docs/ux/flows/FLOW-project-001.md`
- `docs/ux/patterns/PAT-project-001.md`

## Open Questions
- 是否需顯示最近使用專案排序？
