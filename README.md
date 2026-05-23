# 把站上顯示用的 Ethan 改名為 Dethanev,favicon 換成綠底 D

## 目標
站上所有顯示給讀者看的「Ethan」字樣（含 `ETHAN` 大寫版、`@ethan` handle、Nav 左上角的 `E.` logo mark）都要統一改成 `Dethanev` 系列,跟 GitHub handle、`dethanev.app` 網域對齊。同時把 favicon 從粉紅底 `E` 換成綠底 `D`,綠色沿用 PostCard 的 lime 配色（`--color-lime: #b8e14a`）。

filesystem 路徑（`/Users/ethan/`）跟程式碼裡已經是 `Dethanev` 的 GitHub URL 不動。

## 修改的檔案

### `public/favicon.svg`
```diff
-<rect ... fill="#FF5C8A" stroke="#0A0A0F" stroke-width="3"/>
-<text ... fill="#0A0A0F">E</text>
+<rect ... fill="#B8E14A" stroke="#0A0A0F" stroke-width="3"/>
+<text ... fill="#0A0A0F">D</text>
```

### `src/components/Nav.astro`
左上角 logo:
```diff
-<span class="logo-mark">E.</span>
-<span class="logo-text">ethan/blog</span>
+<span class="logo-mark">D.</span>
+<span class="logo-text">dethanev/blog</span>
```

### `src/components/Hero.astro`
```diff
-I'M <em>ETHAN</em>.
+I'M <em>DETHANEV</em>.
...
-<Sticker text="@ethan" color="violet" .../>
+<Sticker text="@dethanev" color="violet" .../>
```

### `src/components/Footer.astro`
Discord handle、底部版權字、巨大水印三處:
```diff
-{ label: "Discord", href: "#", handle: "@ethan" },
+{ label: "Discord", href: "#", handle: "@dethanev" },
...
-© {year} ETHAN. no rights reserved.
+© {year} DETHANEV. no rights reserved.
...
-<div class="big-mark" aria-hidden="true">ETHAN/2026</div>
+<div class="big-mark" aria-hidden="true">DETHANEV/2026</div>
```

### `src/layouts/BaseLayout.astro`
預設 title 跟 fullTitle 模板:
```diff
-title = "ethan / blog",
+title = "dethanev / blog",
...
-const fullTitle = title === "ethan / blog" ? title : `${title} — ethan/blog`;
+const fullTitle = title === "dethanev / blog" ? title : `${title} — dethanev/blog`;
```

### `src/pages/about.astro`
```diff
-<BaseLayout title="關於" description="關於 Ethan 的二三事">
+<BaseLayout title="關於" description="關於 Dethanev 的二三事">
...
-<span class="line accent">ETHAN.</span>
+<span class="line accent">DETHANEV.</span>
...
-我是 Ethan。寫 code 算長期工作...
+我是 Dethanev。寫 code 算長期工作...
```

### `src/pages/index.astro`
```diff
-Hi,我是 Ethan。白天寫 App...
+Hi,我是 Dethanev。白天寫 App...
```

## 為什麼這樣選
- **綠色用 `#B8E14A`**:就是 `src/styles/global.css` 裡 `--color-lime`,PostCard `variant="lime"` 卡片背景同一個值,跟站上既有色票一致。
- **大小寫策略**:原本就是大寫的（`ETHAN.`、`ETHAN/2026`)跟著大寫成 `DETHANEV.`、`DETHANEV/2026`;handle 全小寫的 `@ethan` 跟著小寫成 `@dethanev`;一般稱呼維持首字大寫 `Dethanev`。
- **filesystem 路徑不改**:`/Users/ethan/` 是 macOS home directory,跟對外稱呼無關,動了會破壞所有絕對路徑。

## 手動驗證
- [ ] `npm run dev` 後檢查:
  - 首頁 Hero 的大標 `I'M DETHANEV.`、紫色 sticker `@dethanev`。
  - Nav 左上角顯示 `D.` + `dethanev/blog`。
  - 關於頁標題 `關於 DETHANEV.`、內文「我是 Dethanev」。
  - Footer 底部 `© 2026 DETHANEV.` 跟巨大水印 `DETHANEV/2026`、Discord handle `@dethanev`。
  - 瀏覽器分頁標題 `dethanev / blog`(子頁變成 `關於 — dethanev/blog`)。
- [ ] favicon 換新:用無痕視窗或直接打 `http://localhost:xxxx/favicon.svg` 看綠底黑 D（一般 reload 會被瀏覽器快取住舊的粉紅 E）。
- [ ] `grep -rni "ethan" src public` 確認剩下的 hit 都是 `Dethanev`/`dethanev`/`DETHANEV` 的子字串,沒有純 `Ethan` 漏掉。
