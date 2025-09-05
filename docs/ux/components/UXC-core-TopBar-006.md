---
id: UXC-core-TopBar-006
title: TopBar
module: core
level: organism
parent: null
children: []
related-personas: [P-project-Dev, P-project-Writer]
related-scenarios: [SC-project-Dev-01, SC-index-Dev-02]
related-stories: [US-project-Dev-01, US-index-Dev-02]
related-requirements: [PROJ-02, IDX-01]
related-patterns: [PAT-project-001, PAT-index-002]
states: [default, loading]
variants: [with-status]
a11y: 可達
responsiveness: 自適應
status: draft
owner: UX
version: 1.0.0
last_reviewed: 2025-09-05
---

## Purpose
呈現專案切換、Refresh 按鈕與索引狀態。

## Context
全站 Header。

## Composition
- Project Switcher
- Refresh Button
- Status Indicator（version/time）

## Interaction Model
- 點擊 Refresh 觸發流程；切換專案導向工作區

## States & Feedback
- loading 樣式

## Variants & Rules
- with-status（預設）

## Content Schema
- projectName, version, lastRefreshedAt

## Figma Make Prompt
建立含專案選擇與 Refresh 的頂部工具列，右側顯示索引狀態。

## References
- `docs/ux/layouts/UXL-sidebar-content.md`
