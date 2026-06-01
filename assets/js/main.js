/**
 * ITA Consulting - Structure & Navigation
 */

// Sélection des éléments
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const menuIcon = hamburger?.querySelector("i");
const backToTopBtn = document.getElementById('back-to-top');
const siteName = "ITA Consulting";

// --- MENU MOBILE ---
const toggleMenu = () => {
    if (!navMenu || !menuIcon) return;
    const isActive = navMenu.classList.toggle("active");
    if (isActive) {
        menuIcon.classList.replace("fa-bars", "fa-xmark");
    } else {
        menuIcon.classList.replace("fa-xmark", "fa-bars");
    }
};

if (hamburger) hamburger.addEventListener("click", toggleMenu);

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu?.classList.remove("active");
        menuIcon?.classList.replace("fa-xmark", "fa-bars");
        // Mise à jour Titre
        const sectionName = link.textContent.trim();
        document.title = `${sectionName} | ${siteName}`;
    });
});

document.addEventListener("click", (e) => {
    if (hamburger && !hamburger.contains(e.target) && navMenu && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
        menuIcon?.classList.replace("fa-xmark", "fa-bars");
    }
});

// --- BOUTON BACK TO TOP & TITRE LOGO ---
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY || window.pageYOffset;
        backToTopBtn.classList.toggle('show', scrollY > 300);
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.title = `Accueil | ${siteName}`;
    });
}

const logoHome = document.querySelector(".brand");
if (logoHome) {
    logoHome.addEventListener("click", () => {
        document.title = `Accueil | ${siteName}`;
    });
}

// --- TABS & FAQ ---
window.openTab = function(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    const tablinks = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName)?.classList.add("active");
    evt.currentTarget.classList.add("active");
};

document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        document.querySelectorAll('.faq-item').forEach(other => {
            if (other !== item) other.classList.remove('active');
        });
        item.classList.toggle('active');
    });
});

// --- SELECT PERSONNALISÉ ---
function initCustomSelect(wrapper) {
    const nativeSelect = wrapper.querySelector(".form-select-native");
    const trigger = wrapper.querySelector(".custom-select-trigger");
    const label = wrapper.querySelector(".custom-select-label");
    const options = wrapper.querySelectorAll(".custom-select-option");
    if (!nativeSelect || !trigger || !label) return null;

    const placeholder = nativeSelect.options[0]?.textContent.trim() || "Choisissez une option";

    const close = () => {
        wrapper.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        options.forEach((opt) => opt.classList.remove("is-highlighted"));
    };

    const open = () => {
        wrapper.classList.remove("is-invalid");
        wrapper.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
    };

    const selectOption = (option) => {
        nativeSelect.value = option.dataset.value;
        nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
        label.textContent = option.textContent.trim();
        label.classList.remove("is-placeholder");
        options.forEach((opt) => {
            const isSelected = opt === option;
            opt.classList.toggle("is-selected", isSelected);
            opt.setAttribute("aria-selected", isSelected ? "true" : "false");
        });
        close();
    };

    const reset = () => {
        nativeSelect.selectedIndex = 0;
        label.textContent = placeholder;
        label.classList.add("is-placeholder");
        options.forEach((opt) => {
            opt.classList.remove("is-selected", "is-highlighted");
            opt.setAttribute("aria-selected", "false");
        });
        close();
        wrapper.classList.remove("is-invalid");
    };

    trigger.addEventListener("click", (e) => {
        e.preventDefault();
        wrapper.classList.contains("open") ? close() : open();
    });

    options.forEach((option) => {
        option.addEventListener("click", () => selectOption(option));
        option.addEventListener("mouseenter", () => {
            options.forEach((opt) => opt.classList.remove("is-highlighted"));
            option.classList.add("is-highlighted");
        });
    });

    trigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            wrapper.classList.contains("open") ? close() : open();
        }
        if (e.key === "Escape") close();
        if (e.key === "ArrowDown" && options.length) {
            e.preventDefault();
            if (!wrapper.classList.contains("open")) open();
            options[0].focus();
        }
    });

    options.forEach((option, index) => {
        option.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectOption(option);
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                options[Math.min(index + 1, options.length - 1)]?.focus();
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                if (index === 0) trigger.focus();
                else options[index - 1]?.focus();
            }
            if (e.key === "Escape") {
                close();
                trigger.focus();
            }
        });
    });

    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) close();
    });

    return reset;
}

const serviceSelectWrapper = document.getElementById("serviceSelect");
const resetServiceSelect = serviceSelectWrapper ? initCustomSelect(serviceSelectWrapper) : null;
document.getElementById("contactForm")?.addEventListener("reset", () => resetServiceSelect?.());

// --- FORMULAIRE ---
document.getElementById("contactForm")?.addEventListener("submit", async function(e) {
    e.preventDefault();
    const form = e.target;
    const status = document.getElementById("formStatus");
    const btnText = document.getElementById("btnText");
    const serviceField = document.getElementById("service");

    if (!serviceField?.value) {
        serviceSelectWrapper?.classList.add("is-invalid");
        serviceSelectWrapper?.classList.add("open");
        serviceSelectWrapper?.querySelector(".custom-select-trigger")?.focus();
        status.style.display = "block";
        status.style.color = "#dc3545";
        status.innerText = "Veuillez choisir un service.";
        setTimeout(() => { if (status) status.style.display = "none"; }, 4000);
        return;
    }

    const data = new FormData(form);

    btnText.innerText = "Envoi en cours...";
    form.querySelector('button').disabled = true;

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
            status.style.display = "block";
            status.style.color = "#28a745";
            status.innerText = "Merci ! Votre demande a été envoyée avec succès.";
            form.reset();
            resetServiceSelect?.();
        } else { throw new Error(); }
    } catch (error) {
        status.style.display = "block";
        status.style.color = "#dc3545";
        status.innerText = "Oups ! Une erreur est survenue.";
    } finally {
        btnText.innerText = "Envoyer ma demande";
        form.querySelector('button').disabled = false;
        setTimeout(() => { if(status) status.style.display = "none"; }, 5000);
    }
});