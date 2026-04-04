// 1. URL'den gelen senderId'yi yakala
const urlParams = new URLSearchParams(location.search);
const dynamicSenderId = urlParams.get('senderId');

// 2. Kütüphaneleri en güncel ve stabil yoldan çek
importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js');

// 3. Kontrol ve Başlatma
if (dynamicSenderId) {
    try {
        firebase.initializeApp({
            messagingSenderId: dynamicSenderId
        });

        const messaging = firebase.messaging();

        messaging.onBackgroundMessage((payload) => {
            console.log('Arka plan mesajı:', payload);
            
            const title = payload.notification.title || "CGA GÜVENLİK SİSTEMİ";
            const options = {
                body: payload.notification.body,
                icon: './icon-192.png', // Buradaki yolu kendi logona göre düzelt
                badge: './icon-192.png',
                vibrate: [200, 100, 200]
            };

            self.registration.showNotification(title, options);
        });
    } catch (err) {
        console.error("SW Initialize Hatası:", err);
    }
}
