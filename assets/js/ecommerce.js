function initScrollFadeIn() {

    // Seleciona todos os elementos que precisam de fade-in
    const animated = document.querySelectorAll(".project-image, .project-details, .gallery-grid img");

    if (animated.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
            }
        });
    }, { threshold: 0.15 });

    animated.forEach(el => observer.observe(el));
}

function initProductCarousel() {
    const track = document.querySelector(".carousel-track");
    const btnPrev = document.querySelector(".carousel-btn.prev");
    const btnNext = document.querySelector(".carousel-btn.next");

    if (!track) return;

    const scrollAmount = 320; // largura média de um card

    btnPrev.addEventListener("click", () => {
        track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    btnNext.addEventListener("click", () => {
        track.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initScrollFadeIn();
    initProductCarousel();
});
