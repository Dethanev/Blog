# 移除 Docker / GitHub Actions 殘留,清理為純 Cloudflare Pages 專案

## 目標
Blog 已從「LXC + Docker + Watchtower」遷到 Cloudflare Pages,Repo 裡舊部署檔案全部沒人引用,直接刪乾淨,讓 repo 看起來就只是一個 Astro 靜態站。

## 刪除的檔案
- `Dockerfile` — Astro build + nginx 兩階段 image
- `compose.yaml` — `blog` 服務 + `watchtower` 自動更新
- `nginx.conf` — runtime nginx 設定
- `.dockerignore`
- `.github/workflows/docker-publish.yml` — 推 image 到 `ghcr.io/dethanev/blog` 的 workflow(連同 `.github/` 整個目錄移除)

## 修改的檔案

### `.gitignore`
拿掉早期 Cloudflare Workers 嘗試留下的 wrangler 區塊:

```diff
-# wrangler files
-.wrangler
-.dev.vars*
-!.dev.vars.example
-!.env.example
```

### `package-lock.json`
上一次 `refactor: remove Cloudflare integration` 並沒有同步 lockfile,裡面還有 `wrangler` 與其 transitive deps 的孤兒條目。這次 `rm package-lock.json && npm install` 重生,`wrangler` 完全清除,lockfile 大小 256KB → 228KB。

> 殘留的 `is-docker` 不是舊 docker 設定遺物,是 `@astrojs/telemetry` 的 transitive dep(Astro 用來判斷是否在容器內跑遙測),屬於正常依賴,保留。

## 沒動的地方
- `astro.config.mjs`:`output: "static"`、無 adapter,Cloudflare Pages 直接吃 `dist/`。
- `src/` / `public/`:`grep -rIl -E "docker|ghcr|watchtower|nginx|workflow"` 無命中,原本就沒被引用。

## 手動驗證
- [x] `npm run build` 通過,10 頁正常產出。
- [x] `git status` 為純刪除 + `.gitignore` / `package-lock.json` 兩處修改,沒誤動其他檔案。
- [x] `npm ls wrangler` 顯示 `(empty)`。
- [ ] push 後 Cloudflare Pages 自動部署成功,線上 `dethanev.app` 與部署前一致。
