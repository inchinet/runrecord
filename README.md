# 跑步器 Running Tracker

一個具有 Liquid Glass 介面的跑步紀錄器網頁應用程式  
A web-based running tracker with stunning Liquid Glass UI design

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://inchinet.github.io/runrecord/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ 功能特色 Features

✅ **GPS 追蹤 GPS Tracking** - 高精度 GPS 定位與訊號強度顯示 / High-accuracy GPS positioning with signal strength indicator  
✅ **Google Maps 整合 Google Maps Integration** - 即時路線視覺化 / Real-time route visualization  
✅ **活動類型 Activity Types** - 支援跑步與步行模式 / Support for running and walking modes  
✅ **完整控制 Full Controls** - 開始、暫停、繼續、停止功能 / Start, Pause, Resume, Stop functionality  
✅ **即時統計 Real-time Stats** - 速度、距離、時間即時顯示 / Live speed, distance, and time display  
✅ **資料儲存 Data Storage** - 本地儲存所有活動紀錄 / Local storage for all activity records  
✅ **歷史查詢 History View** - 可篩選一週、一月、一年的紀錄 / Filter records by week, month, or year  
✅ **Excel 匯出 Excel Export** - 將紀錄匯出為 CSV 格式 / Export records to CSV format  
✅ **Liquid Glass UI** - 現代化玻璃擬態設計 / Modern glassmorphism design  

## 🚀 線上使用 Live Demo

直接訪問 Visit: **https://inchinet.github.io/runrecord/**

## 📋 使用前準備 Prerequisites

### 1. Google Maps API 金鑰 Google Maps API Key

