---
id: UXC-core-Toast-007
title: Toast
module: core
level: atom
parent: null
children: []
related-personas: [P-project-Dev, P-project-Writer]
related-scenarios: [SC-index-Dev-02, SC-file-Dev-03]
related-stories: [US-index-Dev-02, US-file-Dev-03]
related-requirements: []
related-patterns: []
states: [info, success, error]
variants: [top-right]
a11y: 可關閉、ARIA live region
responsiveness: 固定角落
status: draft
owner: UX
version: 1.0.0
last_reviewed: 2025-09-05
---

## Purpose
以非侵入方式提示操作結果。

## Context
全站共用。

## Interaction Model
- 自動消失；錯誤可手動關閉

## Figma Make Prompt
建立簡潔可關閉的 Toast 元件，支持資訊/成功/錯誤三種樣式。

## References
- `docs/specs/SFS-Frontend-UI.md`
