// ==================== Global State ====================
let map = null;
let currentPosition = null;
let watchId = null;
let activityState = 'idle'; // idle, running, paused, stopped
let activityType = 'running'; // running, walking
let routeCoordinates = [];
let routePolyline = null;
let startMarker = null;
let endMarker = null;

// Activity tracking data
let activityStartTime = null;
let activityPausedTime = 0;
let activityElapsedTime = 0;
let totalDistance = 0;
let lastPosition = null;

// Timer interval
let timerInterval = null;

// ==================== DOM Elements ====================
const elements = {
    gpsStatus: document.getElementById('gpsStatus'),
    gpsAlert: document.getElementById('gpsAlert'),
    enableGpsBtn: document.getElementById('enableGpsBtn'),
    mapOverlay: document.getElementById('mapOverlay'),

    activityBtns: document.querySelectorAll('.activity-btn'),
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    resumeBtn: document.getElementById('resumeBtn'),
    stopBtn: document.getElementById('stopBtn'),

    speedValue: document.getElementById('speedValue'),
    distanceValue: document.getElementById('distanceValue'),
    timeValue: document.getElementById('timeValue'),

    historyFilter: document.getElementById('historyFilter'),
    exportBtn: document.getElementById('exportBtn'),
    historyList: document.getElementById('historyList')
};

// ==================== Initialize Map ====================
function initMap() {
    // Default center (will be updated when GPS is available)
    const defaultCenter = { lat: 25.0330, lng: 121.5654 }; // Taipei

    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultCenter,
        zoom: 15,
        mapTypeId: 'roadmap',
        styles: [
            {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ saturation: -20 }]
            }
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
    });

    console.log('Map initialized');
}

