// --- MERKEZİ SİSTEM AYARLARI ---
const MERKEZ_SENDER_ID = "512943111807";
const MERKEZ_VAPID_KEY = "BMK1Y0cuslskfRCbVPzD0FZ0PBEAGuS3BqhNKHrs0Ylr9cYPYxo-PZ6C5Piph4Mg6g1jrF4cBGUCrWeKHzM7TOU";

document.getElementById("btnEnableNotifications").onclick = async () => {
    const btn = document.getElementById("btnEnableNotifications");
    btn.innerText = "BEKLEYİN...";

    try {
        // Mevcut app üzerinden değil, MERKEZ üzerinden mesajlaşmayı başlat
        const currentMessaging = getMessaging(app); 

        // Service Worker'ı MERKEZ kimliğiyle kaydet
        const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
        
        const permission = await Notification.requestPermission();
        
        if (permission === "granted") {
            // Token'ı MERKEZ'den al
            const token = await getToken(currentMessaging, { 
                vapidKey: MERKEZ_VAPID_KEY,
                serviceWorkerRegistration: registration 
            });

            if (token) {
                // Token'ı kullanıcı kaydına ekle
                await update(ref(db, `users/${currentUser}`), {
                    fcmToken: token,
                    notificationsEnabled: true
                });

                btn.style.background = "var(--neon-green)";
                btn.innerText = "BİLDİRİMLER AÇIK";
                btn.disabled = true;
                alert("SİSTEM AKTİF: Artık Merkez üzerinden bildirim alacaksınız!");
                console.log("Yeni Uyumlu Token:", token);
            }
        } else {
            btn.innerText = "İZİN REDDEDİLDİ";
        }
    } catch (error) {
        console.error("Token Hatası:", error);
        btn.innerText = "HATA!";
        alert("KRİTİK HATA: " + error.message);
    }
};
