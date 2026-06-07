/**
 * نظام المعرض السينمائي المطور (Gallery & Lightbox Engine)
 * حل جذري لمشكلة تجميد الأزرار وحجب الطبقات الشفافة عبر الـ Z-Index الديناميكي
 */

const galleryImages = [
    "media/pic/gall-1.jpg",
    "media/pic/gall-2.jpg",
    "media/pic/gall-3.jpg",
    "media/pic/gall-4.jpg",
    "media/pic/gall-5.jpg",
    "media/pic/gall-6.jpg",
    "media/pic/gall-7.jpg",
    "media/pic/gall-8.jpg",
    
];

let currentIdx = 0;
let sliderTimer = null;

// ==========================================
// 1. نظام تشغيل وتحريك السلايدر التلقائي (Background Slideshow)
// ==========================================

function initSlideshow() {
    const wrapper = document.getElementById("slideshow-wrapper");
    if (!wrapper) return;
    
    wrapper.innerHTML = "";
    galleryImages.forEach((src, i) => {
        const slide = document.createElement("div");
        slide.className = `absolute inset-0 bg-cover bg-center transition-all duration-1000 transform opacity-0 scale-100 s-item-${i}`;
        slide.style.backgroundImage = `url('${src}')`;
        wrapper.appendChild(slide);
    });
    
    showSlide(currentIdx);
    startTimer();
}

function showSlide(index) {
    galleryImages.forEach((_, i) => {
        const s = document.querySelector(`.s-item-${i}`);
        if (s) { 
            s.classList.remove("opacity-100", "scale-105"); 
            s.classList.add("opacity-0", "scale-100"); 
        }
    });
    const act = document.querySelector(`.s-item-${index}`);
    if (act) { 
        act.classList.remove("opacity-0", "scale-100"); 
        act.classList.add("opacity-100", "scale-105"); 
    }
}

function nextSlide() { 
    currentIdx = (currentIdx + 1) % galleryImages.length; 
    showSlide(currentIdx); 
}

function prevSlide() { 
    currentIdx = (currentIdx - 1 + galleryImages.length) % galleryImages.length; 
    showSlide(currentIdx); 
}

function startTimer() { 
    if (!sliderTimer) { 
        sliderTimer = setInterval(nextSlide, 4000); 
    } 
}

function stopTimer() { 
    clearInterval(sliderTimer); 
    sliderTimer = null; 
}

// ==========================================
// 2. نظام التكبير (Lightbox) المعزز برمجياً بالـ Z-Index الديناميكي
// ==========================================

function openFullscreenGallery(i) {
    // إيقاف مؤقت السلايدر فوراً منعاً لأي تضارب تحديث في الخلفية
    stopTimer();

    const box = document.getElementById("fullscreen-lightbox");
    const img = document.getElementById("lightbox-img");
    
    if (box && img) {
        img.src = galleryImages[i];
        
        // هندسة الطبقات الذكية: رفع النافذة فوق كل عناصر الصفحة كلياً عند الفتح
        box.style.zIndex = "9999"; 
        
        // إزالة الحظر وتفعيل اللمس والرؤية الكاملة
        box.classList.remove("opacity-0", "pointer-events-none");
        box.classList.add("opacity-100", "pointer-events-auto");
        
        // تجميد الصفحة الرئيسية حتى لا تضيع إزاحة سكرول المستخدم بالخلفية
        document.body.style.overflow = "hidden";
    }
}

function closeFullscreenGallery() {
    const box = document.getElementById("fullscreen-lightbox");
    
    if (box) {
        // حجب الرؤية كلياً وتعطيل اللمس من الفئات
        box.classList.remove("opacity-100", "pointer-events-auto");
        box.classList.add("opacity-0", "pointer-events-none");
        
        // هندسة الطبقات الذكية: إجبار النافذة فوراً على النزول لطبقة -10 تحت الأرض لمنع حجب الصور الأخرى
        box.style.zIndex = "-10"; 
        
        // إعادة التحكم الطبيعي في سكرول الموقع
        document.body.style.overflow = "auto";
    }
    
    // إحياء السلايدر الخلفي مجدداً ليعود للعمل بنعومة
    startTimer();
}

// ==========================================
// 3. ربط أحداث الاستماع الفورية عند تحميل الصفحة
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initSlideshow();

    const lightbox = document.getElementById("fullscreen-lightbox");
    if (lightbox) {
        lightbox.addEventListener("click", function(e) {
            // إغلاق فوري ومرن إذا نقر المستخدم على الفراغ الأسود المحيط بالصورة تسهيلاً له
            if (e.target === this) {
                closeFullscreenGallery();
            }
        });
    }
});