/**
 * إدارة المنطق العام والمشهد الافتتاحي وتفاعلات الفيديو والموسيقى بدون ستارة
 */

document.addEventListener("DOMContentLoaded", () => {
    runDirectHeroCinematic();
});

// تشغيل تحريك العناصر في الـ Hero Section فوراً بفخامة
function runDirectHeroCinematic() {
    const tl = gsap.timeline();
    
    tl.from("#hero-badge", { opacity: 0, scale: 0.9, duration: 0.8, ease: "power2.out" })
      .from("#groom-avatar", { x: window.innerWidth > 640 ? 40 : 0, y: window.innerWidth > 640 ? 0 : 20, opacity: 0, duration: 1, ease: "back.out(1.5)" }, "-=0.4")
      .from("#bride-avatar", { x: window.innerWidth > 640 ? -40 : 0, y: window.innerWidth > 640 ? 0 : 20, opacity: 0, duration: 1, ease: "back.out(1.5)" }, "<")
      .from("#couple-names", { scale: 0.85, opacity: 0, duration: 1.2, ease: "elastic.out(1, 0.6)" }, "-=0.5")
      .from("#hero-desc", { opacity: 0, y: 15, duration: 0.8 }, "-=0.6");
}

// التبديل بين فيديوهات الذكريات المخصصة داخل الإطار الذهبي
function changeVideo(videoSrc, buttonElement) {
    const video = document.getElementById("main-wedding-video");
    const source = document.getElementById("video-source");
    const poster = document.getElementById("video-poster");

    video.pause();
    source.src = videoSrc;
    video.load();

    poster.style.opacity = "0";
    poster.style.pointerEvents = "none";
    video.classList.remove("hidden");
    video.play();
    video.controls = true;

    document.querySelectorAll(".playlist-btn").forEach(btn => btn.classList.remove("active-playlist-btn"));
    buttonElement.classList.add("active-playlist-btn");
}

document.getElementById("video-play-btn").addEventListener("click", function() {
    const video = document.getElementById("main-wedding-video");
    const poster = document.getElementById("video-poster");
    
    poster.style.opacity = "0";
    poster.style.pointerEvents = "none";
    video.classList.remove("hidden");
    video.play();
    video.controls = true;
});

// التحكم بفتح المظاريف والرسائل
function toggleLetter(envelopeElement) {
    envelopeElement.classList.toggle("open");
}

// التحكم الصوتي للموسيقى المحيطية العائمة
const audioTrack = document.getElementById("wedding-audio-track");
const playPauseBtn = document.getElementById("music-play-pause-btn");
const playlistSelector = document.getElementById("playlist-selector");
const trackTitle = document.getElementById("player-track-title");

const playlist = [
    {
        src: "media/sound/sound1.mpeg",
        title: "اللحن الرومانسي الملكي"
    },
    {
        src: "media/sound/sound2.mpeg",
        title: "موسيقى هادئة كلاسيك"
    },
    {
        src: "media/sound/sound3.mpeg",
        title: "زفة الفرح والبهجة"
    }
];

let currentTrack = 0;

// تشغيل / إيقاف
function toggleAudio() {
    if (audioTrack.paused) {
        audioTrack.play().catch(() => {
            console.log("المتصفح يحتاج تفاعل المستخدم أولاً");
        });

        playPauseBtn.innerHTML =
            '<i class="fa-solid fa-pause"></i>';

        playPauseBtn.classList.add("bg-amber-600");

    } else {

        audioTrack.pause();

        playPauseBtn.innerHTML =
            '<i class="fa-solid fa-music"></i>';

        playPauseBtn.classList.remove("bg-amber-600");
    }
}

// مستوى الصوت
function changeVolume(val) {
    audioTrack.volume = val;
}

// تحميل أغنية
function loadTrack(index, autoplay = true) {

    currentTrack = index;

    audioTrack.src = playlist[index].src;

    playlistSelector.value = playlist[index].src;

    if (trackTitle) {
        trackTitle.textContent = playlist[index].title;
    }

    audioTrack.load();

    if (autoplay) {
        audioTrack.play().catch(() => {});
    }

    playPauseBtn.innerHTML =
        '<i class="fa-solid fa-pause"></i>';

    playPauseBtn.classList.add("bg-amber-600");
}

// تغيير الأغنية من القائمة
function switchTrack(src) {

    const index = playlist.findIndex(
        track => track.src === src
    );

    if (index !== -1) {
        loadTrack(index);
    }
}

// الأغنية التالية
function nextTrack() {

    currentTrack++;

    if (currentTrack >= playlist.length) {
        currentTrack = 0;
    }

    loadTrack(currentTrack);
}

// الأغنية السابقة
function previousTrack() {

    currentTrack--;

    if (currentTrack < 0) {
        currentTrack = playlist.length - 1;
    }

    loadTrack(currentTrack);
}

// عند انتهاء الأغنية شغل التالية تلقائياً
audioTrack.addEventListener("ended", nextTrack);

// تحديد الأغنية الحالية عند بدء الصفحة
const currentSrc = audioTrack.querySelector("source")?.getAttribute("src");

const initialIndex = playlist.findIndex(
    track => track.src === currentSrc
);

if (initialIndex !== -1) {
    currentTrack = initialIndex;

    if (trackTitle) {
        trackTitle.textContent =
            playlist[currentTrack].title;
    }
}

// محرك لوحة الألعاب النارية والورود في نهاية الصفحة
const canvas = document.getElementById("finale-canvas");
const ctx = canvas.getContext("2d");
let animId, particles = [], flowers = [];

function resizeCanvas() {
    if(canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class P {
    constructor(x,y,c) {
        this.x = x; this.y = y; this.c = c; this.r = Math.random()*2+1;
        const a = Math.random()*Math.PI*2, s = Math.random()*3+1;
        this.vx = Math.cos(a)*s; this.vy = Math.sin(a)*s; this.al = 1;
    }
    draw() {
        ctx.save(); ctx.globalAlpha = this.al; ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fillStyle = this.c; ctx.fill(); ctx.restore();
    }
    update() { this.x += this.vx; this.y += this.vy; this.vy += 0.04; this.al -= 0.02; }
}
class Fl {
    constructor() { this.x = Math.random()*canvas.width; this.y = -10; this.r = Math.random()*3+2; this.s = Math.random()*1+0.8; }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fillStyle = "rgba(244,63,94,0.5)"; ctx.fill(); }
    update() { this.y += this.s; }
}
function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(Math.random()<0.03) {
        const x = Math.random()*canvas.width, y = Math.random()*canvas.height*0.5, colors = ["#eeb323","#f43f5e","#fff"];
        const c = colors[Math.floor(Math.random()*colors.length)];
        for(let i=0;i<20;i++) particles.push(new P(x,y,c));
    }
    particles.forEach((p,i) => { p.update(); p.draw(); if(p.al<=0) particles.splice(i,1); });
    if(Math.random()<0.08) flowers.push(new Fl());
    flowers.forEach((f,i) => { f.update(); f.draw(); if(f.y>canvas.height) flowers.splice(i,1); });
    animId = requestAnimationFrame(loop);
}
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if(e.isIntersecting) {
            loop();
            gsap.to("#finale-text-1", { opacity: 1, y: 0, duration: 1.2 });
            gsap.to("#finale-text-2", { opacity: 1, y: 0, duration: 1.2, delay: 0.4 });
        } else { cancelAnimationFrame(animId); }
    });
}, { threshold: 0.1 });
obs.observe(document.getElementById("finale-section"));
