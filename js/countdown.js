/**
 * إدارة وتحديث العداد الزمني التنازلي التلقائي لليلة الفرح
 */
const weddingDate = new Date("july 12, 2026 20:00:00").getTime();

const cdInterval = setInterval(() => {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("cd-days").innerText = String(days).padStart(2, '0');
    document.getElementById("cd-hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("cd-minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("cd-seconds").innerText = String(seconds).padStart(2, '0');

    if (diff < 0) {
        clearInterval(cdInterval);
        document.getElementById("countdown-section").innerHTML = `<h2 class="font-reem text-2xl text-gold-400">بدأ الحفل الآن! مبارك للعروسين.</h2>`;
    }
}, 1000);