# PLAN-03 — Docker 與 DevOps

目標：提供單一 Docker image（前端靜態檔 + 後端 Fastify），並提供本地執行與 Healthcheck。對齊 `docs/specs/SFS-Deployment-and-DevOps.md`。

## 範圍
- Dockerfile（multi-stage）：build FE → build BE → runtime。
- entrypoint.sh：整理環境變數與啟動後端（同時服務前端 build）。
- 本地執行：`docker run` 範例與 volume 掛載。

## 步驟
1. 建立 `docker/Dockerfile` 與 `docker/entrypoint.sh`（可執行）。
2. 調整後端靜態檔服務設定，將 `public/` 指向 FE build 產物。
3. 撰寫 README 片段與 `docker run` 撰寫於 `docs/specs/SFS-Deployment-and-DevOps.md` 對應。

## 驗收
- `docker build -t markdown-app:latest .` 成功。
- `docker run` 可以於 `http://127.0.0.1:8080` 開啟 UI。
- `HEALTHCHECK` 成功（/health 回 ok）。
