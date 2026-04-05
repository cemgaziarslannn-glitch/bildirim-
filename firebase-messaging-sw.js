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
  appId: "1:512943111807:web:675c769c7ede48216e494a"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ARKA PLAN YÖNETİMİ - İKİNCİ BİLDİRİMİ ENGELLEMEK İÇİN
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Sinyal yakalandı:', payload);
    
    // Eğer fırlatıcıda 'notification' varsa tarayıcı zaten otomatik gösterir.
    // Biz burada sadece veriyi (URL) kontrol ediyoruz.
    const notificationTitle = payload.notification?.title || "🛡️ KOLART ONLİNE DENETİM";
    const notificationOptions = {
        body: payload.notification?.body || "Yeni Olay var... Detaylar için dokunun.",
        icon: 'https://cemgaziarslannn-glitch.github.io/favicon.ico',
        badge: 'https://cemgaziarslannn-glitch.github.io/favicon.ico',
        vibrate: [200, 100, 200, 100, 200],
        tag: payload.notification?.tag || 'kolart-bildirim',
        renotify: true,
        data: { 
            // Linki hem 'data'dan hem de 'fcmOptions'dan kovalıyoruz
            url: payload.data?.url || payload.fcmOptions?.link || 'https://www.denetim.online' 
        }
    };

    // Tarayıcının otomatik göstermesini bekle, eğer göstermezse biz basıyoruz
    if (!payload.notification) {
        return self.registration.showNotification(notificationTitle, notificationOptions);
    }
});

// BİLDİRİME TIKLANDIĞINDA TETİKLENEN OLAY
self.addEventListener('notificationclick', (event) => {
    console.log('[sw.js] Bildirime tıklandı.');
    event.notification.close(); // Bildirimi kapat
    
    // Gidilecek URL'yi güvenli bir şekilde al
    let targetUrl = 'https://www.denetim.online';
    if (event.notification.data && event.notification.data.url) {
        targetUrl = event.notification.data.url;
    }
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Eğer site zaten açıksa onu öne getir (Focus)
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                // Link kontrolü yaparken ana domaine bakıyoruz
                if (client.url.includes('denetim.online') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Site açık değilse yeni pencerede/PWA modunda aç
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