1. 前往 Go to [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案 Create a new project or select existing one
3. 啟用 Enable **Maps JavaScript API**
4. 建立 API 金鑰 Create an API key
5. 在 `index.html` 中替換 Replace in `index.html`:

```html
<!-- Line 122 -->
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&callback=initMap" async defer></script>
```

將 `YOUR_API_KEY_HERE` 替換為您的 API 金鑰  
Replace `YOUR_API_KEY_HERE` with your actual API key

### 2. 執行環境需求 Requirements

- **HTTPS 或 localhost** / HTTPS or localhost - 瀏覽器的 Geolocation API 需要安全環境 / Browser Geolocation API requires secure context
- **支援 GPS 的裝置** / GPS-enabled device - 建議使用具有 GPS 功能的行動裝置 / Recommended to use mobile devices with GPS
- **現代瀏覽器** / Modern browser - Chrome, Firefox, Safari, Edge (最新版本 latest versions)

## 💻 本地測試 Local Testing

### 使用 Python Using Python

```bash
cd runrecord
python -m http.server 8000
# 然後在瀏覽器開啟 Then open in browser
# http://localhost:8000
```

### 使用 Node.js Using Node.js

```bash
cd runrecord
npx http-server -p 8000
```

### 使用 PHP Using PHP

```bash
cd runrecord
php -S localhost:8000
```

## 📱 使用方式 How to Use

### 1️⃣ 啟用 GPS Enable GPS
點擊「啟用 GPS」按鈕並允許位置存取權限  
Click "啟用 GPS" button and allow location access permission

### 2️⃣ 選擇活動類型 Select Activity Type
選擇「跑步 🏃」或「步行 🚶」  
Choose "跑步 Running" or "步行 Walking"

### 3️⃣ 開始活動 Start Activity
等待 GPS 定位完成後，點擊「開始」  
Wait for GPS to be ready, then click "開始 Start"

### 4️⃣ 追蹤路線 Track Route
- 地圖會即時顯示您的移動路線 Map shows your route in real-time
- 🟢 綠點 = 起點 Green dot = Start point
- 🔵 藍線 = 路線 Blue line = Route path
- 🔴 紅點 = 終點 Red dot = End point (after stopping)

### 5️⃣ 暫停/繼續 Pause/Resume
可隨時暫停或繼續活動  
Pause or resume your activity anytime

### 6️⃣ 停止活動 Stop Activity
完成後點擊「停止」，系統會自動儲存紀錄  
Click "停止 Stop" when finished, record will be saved automatically

### 7️⃣ 查看歷史 View History
- 在「活動紀錄」區域查看所有過往紀錄 View all past records in "活動紀錄 History" section
- 使用篩選器選擇時間範圍 Use filters to select time range
- 點擊「匯出 Excel」下載 CSV 格式的紀錄 Click "匯出 Excel" to download CSV

## 📁 檔案結構 File Structure

```
runrecord/
├── index.html          # 主要 HTML 結構 Main HTML structure
├── style.css           # Liquid Glass 樣式設計 Liquid Glass styling
├── app.js              # 核心 JavaScript 功能 Core JavaScript functionality
└── README.md           # 說明文件 Documentation
```

## 🎨 技術特點 Technical Highlights

### Liquid Glass 設計 Liquid Glass Design
- 半透明玻璃效果 Semi-transparent glass effects (`backdrop-filter: blur`)
- 動態漸層背景動畫 Animated gradient backgrounds
- 流暢的微互動效果 Smooth micro-interactions
- 響應式設計支援各種裝置 Responsive design for all devices

### GPS 追蹤 GPS Tracking
- 高精度模式 High accuracy mode (`enableHighAccuracy`)
- 即時位置更新 Real-time position updates
- 訊號強度視覺化指示器 Visual signal strength indicator
- 自動地圖居中 Automatic map centering during activity

### 資料儲存 Data Storage
- 使用 localStorage 本地儲存 Uses localStorage for local storage
- JSON 格式資料結構 JSON data format
- 包含路線座標、時間、距離、速度等資訊 Includes route coordinates, time, distance, speed
- 支援匯出為 CSV 格式 CSV export support

### 距離計算 Distance Calculation
- 使用 Haversine 公式 Uses Haversine formula
- 高精度座標追蹤 High-precision coordinate tracking
- 即時累積距離計算 Real-time cumulative distance calculation

## 🌐 瀏覽器相容性 Browser Compatibility

| 瀏覽器 Browser | 版本 Version | 支援度 Support |
|----------------|--------------|----------------|
| Chrome         | 90+          | ✅ 完整支援 Full support |
| Firefox        | 88+          | ✅ 完整支援 Full support |
| Safari         | 14+          | ✅ 完整支援 Full support |
| Edge           | 90+          | ✅ 完整支援 Full support |

## ⚠️ 注意事項 Important Notes

🔒 **隱私權 Privacy**: 所有資料僅儲存在您的裝置上，不會上傳至任何伺服器  
All data is stored only on your device, never uploaded to any server

🔋 **電池消耗 Battery**: GPS 追蹤會消耗較多電量，建議充電時使用  
GPS tracking consumes more battery, recommended to use while charging

🌐 **網路需求 Network**: 需要網路連線以載入 Google Maps  
Internet connection required to load Google Maps

📍 **定位精度 Accuracy**: 室內或高樓密集區域可能影響 GPS 精度  
Indoor or high-rise areas may affect GPS accuracy

## 🔧 疑難排解 Troubleshooting

### GPS 無法定位 GPS Not Working
- ✅ 確認裝置 GPS 已開啟 Ensure device GPS is enabled
- ✅ 確認瀏覽器已授予位置存取權限 Confirm browser has location permission
- ✅ 移動到開闊區域以獲得更好的訊號 Move to open area for better signal
- ✅ 使用 HTTPS 或 localhost Use HTTPS or localhost (not `http://192.168.x.x`)

### 地圖無法顯示 Map Not Showing
- ✅ 檢查 Google Maps API 金鑰是否正確 Check if API key is correct
- ✅ 確認 API 金鑰已啟用 Maps JavaScript API Confirm Maps JavaScript API is enabled
- ✅ 檢查網路連線是否正常 Check internet connection

### 資料無法儲存 Data Not Saving
- ✅ 確認瀏覽器允許 localStorage Ensure browser allows localStorage
- ✅ 檢查是否在無痕模式 Check if in incognito/private mode
- ✅ 清除瀏覽器快取後重試 Clear browser cache and retry

## 🆓 GitHub Pages 託管 GitHub Pages Hosting

此專案使用 GitHub Pages 免費託管  
This project is hosted for free on GitHub Pages

- ✅ **完全免費** Completely free forever (for public repositories)
- ✅ **自動 HTTPS** Automatic HTTPS
- ✅ **無限頻寬** Unlimited bandwidth (with fair use limits)
- ✅ **自動部署** Automatic deployment on code updates

## 📄 授權 License

此專案採用 MIT 授權  
This project is licensed under the MIT License

## 👨‍💻 作者 Author

Created by [inchinet](https://github.com/inchinet)

## 🙏 致謝 Acknowledgments

- Google Maps API for mapping functionality
- Inter font family for typography
- GitHub Pages for free hosting

---

**享受您的跑步！ Enjoy your running! 🏃‍♂️💨**
