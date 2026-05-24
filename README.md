# 加入 Google Search Console 驗證檔

## 目標
Google Search Console 要驗證 `dethanev.app` 的所有權,給了一個 HTML token 檔案。需要把它放在站台根目錄,讓 Google 可以從 `https://www.dethanev.app/google9ec9104ca78a0574.html` 抓到並驗證。

## 修改的檔案

### `public/google9ec9104ca78a0574.html` (新增)
Astro 會把 `public/` 底下的檔案原封不動 copy 到 build 後的根目錄,所以放這就會在站台 root 被訪問到。

內容只有 Google 指定的一行:
```
google-site-verification: google9ec9104ca78a0574.html
```

## 為什麼這樣選
- **走 HTML 檔驗證、不走 meta tag**:不用動 `BaseLayout.astro`,token 跟業務邏輯隔離,之後要移除也只是刪一個檔。
- **檔名一字不動**:Google 是用檔名本身當 token 比對,改名就驗不過。

## 手動驗證
- [ ] push 上去,等 Vercel 部署完。
- [ ] 瀏覽器打開 `https://www.dethanev.app/google9ec9104ca78a0574.html`,應該看到 `google-site-verification: google9ec9104ca78a0574.html` 這一行純文字。
- [ ] 回 Google Search Console 按「驗證」,應該通過。
