# Page: Workspace
ID: UXP-workspace
Related Flows: [FLOW-project-001, FLOW-index-002, FLOW-editor-003]
Related Requirements: [PROJ-02, IDX-01, IDX-02, EDT-01, EDT-02]
Related Layout: UXL-sidebar-content

## 1. Page Purpose
- 提供單一專案的樹狀瀏覽、檔案預覽與編輯空間。

## 2. Layout
- 採用 Sidebar + Content 佈局。

## 3. Page Structure
- TopBar：專案切換、Refresh、狀態
- Sidebar：TreeView
- Content：Viewer/Editor + SaveBar

## 4. Components Used
- TopBar（UXC-core-TopBar-006）
- TreeView（UXC-explorer-TreeView-002）
- MarkdownViewer（UXC-editor-MarkdownViewer-003）
- MarkdownEditor（UXC-editor-MarkdownEditor-004）
- SaveBar（UXC-editor-SaveBar-005）
- Toast（UXC-core-Toast-007）

## 5. Interaction Flow
- 進入頁面 → 若無索引自動 Refresh → 顯示樹 → 點檔案 → 預覽/編輯 → 儲存/衝突處理

## 6. Variants / States
- Loading（索引建立中）
- Empty（無 `.md`）
- Error（API 錯誤）

## 7. References
- Patterns: PAT-project-001, PAT-index-002, PAT-editor-003
- Requirements: UXR-Project.md, UXR-Indexing.md, UXR-Editor.md
