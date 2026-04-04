// 1. URL'den gelen senderId'yi yakala (Dinamik kimlik kartı)
const urlParams = new URLSearchParams(location.search);
const dynamicSenderId = urlParams.get('senderId');

// Firebase Kütüphaneleri (Compat versiyonu SW için daha stabildir)
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

if (dynamicSenderId) {
    // 2. Sadece Sender ID ile Firebase'i uyandır
    firebase.initializeApp({
        messagingSenderId: dynamicSenderId
    });

    const messaging = firebase.messaging();

    // Arka planda mesaj geldiğinde çalışacak kısım
    messaging.onBackgroundMessage((payload) => {
        console.log('Arka plan bildirimi:', payload);
        
        const notificationTitle = payload.notification.title || "CGA GÜVENLİK SİSTEMİ";
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/icon.png', // Varsa logonun yolu
            badge: '/icon.png',
            vibrate: [200, 100, 200] // Telefonu titret
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    });
}