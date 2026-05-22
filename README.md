# 啟用 giscus:填入正式 repo / category ID

## 目標
上一次 commit 已經把 giscus 元件、Footer/About 的 email 替換、Docker 殘留清理都做完,但 `Comments.astro` 裡的 4 個 ID 還是 `<OWNER/REPO>` 之類的 placeholder,所以文章底部仍顯示「留言區尚未設定」橘色提示框。

這次只做一件事:把 giscus.app 產出的 4 個 ID 填進去,讓留言區真正活起來。

## 修改的檔案

### `src/components/Comments.astro`
```diff
-const repo = "<OWNER/REPO>";
-const repoId = "<REPO_ID>";
-const category = "<CATEGORY_NAME>";
-const categoryId = "<CATEGORY_ID>";
+const repo = "Dethanev/Blog";
+const repoId = "R_kgDOShmJkw";
+const category = "Announcements";
+const categoryId = "DIC_kwDOShmJk84C9ntb";
```

`configured` 那段判斷式邏輯不動,placeholder 都填完後自動為 `true`,改走 giscus 真實掛載分支。

## 為什麼選這幾個值
- **repo**:`Dethanev/Blog` — Blog 的 GitHub repo。GitHub URL 大小寫不敏感,giscus 用 repo ID 找 repo,所以截圖裡的 `Dethanev/blog` 與這裡的 `Dethanev/Blog` 等價。
- **category = Announcements**:只有 maintainer 跟 giscus 可以開新 discussion,讀者只能在已存在的 discussion 下回覆。比 General 安全,擋掉隨機開新討論的 spam。
- **pathname 對應**:沿用上次的設定,文章 URL 為 key,標題改了也不會跑掉 discussion。

## 手動驗證
- [ ] `npm run dev`,打開任一篇文章,確認:
  - 底部不再是橘色提示框,改成 giscus 留言區 iframe。
  - 切換深淺主題時,giscus 也跟著切(MutationObserver + postMessage)。
  - 用上下篇導覽切換到另一篇文章,留言區重新掛載到新文章的 discussion,而不是卡在前一篇。
- [ ] 在文章底下實際留言一次,驗證 GitHub Discussions 那邊有對應的 discussion 被自動建立。
