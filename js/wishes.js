/**
 * نظام إدارة جدار الأمنيات الذكي (Wishes Wall Engine) - المطور والمؤمن ضد المصفوفات الفارغة
 */

// 1. التهنئات الافتراضية الفاخرة
const defaultWishes = [
    { name: "العائلة الكريمة", message: "ألف مبروك لأجمل عريس وعروس، بارك الله لكما وجمع بينكما في خير. نتطلع لليلتكم الموعودة." },
    { name: "صديق العريس المقرب", message: "يا رب تتمم فرحتكم على خير يا أبو حميد، الغالي وجد شريكة عمره النقية، ليلة زفاف مباركة وسعيدة لكما!" },
    { name: "خالة العروس", message: "سارة يا قُرة العين وجميلة العائلة، مبارك زواجك الميمون من الرجل الصالح أحمد، جعل الله بيوتكم عامرة بالمحبة." }
];

// 2. جلب البيانات مع فحص ذكي: إذا كانت الذاكرة فارغة تماماً أو تحتوي على مصفوفة فارغة [] شحن الافتراضي فوراً
let savedWishes = JSON.parse(localStorage.getItem("wedding_wishes"));
let wishes = (savedWishes && savedWishes.length > 0) ? savedWishes : defaultWishes;

// حفظ الحالة الصحيحة في الـ localStorage لضمان استقرارها
if (!savedWishes || savedWishes.length === 0) {
    localStorage.setItem("wedding_wishes", JSON.stringify(wishes));
}

// 3. دالة عرض وبناء كروت التهنئة ديناميكياً
function displayWishes() {
    const wall = document.getElementById("wishes-wall");
    if (!wall) return;
    
    wall.innerHTML = "";
    
    // إذا قام المستخدم بحذف كل شيء، نعرض رسالة ترحيبية خفيفة للتناسق البصري
    if (wishes.length === 0) {
        wall.innerHTML = `<p class="text-xs text-gray-500 text-center col-span-2 py-8">لا توجد تهنئات حالياً، كن أول المهنئين!</p>`;
        return;
    }
    
    // عرض العناصر بترتيب عكسي (الأحدث أولاً)
    wishes.slice().reverse().forEach((wish, originalIndex) => {
        const trueIndex = wishes.length - 1 - originalIndex;
        
        const card = document.createElement("div");
        card.className = "glass-wish-card p-4 rounded-xl text-right flex flex-col justify-between relative group transition-all duration-300 min-h-[140px]";
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <p class="text-[11px] text-gold-400 font-medium"><i class="fa-solid fa-bookmark ml-1"></i>تهنئة ميمونة</p>
                
                <button onclick="deleteWish(${trueIndex})" class="text-gray-500 hover:text-red-500 text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none cursor-pointer" title="إزالة هذه التهنئة">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
            
            <p class="text-xs md:text-sm text-gray-300 leading-relaxed italic mb-3 flex-grow">"${wish.message}"</p>
            
            <div class="border-t border-gold-500/10 pt-2 flex items-center justify-between">
                <span class="text-xs font-bold text-gold-300">${wish.name}</span>
                <i class="fa-solid fa-heart text-[9px] text-red-500/30"></i>
            </div>
        `;
        
        wall.appendChild(card);
    });
}

// 4. دالة إضافة تهنئة جديدة وحفظها فورياً
function handleWishSubmit(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById("wish-name");
    const messageInput = document.getElementById("wish-message");
    const wallContainer = document.getElementById("wishes-wall");
    
    if (!nameInput || !messageInput) return;
    
    const newWish = {
        name: nameInput.value.trim(),
        message: messageInput.value.trim()
    };
    
    wishes.push(newWish);
    localStorage.setItem("wedding_wishes", JSON.stringify(wishes));
    
    displayWishes();
    
    nameInput.value = "";
    messageInput.value = "";
    
    if (wallContainer) {
        wallContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 5. دالة الحذف الذكي والآمن
function deleteWish(index) {
    wishes.splice(index, 1);
    localStorage.setItem("wedding_wishes", JSON.stringify(wishes));
    displayWishes();
}

// 6. ربط الأحداث وتشغيل النظام
document.addEventListener("DOMContentLoaded", () => {
    displayWishes();
    
    const wishForm = document.getElementById("wish-form");
    if (wishForm) {
        wishForm.addEventListener("submit", handleWishSubmit);
    }
});