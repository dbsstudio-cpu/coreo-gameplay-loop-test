# COREO - 第一階段總架構骨架 (MVP v1)

本專案為 COREO 遊戲 APP 的第一次架構骨架，主要用於 GitHub Pages 線上測試。

## 狀態聲明

- 這不是完整遊戲，這是為後續模組化施工搭建的「骨架」。
- 僅實作：固定 7x7 迷宮渲染、點擊相鄰格移動、LocalStorage 進度保存。
- 尚未實作：連續虛擬操控盤、真實震動、真實音效、複雜追兵邏輯。
- 視覺：嚴格套用 COREO_Visual_Tokens_v1 規範，呈現 Apple/LoveFrom 風格的高級座艙感。

## 檔案架構

```text
gameplay-loop-test/
├── index.html
├── README.md
├── css/
│   └── tokens.css
└── js/
    ├── maze.js
    ├── control.js
    ├── progress.js
    ├── camera.js
    ├── audio.js
    ├── haptics.js
    └── main.js
```

## 模組說明

| 檔案 | 用途 |
|---|---|
| `css/tokens.css` | 色彩、排版與基礎視覺規範 |
| `js/maze.js` | 迷宮資料 |
| `js/control.js` | 點擊與相鄰邏輯判定 |
| `js/progress.js` | localStorage 讀寫 |
| `js/camera.js` | 鏡頭介面，占位 |
| `js/audio.js` | 音效介面，占位 |
| `js/haptics.js` | 觸覺介面，占位 |
| `js/main.js` | 遊戲進入點與渲染 |

## S 自我驗收回報摘要

- GitHub Pages 相容：純 HTML/CSS/JS，無 Node.js、無 import、無 ES modules。
- 完全解耦：JS 檔案各司其職。
- 沒有越界：只做點擊相鄰格與出口完成。
- 進度驗證：抵達出口後更新 localStorage 並 reload 顯示新關卡數字。
- 色彩把控：維持 COREO 深色高級儀表板雛形。
