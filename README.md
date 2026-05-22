# 用 giscus 取代公開 email 作為留言/聯絡管道

## 目標
- 把所有公開頁面上的 Gmail 拿掉,避免個資外流。
- 改用 GitHub Discussions 作為唯一公開回饋管道。
- 在每篇文章底部嵌入 giscus 留言區,讀者不用離開頁面就能留言。

## 主要變更

### 新增 `src/components/Comments.astro`
giscus 嵌入元件,做了三件事:
1. 依 `document.documentElement.classList` 是否含 `dark` 自動帶入主題。
2. 監聽 `html` 的 `class` 變化,主題切換時 `postMessage` 同步給 giscus iframe。
3. 監聽 `astro:after-swap`(View Transition 切頁),重新掛載 giscus script,避免換文章後留言區消失。

未填 ID 時會顯示橘色提示框,不會讓頁面壞掉:

```astro
const repo = "<OWNER/REPO>";
const repoId = "<REPO_ID>";
const category = "<CATEGORY_NAME>";
const categoryId = "<CATEGORY_ID>";
```

### `src/layouts/PostLayout.astro`
匯入並掛上 `<Comments />`,放在 `<ClapButton />` 與 `post-nav` 之間。

### `src/components/Footer.astro`
Footer 聯絡清單中的 Email 列換成 Discussions:

```ts
{ label: "Discussions", href: "https://github.com/Dethanev/Blog/discussions", handle: "Dethanev/Blog" },
```

### `src/pages/about.astro`
「how to reach」段落從 `mailto:` 改為 GitHub Discussions 連結。

## 手動驗證
- [ ] `npx astro build` 通過(已確認)。
- [ ] 全 repo `grep -iE "gmail|mailto:|ethan\.dev66"` 在 `src/` 與 `public/` 下找不到結果(已確認)。
- [ ] 跑 `npm run dev`,打開任一篇文章,確認:
  - 底部出現「留言區尚未設定 giscus」橘色提示框。
  - 切換深淺主題時頁面其餘部分正常。
- [ ] 在 giscus.app 拿到 4 個 ID 填入 `Comments.astro` 後,提示框換成真實留言區,且主題切換時 giscus 也跟著切。
- [ ] Footer 與 `/about` 不再看到 email。
