# Page: Home
ID: UXP-home
Related Flows: [FLOW-project-001]
Related Requirements: [PROJ-01]
Related Layout: none

## 1. Page Purpose
- 提供專案清單並作為進入工作區的入口。

## 2. Layout
- 中央置中的選擇器與描述；簡單 Header（可選 Logo）。

## 3. Page Structure
- Header（可選）
- Main：Project Switcher、最近使用提示（可選）

## 4. Components Used
- Project Switcher（UXC-project-ProjectSwitcher-001）

## 5. Interaction Flow
- 載入專案 → 選擇 → 導向 `/p/:projectId`

## 6. Variants / States
- Loading（Skeleton）
- Empty（顯示設定 Volume 與環境變數說明）
- Error（重試）

## 7. References
- Requirements: UXR-Project.md
