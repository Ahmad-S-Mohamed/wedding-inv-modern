/**
 * محرك لعبة المتاهة السريعة (Turbo Maze Game Engine)
 * حركة فائقة السرعة، استجابة فورية للمس، وضبط اتجاهات الـ RTL
 */
const mazeMap = [
    [2, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 3]
];

const rows = mazeMap.length, cols = mazeMap[0].length;
let groomPos = { x: 0, y: 0 }, isMazeFinished = false;

function buildMaze() {
    const container = document.getElementById("maze-container");
    if (!container) return;
    
    container.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    container.innerHTML = "";

    const boxSize = window.innerWidth < 400 ? "w-6 h-6" : (window.innerWidth < 640 ? "w-7 h-7" : "w-10 h-10");

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tile = document.createElement("div");
            tile.className = `${boxSize} flex items-center justify-center relative transition-all duration-100`;
            tile.id = `tile-${r}-${c}`;
            
            if (mazeMap[r][c] === 1) {
                tile.classList.add("bg-gradient-to-br", "from-amber-950", "to-zinc-900", "border", "border-gold-500/5");
            } else {
                tile.classList.add("bg-zinc-950");
            }

            if (mazeMap[r][c] === 2) {
                tile.innerHTML = `<img src="media/pic/man.jpg" class="w-full h-full object-cover rounded-full border border-gold-400 z-10">`;
                groomPos = { x: c, y: r };
            } else if (mazeMap[r][c] === 3) {
                tile.innerHTML = `<img src="media/pic/weman.jpg" class="w-full h-full object-cover rounded-full border border-red-400 z-10 animate-bounce">`;
            }
            container.appendChild(tile);
        }
    }
}

function moveGroom(dx, dy) {
    if (isMazeFinished) return;
    const nX = groomPos.x + dx, nY = groomPos.y + dy;

    if (nX >= 0 && nX < cols && nY >= 0 && nY < rows && mazeMap[nY][nX] !== 1) {
        document.getElementById(`tile-${groomPos.y}-${groomPos.x}`).innerHTML = "";
        groomPos.x = nX; groomPos.y = nY;

        const nextTile = document.getElementById(`tile-${groomPos.y}-${groomPos.x}`);
        nextTile.innerHTML = `<img src="assets/images/groom.jpg" class="w-full h-full object-cover rounded-full border border-gold-400 z-10">`;

        if (mazeMap[nY][nX] === 3) { triggerMazeWin(); }
    }
}

// ========================================================
// ⚡ نظام اللمس المطور: استجابة فورية وحركة صحيحة 100%
// ========================================================
let startTouchX = 0, startTouchY = 0;
let lastMoveTime = 0; 
const moveThreshold = 25; // الحساسية بالبكسل لبدء الحركة الكاشفة
const moveCooldown = 120;  // سرعة تكرار الخطوات بالملي ثانية أثناء السحب المستمر (Throttle)

const mCont = document.getElementById("maze-container");

if (mCont) {
    mCont.addEventListener("touchstart", (e) => {
        startTouchX = e.touches[0].clientX;
        startTouchY = e.touches[0].clientY;
    }, { passive: true });

    mCont.addEventListener("touchmove", (e) => {
        if (isMazeFinished) return;

        const now = Date.now();
        if (now - lastMoveTime < moveCooldown) return; // كبح السرعة الزائدة لمنع القفز العشوائي

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;

        // تعديل الحسابات الرياضية: ضرب فرق الـ X في -1 لإصلاح مشكلة اليمين واليسار في الـ RTL
        const diffX = (currentX - startTouchX) * -1; 
        const diffY = currentY - startTouchY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // حركة أفقية دقيقة ومستجيبة
            if (Math.abs(diffX) > moveThreshold) {
                if (diffX > 0) moveGroom(1, 0); else moveGroom(-1, 0);
                // تحديث النقطة المرجعية فوراً لجعل الحركة مستمرة وانسيابية مع السحب
                startTouchX = currentX; 
                lastMoveTime = now;
            }
        } else {
            // حركة رأسية
            if (Math.abs(diffY) > moveThreshold) {
                if (diffY > 0) moveGroom(0, 1); else moveGroom(0, -1);
                startTouchY = currentY; 
                lastMoveTime = now;
            }
        }
    }, { passive: true });
}

// أزرار الكيبورد للكمبيوتر (مستجيبة وسريعة)
window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
    if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") moveGroom(0, -1);
    if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") moveGroom(0, 1);
    if (e.key === "Arrowright" || e.key.toLowerCase() === "a") moveGroom(-1, 0);
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "d") moveGroom(1, 0);
});

function triggerMazeWin() {
    isMazeFinished = true;
    const panel = document.getElementById("maze-success");
    if(panel) {
        panel.classList.remove("pointer-events-none");
        panel.style.opacity = "1";
        emitHearts();
    }
}

function emitHearts() {
    const emitter = document.getElementById("hearts-emitter");
    if(!emitter) return;
    for (let i = 0; i < 25; i++) {
        const h = document.createElement("i");
        h.className = "fa-solid fa-heart heart-particle";
        h.style.setProperty('--mx', `${(Math.random() - 0.5) * 200}px`);
        h.style.setProperty('--my', `${(Math.random() - 0.5) * 200 - 40}px`);
        h.style.setProperty('--rt', `${Math.random() * 360}deg`);
        h.style.left = "50%"; h.style.top = "50%";
        emitter.appendChild(h);
        setTimeout(() => h.remove(), 1500);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    buildMaze();
    const nextBtn = document.getElementById("maze-next-btn");
    if(nextBtn) {
        nextBtn.addEventListener("click", () => {
            document.getElementById("countdown-section").scrollIntoView({ behavior: 'smooth' });
        });
    }
});