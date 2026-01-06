# Deployment Guide - Running Tracker to Private Server

## Deployment Location
`https://inter-net.no-ip.com/runrecord/`

---

## Files to Upload

Upload the following files to your server in the `/runrecord` folder:

```
/runrecord/
├── index.html          (rename from index.production.html)
├── style.css
├── app.js
└── readme.txt          (optional)
```

---

## Step-by-Step Deployment Instructions

### Step 1: Prepare Files Locally

1. **Rename the production file:**
   - Rename `index.production.html` → `index.html`
   - This version contains your actual Google Maps API key

2. **Files to upload:**
   - `index.html` (the renamed production version)
   - `style.css`
   - `app.js`
   - `readme.txt` (optional)

### Step 2: Upload to Server

**Option A: Using FTP/SFTP Client (FileZilla, WinSCP, etc.)**

1. Connect to your server at `inter-net.no-ip.com`
2. Navigate to your web root directory (usually `/var/www/html/` or `/public_html/`)
3. Create a folder named `runrecord`
4. Upload all 3-4 files into the `/runrecord/` folder

**Option B: Using Command Line (SSH)**

```bash
# SSH into your server
ssh user@inter-net.no-ip.com

# Navigate to web root
cd /var/www/html/

# Create runrecord directory
mkdir -p runrecord

# Upload files (from your local machine)
scp index.production.html user@inter-net.no-ip.com:/var/www/html/runrecord/index.html
scp style.css user@inter-net.no-ip.com:/var/www/html/runrecord/
scp app.js user@inter-net.no-ip.com:/var/www/html/runrecord/
```

**Option C: Using Web Hosting Control Panel (cPanel, Plesk, etc.)**

1. Log into your hosting control panel
2. Open File Manager
3. Navigate to `public_html` or web root
4. Create a new folder: `runrecord`
5. Upload the files into this folder

### Step 3: Set Permissions (if needed)

```bash
# Make sure files are readable
chmod 644 /var/www/html/runrecord/*
chmod 755 /var/www/html/runrecord/
```

### Step 4: Verify Deployment

1. Open your browser
2. Navigate to: `https://inter-net.no-ip.com/runrecord/`
3. The running tracker should load
4. Click "啟用 GPS" to test GPS functionality
5. Verify the map loads correctly

---

## Security Recommendations

### 1. Restrict API Key by Domain

In Google Cloud Console:
1. Go to [API Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your API key
3. Under "Application restrictions" → Select "HTTP referrers"
4. Add: `https://inter-net.no-ip.com/*`
5. Save

This ensures your API key only works on your domain.

### 2. Keep Production File Secure

- **DO NOT** commit `index.production.html` to GitHub
- Keep it only on your local machine and server
- Add it to `.gitignore`

---

## File Structure on Server

```
/var/www/html/                    (or your web root)
├── index.html                    (your main site)
├── (other main site files)
└── runrecord/                    ← NEW FOLDER
    ├── index.html                (running tracker - with API key)
    ├── style.css
    ├── app.js
    └── readme.txt
```

---

## Troubleshooting

### Map doesn't load
- Check browser console for errors
- Verify API key is correct in `index.html`
- Ensure Maps JavaScript API is enabled in Google Cloud Console

### GPS not working
- Ensure you're accessing via HTTPS (not HTTP)
- Check browser permissions for location access
- Test on a GPS-enabled device

### 404 Error
- Verify the `/runrecord/` folder exists on your server
- Check file permissions (should be readable)
- Ensure `index.html` exists in the folder

---

## Quick Upload Checklist

- [ ] Create `/runrecord/` folder on server
- [ ] Rename `index.production.html` to `index.html`
- [ ] Upload `index.html` to `/runrecord/`
- [ ] Upload `style.css` to `/runrecord/`
- [ ] Upload `app.js` to `/runrecord/`
- [ ] Test at `https://inter-net.no-ip.com/runrecord/`
- [ ] Verify GPS and map functionality
- [ ] Restrict API key to your domain in Google Cloud Console
