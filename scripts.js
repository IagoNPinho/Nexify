function applyPlaceholders() {
    const imgs = document.querySelectorAll("img.lazy-img");

    imgs.forEach(img => {
        const key = img.dataset.ph || "gray"; // fallback
        const ph = window.placeholders[key];

        if (ph) {
            img.src = ph;
        } else {
            console.warn(`Placeholder "${key}" não encontrado. Usando gray.`);
            img.src = window.placeholders.gray;
        }
    });
}

function initScrollAnimations(selectors = []) {
    if (!selectors.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // remove observer → mais performance
            }
        });
    }, { threshold: 0.2 });

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => observer.observe(el));
    });
}

function initMobileMenu() {
    const hamburger = document.getElementById("hamburger");
    const nav = document.getElementById("nav");

    if (!hamburger || !nav) return;

    hamburger.addEventListener("click", () => {
        nav.classList.toggle("active");
        hamburger.classList.toggle("open");
    });

    document.querySelectorAll("#nav a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            hamburger.classList.remove("open");
        });
    });
}

function initLazyLoading() {
    const imgs = document.querySelectorAll("img.lazy-img");

    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                img.src = img.dataset.src;

                img.onload = () => {
                    img.classList.add("loaded");
                };

                observer.unobserve(img);
            }
        });
    };

    const observer = new IntersectionObserver(callback, options);
    imgs.forEach(img => observer.observe(img));
}

function initWhatsAppButton() {
    const wppBtn = document.getElementById("whatsapp-btn");

    if (!wppBtn) return;

    const number = "5585988224901";
    const message = "Olá! Gostaria de mais informações.";

    const whatsappURL = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    wppBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(whatsappURL, "_blank");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    applyPlaceholders();
    initLazyLoading();
    initScrollAnimations([
        ".fade-in",
        ".fade-in-up",
        ".fade-in-left",
        ".fade-in-right"
    ]);
    initMobileMenu();
    initWhatsAppButton();
});