// ==================== GPS Functions ====================
function requestGPSPermission() {
    if (!navigator.geolocation) {
        alert('您的瀏覽器不支援 GPS 定位功能');
        return;
    }

    elements.gpsAlert.classList.add('hidden');
    elements.mapOverlay.classList.remove('hidden');

    // Request high accuracy position
    navigator.geolocation.getCurrentPosition(
        (position) => {
            handlePositionSuccess(position);
            startGPSWatch();
        },
        handlePositionError,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function handlePositionSuccess(position) {
    currentPosition = position;

    // Update GPS status
    updateGPSStatus(position.coords.accuracy);

    // Center map on current position
    const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    map.setCenter(pos);
    elements.mapOverlay.classList.add('hidden');

    console.log('GPS position acquired:', pos);
}

function handlePositionError(error) {
    console.error('GPS Error:', error);

    let message = '';
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = 'GPS 權限被拒絕，請在瀏覽器設定中允許位置存取';
            break;
        case error.POSITION_UNAVAILABLE:
            message = 'GPS 位置資訊無法取得';
            break;
        case error.TIMEOUT:
            message = 'GPS 定位請求逾時';
            break;
        default:
            message = 'GPS 發生未知錯誤';
    }

    alert(message);
    elements.gpsAlert.classList.remove('hidden');
}

function startGPSWatch() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
    }

    watchId = navigator.geolocation.watchPosition(
        (position) => {
            currentPosition = position;
            updateGPSStatus(position.coords.accuracy);

            // If activity is running, record the position
            if (activityState === 'running') {
                recordPosition(position);
            }
        },
        (error) => {
            console.error('GPS watch error:', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

function updateGPSStatus(accuracy) {
    const statusText = elements.gpsStatus.querySelector('.status-text');
    const signalBars = elements.gpsStatus.querySelectorAll('.signal-bar');

    elements.gpsStatus.classList.add('active');
    statusText.textContent = 'GPS 已啟用';

    // Update signal strength based on accuracy
    // Good: < 10m, Fair: 10-30m, Poor: > 30m
    let strength = 4;
    if (accuracy > 30) strength = 1;
    else if (accuracy > 20) strength = 2;
    else if (accuracy > 10) strength = 3;

    signalBars.forEach((bar, index) => {
        if (index < strength) {
            bar.style.background = 'var(--success)';
        } else {
            bar.style.background = 'rgba(255, 255, 255, 0.3)';
        }
    });
}

// ==================== Activity Tracking ====================
function recordPosition(position) {
    const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: position.timestamp
    };

    routeCoordinates.push(coords);

    // Calculate distance if we have a previous position
    if (lastPosition) {
        const distance = calculateDistance(
            lastPosition.coords.latitude,
            lastPosition.coords.longitude,
            position.coords.latitude,
            position.coords.longitude
        );

        totalDistance += distance;
        updateStats();
    }

    lastPosition = position;

    // Auto-center map on current position during active run
    if (activityState === 'running' && map) {
        map.panTo({ lat: coords.lat, lng: coords.lng });
    }

    // Update route on map
    updateRouteOnMap();
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

function toRad(degrees) {
    return degrees * Math.PI / 180;
}

function updateRouteOnMap() {
    if (!map || routeCoordinates.length === 0) return;

    // Remove old polyline
    if (routePolyline) {
        routePolyline.setMap(null);
    }

    // Create new polyline
    const path = routeCoordinates.map(coord => ({ lat: coord.lat, lng: coord.lng }));

    routePolyline = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.8,
        strokeWeight: 4
    });

    routePolyline.setMap(map);

    // Add start marker
    if (!startMarker && routeCoordinates.length > 0) {
        startMarker = new google.maps.Marker({
            position: { lat: routeCoordinates[0].lat, lng: routeCoordinates[0].lng },
            map: map,
            title: '起點',
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#10b981',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            }
        });
    }
}

function updateStats() {
    // Calculate elapsed time
    if (activityStartTime) {
        const now = Date.now();
        activityElapsedTime = Math.floor((now - activityStartTime - activityPausedTime) / 1000);
    }

    // Calculate speed (km/h)
    const speed = activityElapsedTime > 0 ? (totalDistance / activityElapsedTime) * 3600 : 0;

    // Update UI
    elements.speedValue.textContent = speed.toFixed(1);
    elements.distanceValue.textContent = totalDistance.toFixed(2);
    elements.timeValue.textContent = formatTime(activityElapsedTime);
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        updateStats();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// ==================== Activity Controls ====================
function startActivity() {
    if (!currentPosition) {
        alert('請等待 GPS 定位完成');
        return;
    }

    activityState = 'running';
    activityStartTime = Date.now();
    routeCoordinates = [];
    totalDistance = 0;
    lastPosition = null;
    activityPausedTime = 0;
    activityElapsedTime = 0;

    // Clear previous route
    if (routePolyline) {
        routePolyline.setMap(null);
        routePolyline = null;
    }
    if (startMarker) {
        startMarker.setMap(null);
        startMarker = null;
    }
    if (endMarker) {
        endMarker.setMap(null);
        endMarker = null;
    }

    // Update UI
    elements.startBtn.classList.add('hidden');
    elements.pauseBtn.classList.remove('hidden');
    elements.stopBtn.classList.remove('hidden');

    // Disable activity type selection
    elements.activityBtns.forEach(btn => btn.disabled = true);

    // Start timer
    startTimer();

    console.log('Activity started:', activityType);
}

function pauseActivity() {
    if (activityState !== 'running') return;

    activityState = 'paused';
    const pauseTime = Date.now();

    // Update UI
    elements.pauseBtn.classList.add('hidden');
    elements.resumeBtn.classList.remove('hidden');

    // Stop timer
    stopTimer();

    // Store pause start time
    window.pauseStartTime = pauseTime;

    console.log('Activity paused');
}

function resumeActivity() {
    if (activityState !== 'paused') return;

    activityState = 'running';

    // Calculate paused duration
    const pauseDuration = Date.now() - window.pauseStartTime;
    activityPausedTime += pauseDuration;

    // Update UI
    elements.resumeBtn.classList.add('hidden');
    elements.pauseBtn.classList.remove('hidden');

    // Restart timer
    startTimer();

    console.log('Activity resumed');
}

function stopActivity() {
    if (activityState === 'idle') return;

    activityState = 'stopped';

    // Stop timer
    stopTimer();

    // Add end marker
    if (routeCoordinates.length > 0) {
        const lastCoord = routeCoordinates[routeCoordinates.length - 1];
        endMarker = new google.maps.Marker({
            position: { lat: lastCoord.lat, lng: lastCoord.lng },
            map: map,
            title: '終點',
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#ef4444',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            }
        });
    }

    // Save activity
    saveActivity();

    // Reset UI
    elements.pauseBtn.classList.add('hidden');
    elements.resumeBtn.classList.add('hidden');
    elements.stopBtn.classList.add('hidden');
    elements.startBtn.classList.remove('hidden');

    // Enable activity type selection
    elements.activityBtns.forEach(btn => btn.disabled = false);

    // Reset state
    activityState = 'idle';

    console.log('Activity stopped');
}

// ==================== Data Storage ====================
function saveActivity() {
    const activity = {
        id: Date.now(),
        type: activityType,
        date: new Date().toISOString(),
        duration: activityElapsedTime,
        distance: totalDistance,
        averageSpeed: activityElapsedTime > 0 ? (totalDistance / activityElapsedTime) * 3600 : 0,
        route: routeCoordinates
    };

    // Get existing activities
    const activities = getActivities();
    activities.push(activity);

    // Save to localStorage
    localStorage.setItem('runningActivities', JSON.stringify(activities));

    // Refresh history
    displayHistory();

    console.log('Activity saved:', activity);
}

function getActivities() {
    const data = localStorage.getItem('runningActivities');
    return data ? JSON.parse(data) : [];
}

function displayHistory(filter = 'all') {
    const activities = getActivities();

    if (activities.length === 0) {
        elements.historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <p>尚無活動紀錄</p>
                <p class="empty-hint">開始您的第一次跑步吧！</p>
            </div>
        `;
        return;
    }

    // Filter activities
    const now = Date.now();
    const filtered = activities.filter(activity => {
        const activityDate = new Date(activity.date).getTime();
        const daysDiff = (now - activityDate) / (1000 * 60 * 60 * 24);

        switch (filter) {
            case 'week': return daysDiff <= 7;
            case 'month': return daysDiff <= 30;
            case 'year': return daysDiff <= 365;
            default: return true;
        }
    });

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Limit to recent 10 records for display
    const displayItems = filtered.slice(0, 10);

    // Generate HTML
    const html = displayItems.map(activity => {
        const date = new Date(activity.date);
        const icon = activity.type === 'running' ? '🏃' : '🚶';
        const typeText = activity.type === 'running' ? '跑步' : '步行';

        return `
            <div class="history-item">
                <div class="history-item-left">
                    <div class="history-item-icon">${icon}</div>
                    <div class="history-item-info">
                        <h3>${typeText}</h3>
                        <div class="history-item-date">${formatDate(date)}</div>
                    </div>
                </div>
                <div class="history-item-stats">
                    <div>
                        <div class="history-stat-value">${activity.distance.toFixed(2)} km</div>
                        <div class="history-stat-label">距離</div>
                    </div>
                    <div>
                        <div class="history-stat-value">${activity.averageSpeed.toFixed(1)} km/h</div>
                        <div class="history-stat-label">平均速度</div>
                    </div>
                    <div>
                        <div class="history-stat-value">${formatTime(activity.duration)}</div>
                        <div class="history-stat-label">時間</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    elements.historyList.innerHTML = html;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// ==================== Export to Excel ====================
function exportToExcel() {
    const activities = getActivities();

    if (activities.length === 0) {
        alert('沒有可匯出的紀錄');
        return;
    }

    // Get current filter value
    const filter = elements.historyFilter.value;

    // Filter activities based on the current filter selection
    const now = Date.now();
    const filtered = activities.filter(activity => {
        const activityDate = new Date(activity.date).getTime();
        const daysDiff = (now - activityDate) / (1000 * 60 * 60 * 24);

        switch (filter) {
            case 'week': return daysDiff <= 7;
            case 'month': return daysDiff <= 30;
            case 'year': return daysDiff <= 365;
            default: return true;
        }
    });

    if (filtered.length === 0) {
        alert('目前篩選條件下沒有可匯出的紀錄');
        return;
    }

    // Sort by date (newest first) to match history display
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create CSV content
    let csv = '日期,類型,距離(km),平均速度(km/h),時間,時長(秒)\n';

    filtered.forEach(activity => {
        const date = formatDate(new Date(activity.date));
        const type = activity.type === 'running' ? '跑步' : '步行';
        const distance = activity.distance.toFixed(2);
        const speed = activity.averageSpeed.toFixed(1);
        const time = formatTime(activity.duration);
        const duration = activity.duration;

        csv += `${date},${type},${distance},${speed},${time},${duration}\n`;
    });

    // Create download link
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `running_records_${Date.now()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('Export completed');
}

// ==================== Event Listeners ====================
elements.enableGpsBtn.addEventListener('click', requestGPSPermission);

elements.activityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (activityState !== 'idle') return;

        elements.activityBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activityType = btn.dataset.activity;
    });
});

elements.startBtn.addEventListener('click', startActivity);
elements.pauseBtn.addEventListener('click', pauseActivity);
elements.resumeBtn.addEventListener('click', resumeActivity);
elements.stopBtn.addEventListener('click', stopActivity);

elements.historyFilter.addEventListener('change', (e) => {
    displayHistory(e.target.value);
});

elements.exportBtn.addEventListener('click', exportToExcel);

// ==================== Initialize ====================
window.addEventListener('load', () => {
    // Check if GPS is available
    if (!navigator.geolocation) {
        alert('您的瀏覽器不支援 GPS 定位功能');
        return;
    }

    // Display history
    displayHistory();

    console.log('Application initialized');
});

// Make initMap available globally for Google Maps callback
window.initMap = initMap;
