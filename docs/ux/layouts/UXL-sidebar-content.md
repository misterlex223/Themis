# Layout: Sidebar + Content
ID: UXL-sidebar-content
Related Patterns: [PAT-project-001, PAT-index-002, PAT-editor-003]
Related Flows: [FLOW-project-001, FLOW-index-002, FLOW-editor-003]

## 1. Purpose
- 用於工作區頁面：左側樹狀、右側內容。
- 解決快速導覽與編輯的結構需求。

## 2. Structure
- Header/TopBar：專案選擇、Refresh、狀態顯示。
- Sidebar（固定寬度，可滾動）：TreeView。
- Content（可滾動）：Viewer/Editor 與工具列。

## 3. Variants
- Sidebar 固定寬度（預設） / 可摺疊（未來版）。
- Content 模式：Preview / Edit。

## 4. Components Mapping
- TopBar → Project Switcher, Refresh, Status Indicator, Toast
- Sidebar → TreeView
- Content → MarkdownViewer/MarkdownEditor, SaveBar

## 5. Example Pages
- Workspace（`/p/:projectId`）

## 6. References
- Patterns: PAT-project-001, PAT-index-002, PAT-editor-003
- Flows: FLOW-project-001, FLOW-index-002, FLOW-editor-003
