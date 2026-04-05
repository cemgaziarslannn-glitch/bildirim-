importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// MERKEZ PROJE BİLGİLERİ (Burası Dokunulmaz)
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

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ARKA PLAN BİLDİRİM YÖNETİMİ
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Bildirim yakalandı:', payload);
    
    // Fırlatıcıdan gelen verileri çekiyoruz
    const notificationTitle = payload.notification?.title || "🛡️ KOLART ONLİNE DENETİM";
    const notificationOptions = {
        body: payload.notification?.body || "Yeni Olay var... Detaylar için dokunun.",
        icon: 'https://cemgaziarslannn-glitch.github.io/favicon.ico',
        badge: 'https://cemgaziarslannn-glitch.github.io/favicon.ico',
        vibrate: [200, 100, 200, 100, 200],
        tag: payload.notification?.tag || 'kolart-bildirim',
        renotify: true,
        data: { 
            // Eğer fırlatıcıdan URL gelmezse varsayılan olarak ana siteye gitsin
            url: payload.data?.url || 'https://www.denetim.online' 
        }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// BİLDİRİME TIKLANDIĞINDA TETİKLENEN OLAY
self.addEventListener('notificationclick', (event) => {
    console.log('[sw.js] Bildirime tıklandı.');
    event.notification.close(); // Bildirimi kapat
    
    // Gidilecek URL'yi alıyoruz (index.js'den gelen url)
    const targetUrl = event.notification.data.url;
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Eğer site zaten açıksa onu öne getir
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            // Site açık değilse yeni sekmede/pencerede aç
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
