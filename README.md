# 改寫 BaseLayout 的 SEO meta 標籤

## 目標
讓 Google / Facebook / Twitter 抓網站時拿到更專業、可控的標題與描述,不要再讓搜尋結果靠 Hero 區的文字湊出 snippet。原本 default title 寫「dethanev / blog」(斜線會被 Google 誤判成 URL 路徑)、description 只有「我寫 code、做 App、偶爾在這裡碎碎念。」太短,前 100 字沒帶到任何關鍵字。

## 修改的檔案

### `src/layouts/BaseLayout.astro`
把 SEO 文字抽成三個常數放在 `Astro.props` 解構**上方**,以後改 SEO 文字只動一塊:

```diff
+const SITE_NAME = "Dethanev";
+const DEFAULT_TITLE = "Dethanev";
+const DEFAULT_DESCRIPTION = "Dethanev 的個人網站與部落格。\n專注 App 開發、Web 前端、設計與 side project 紀錄,偶爾寫些開發筆記與生活碎念。";
 const {
-  title = "dethanev / blog",
-  description = "我寫 code、做 App、偶爾在這裡碎碎念。",
+  title = DEFAULT_TITLE,
+  description = DEFAULT_DESCRIPTION,
   ogImage = "/og-default.png",
   showFooter = true,
 } = Astro.props;
-const fullTitle = title === "dethanev / blog" ? title : `${title} — dethanev/blog`;
+const fullTitle = title === DEFAULT_TITLE ? title : `${title} — ${SITE_NAME}`;
```

`<title>` / `<meta description>` / `<meta og:title>` / `<meta og:description>` 都會自動跟著更新(因為下面 head 區是引用同一組變數)。

## 為什麼這樣選
- **title 用純品牌 `Dethanev`**:站台不只是 blog(有 about / now / side project 列表),寫成「Dethanev / blog」或「Dethanev 部落格」都不準。純品牌最乾淨,子頁面會自動接成 `xxx — Dethanev`。
- **拋棄 `/` 分隔符**:Google 看到 `/` 容易誤判成 URL 路徑層級,改成 em-dash `—` 是 SEO 標準寫法。
- **description 拉到 70 字左右**:Google 建議 120~160 字元,中文 60~80 字最剛好。前半「Dethanev 的個人網站與部落格」拿來定位身份,後半列出可被搜尋到的關鍵字(App 開發、Web 前端、設計、side project、開發筆記、生活碎念)。
- **抽常數而不是直接寫死**:`fullTitle` 的等號比對之前依賴硬編字串,改文字時兩處要同步,容易漏。抽成 `DEFAULT_TITLE` 後只動一處。

## 手動驗證
- [ ] `npm run dev` 開首頁,F12 看 `<head>`:
  - `<title>` 顯示 `Dethanev`(不是 `Dethanev — Dethanev`,因為首頁沒傳 title prop,fullTitle 走 if 分支只顯示 title 本身)。
  - `<meta name="description">` 是新的長版描述。
  - `<meta property="og:title">` / `og:description` 跟著一起更新。
- [ ] 隨便開一篇文章頁(走 `PostLayout`),title 應該變成 `文章標題 — Dethanev`,不是舊的 `文章標題 — dethanev/blog`。
- [ ] 部署完後,用 https://www.opengraph.xyz 或在 Slack 貼 https://www.dethanev.app/ 看 OG 預覽卡是新版本。
- [ ] 等 1~3 天 Googlebot 重爬,在 Google 搜 `dethanev` 確認搜尋結果標題已換成 `Dethanev`、描述換成新版。
