# Hero 名牌不再露出粉紅,Nav 拿掉英文副標

## 目標
這次 commit 解決兩件事:

1. 首頁 Hero 大字裡的 `<em>DETHANEV</em>` 粉紅名牌,旋轉之後底色會從黑邊框外緣漏出來,看起來像有條粉紅細線繞著卡片。原因是 `border` + `box-shadow` 兩個獨立屬性,旋轉後次像素抗鋸齒讓背景色從邊框與陰影中間隙縫透出。
2. Nav 原本每個連結同時顯示中文 + 英文 (例如「首頁 / home」),這次決定只留中文,讓連結列簡潔一些。

## 修改的檔案

### `src/components/Hero.astro`
把名牌的「黑邊框 + 偏移陰影」改寫成一條 `box-shadow` 裡疊兩層:第一層用 spread 模擬邊框、第二層才是真正的偏移陰影。沒有 `border` 之後就不會有旋轉造成的邊緣破綻。
```diff
 .hero-title em {
   ...
-  padding: 0 0.1em;
+  padding: 0.12em 0.15em 0.08em;
+  line-height: 1;
   ...
-  border: 4px solid var(--ink);
-  box-shadow: 6px 6px 0 0 var(--ink);
+  border: none;
+  box-shadow:
+    0 0 0 4px var(--ink),
+    10px 10px 0 0 var(--ink);
 }
 :global(.dark) .hero-title em {
-  box-shadow: 6px 6px 0 0 var(--accent-2);
+  box-shadow:
+    0 0 0 4px var(--ink),
+    10px 10px 0 0 var(--accent-2);
 }
```

padding/line-height 一起改,是因為原本 `padding: 0` + 繼承的 `line-height: 0.92` 讓字本身會凸出卡片上下緣;順著這次改動補回。

### `src/components/Nav.astro`
連結拿掉英文副標 `en` 欄位,連同 `<span class="zh">` 包裝一起簡化:
```diff
 const links = [
-  { href: "/", label: "首頁", en: "home" },
-  { href: "/blog", label: "文章", en: "blog" },
-  { href: "/about", label: "關於", en: "about" },
-  { href: "/now", label: "近況", en: "now" },
+  { href: "/", label: "首頁"},
+  { href: "/blog", label: "文章"},
+  { href: "/about", label: "關於"},
+  { href: "/now", label: "近況"},
 ];
```
```diff
-<span class="logo-text">dethanev/blog</span>
+<span class="logo-text">Dethanev/blog</span>
```
```diff
-<span class="zh">{l.label}</span>
+{l.label}
```

CSS 也順手清掉死碼:`.link .en` 跟 `@media` 內的 `.link .en { display: none }` 都刪除;`.link` 從 `inline-flex + align-items: baseline + gap: 0.35rem` 簡化成 `inline-block`(那些屬性原本是為了讓中文跟英文兩個 span 對齊用的,現在不需要了)。

## 為什麼這樣選
- **疊兩層 `box-shadow` 取代 `border + box-shadow`**:單一屬性內的多層陰影是同一個 paint pass,沒有兩個獨立元素的次像素抗鋸齒問題,旋轉後也不會有縫隙漏色。`0 0 0 4px` 的 spread 模擬出 4px 寬的環,視覺等效於原本的 4px border。
- **第二層偏移從 6px 改成 10px**:原本邊框 4px + 陰影偏移 6px,從邊框外緣往外看見的陰影是 6px。新做法沒有實體邊框,要讓陰影看起來「離卡片外緣 6px」,就得從卡片本體偏移 4(模擬邊框)+ 6 = 10px。
- **logo 改大寫 D**:跟其他位置(Footer 水印 `Dethanev`、about 頁標題 `DETHANEV.`)的首字大寫風格對齊。
- **Nav 連結純中文**:中英並列雖然好看,但連結用途是導航,中文已足夠;移掉後手機版也少擠一行。

## 手動驗證
- [ ] `npm run dev` 開首頁:
  - Hero 大字 `I'M DETHANEV.` 的粉紅名牌,旋轉後四個邊都被黑色 ring 完整包住,黑色陰影偏移仍然像原本一樣往右下露出。
  - 字母不會凸出粉紅卡片(尤其 D / V 的上下緣)。
  - 切換深淺主題,深色模式下偏移陰影變黃色 `var(--accent-2)`,ring 維持黑色。
- [ ] Nav 列:
  - 桌機/手機都只顯示中文「首頁 / 文章 / 關於 / 近況」,沒有英文小字。
  - 點 active 那個連結背景變粉紅(深色變黃),hover 變黃色框 + 位移。
  - logo 顯示 `D. Dethanev/blog`(手機 < 720px 時只顯示 `D.`)。
