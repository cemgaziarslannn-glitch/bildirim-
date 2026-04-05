importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// MERKEZ PROJE BİLGİLERİ
const firebaseConfig = {
  apiKey: "AIzaSyDCJWz80wWlzNhaM2Qnw_e5UkQoc8DoJaU",
  authDomain: "merkez-14bf8.firebaseapp.com",
  databaseURL: "https://merkez-14bf8-default-rtdb.firebaseio.com",
  projectId: "merkez-14bf8",
  storageBucket: "merkez-14bf8.firebasestorage.app",
  messagingSenderId: "512943111807",
  appId: "1:512943111807:web:675c769c7ede48216e494a",
  measurementId: "G-BYS8FPKY7H"
};

// Firebase'i başlat
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Arka plan bildirim yönetimi
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Arka plan bildirimi:', payload);
    
    const notificationTitle = payload.notification?.title || "CGA GÜVENLİK SİSTEMİ";
    const notificationOptions = {
        body: payload.notification?.body || "Yeni bir olay raporlandı.",
        icon: 'https://cemgaziarslannn-glitch.github.io/favicon.ico',
        badge: 'https://cemgaziarslannn-glitch.github.io/favicon.ico',
        vibrate: [200, 100, 200],
        data: { url: payload.fcmOptions?.link || '/' }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Bildirime tıklandığında siteyi aç
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
});
