# Footer 大水印改成置中 Dethanev,favicon 回到粉紅底

## 目標
上一個 commit 把站上 Ethan 文字改成 Dethanev 系列、favicon 換成綠底 D 之後,還有兩個體感問題:

1. Footer 底部巨大水印是 `DETHANEV/2026`,字太長在多數寬度下會橫向溢出被 `overflow: hidden` 切掉,只露出一截;而且新版品牌不需要再帶年份。
2. favicon 綠底跟 Nav 左上角的粉紅 `D.` logo-mark 顏色撞,兩個視覺錨點不一致。

這次只做兩件事:把水印換成單純的 `Dethanev` 並置中、favicon 背景改回原本的粉紅 `#FF5C8A`(字母維持 D)。

## 修改的檔案

### `src/components/Footer.astro`
水印內容跟對齊:
```diff
-<div class="big-mark" aria-hidden="true">DETHANEV/2026</div>
+<div class="big-mark" aria-hidden="true">Dethanev</div>
```

```diff
 .big-mark {
   ...
   pointer-events: none;
   white-space: nowrap;
   overflow: hidden;
+  text-align: center;
 }
```

### `public/favicon.svg`
底色從綠回粉:
```diff
-<rect ... fill="#B8E14A" .../>
+<rect ... fill="#FF5C8A" .../>
```
字母維持 `D`,跟 Nav 的 `D.` logo 同色系。

## 為什麼這樣選
- **拿掉 `/2026`**:年份綁在水印裡每年都要改,且這次的命名統一是「Dethanev」這個名字本身,不是年度標語。
- **首字大寫 `Dethanev` 而非全大寫 `DETHANEV`**:水印是 outline 描邊文字,首字大寫的混合字高比較有節奏,全大寫長條會更容易撞邊。
- **置中靠 `text-align: center`**:`.big-mark` 是 block 元素,寬度撐滿 footer,直接給 `text-align: center` 最簡單,不動其他 box model。
- **favicon 改回粉紅**:跟 Nav 的 `.logo-mark`(`background: var(--accent-1)`)同色,瀏覽器分頁跟頁面內 logo 視覺一致。

## 手動驗證
- [ ] `npm run dev` 開首頁拉到最底:
  - Footer 描邊大字顯示 `Dethanev`,水平置中,寬螢幕兩側留白對稱。
  - 縮窄視窗到 360px 左右,文字不會被切掉、不出現橫向卷軸。
- [ ] favicon:無痕視窗或直接打 `http://localhost:xxxx/favicon.svg`,看到粉紅底 + 黑色 `D`(一般 reload 多半還是快取舊的綠底)。
