// Game state
let score = 0;
let level = 0;
let dodgeSpeed = 1;
let particles = [];
let cursorX = 0;
let cursorY = 0;
const maxParticles = 100;

// Elements
const hideBtn = document.getElementById("hide-btn");
const mainBtn = document.getElementById("main-btn");
const scoreEl = document.getElementById("score");
const terminalEl = document.getElementById("terminal");
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
const beep = document.getElementById("beep");
const glitchSound = document.getElementById("glitch");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let highScore = localStorage.getItem("hackHighScore") || 0;
updateScore();

// Custom cursor trail
document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    createParticle(cursorX, cursorY, '#00ff00');
});

function createParticle(x, y, color) {
    if (particles.length < maxParticles) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1,
            color,
            size: Math.random() * 3 + 1
        });
    }
}

function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.vx *= 0.98;
        p.vy *= 0.98;
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return p.life > 0;
    });
}

// Virus cursor
function updateCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'virus-cursor';
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    document.body.appendChild(cursor);
    setTimeout(() => cursor.remove(), 100);
}

// Init cursor loop
setInterval(() => {
    if (cursorX) updateCursor();
}, 50);

// Particle loop
function animate() {
    updateParticles();
    requestAnimationFrame(animate);
}
animate();

// Terminal log
function log(msg) {
    const time = new Date().toLocaleTimeString();
    terminalEl.innerHTML += `[${time}] ${msg}<br>`;
    terminalEl.scrollTop = terminalEl.scrollHeight;
}

// Update score
function updateScore() {
    scoreEl.textContent = `Score: ${score} (High: ${highScore})`;
}

// Level up
function levelUp() {
    level++;
    score += 10 * level;
    dodgeSpeed += 0.2;
    log(`[HACK] Level ${level} accessed. Score: ${score}`);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("hackHighScore", highScore);
        log("[!] New high score!");
    }
    updateScore();
    glitchSound.play().catch(() => {});
}

// Main button - multi level hack
mainBtn.addEventListener("click", () => {
    score += 5;
    log("[!] Button clicked - virus spreading...");
    createParticle(mainBtn.offsetLeft + mainBtn.offsetWidth / 2, mainBtn.offsetTop + mainBtn.offsetHeight / 2, '#ff0000');
    beep.play().catch(() => {});
    
    if (level === 0) {
        alert("Virus injected! ☠️ Level 1 unlocked.");
        levelUp();
    } else if (level === 1) {
        alert("Files accessed! 💻 Press again for more...");
        levelUp();
    } else if (level >= 2) {
        alert(`Full hack complete! Score: ${score} 🎉 Share your score!`);
        confettiBurst();
    }
    updateScore();
});

// Improved dodge button
hideBtn.addEventListener("mouseenter", () => {
    const x = Math.random() * (window.innerWidth - hideBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - hideBtn.offsetHeight);
    hideBtn.style.left = `${x}px`;
    hideBtn.style.top = `${y}px`;
    score += 1;
    createParticle(x, y, '#ffff00');
    log("[AVOID] Dodge attempt detected.");
    updateScore();
});

// Confetti on win
function confettiBurst() {
    for (let i = 0; i < 100; i++) {
        setTimeout(() => createParticle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            `hsl(${Math.random()*360}, 100%, 50%)`
        ), i * 10);
    }
    log("[WIN] Device fully hacked! Reload to play again.");
}

// Resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Welcome
log("=== HACK TERMINAL ONLINE ===");
log("[BOOT] Welcome, hacker. Click to begin virus deployment.");
log("[WARN] High score: " + highScore);
