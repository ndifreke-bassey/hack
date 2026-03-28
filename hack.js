const hideBtn = document.getElementById("hide-btn");

hideBtn.addEventListener("mouseenter", () => {
    const x = Math.random() * (window.innerWidth - hideBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - hideBtn.offsetHeight);
    hideBtn.style.position = "absolute";
    hideBtn.style.left = `${x}px`;
    hideBtn.style.top = `${y}px`;
});

const mainBtn = document.getElementById("main-btn");
mainBtn.addEventListener("click", () => {
    alert("You clicked the forbidden button! ☠️");
});