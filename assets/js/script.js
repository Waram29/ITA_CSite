// Script de base pour le site
console.log('JS chargé avec succès !');

// Sélection des éléments
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const menuIcon = hamburger.querySelector("i");
const topBar = document.querySelector(".top-bar");
const scrollProgress = document.getElementById("scrollProgress");
const stats = document.querySelectorAll('.stat-number');

let lastScrollTop = 0;

// Fonction pour basculer le menu
const toggleMenu = () => {
    const isActive = navMenu.classList.toggle("active");
    
    // Changement d'icône avec animation
    if (isActive) {
        menuIcon.classList.replace("fa-bars", "fa-xmark");
    } else {
        menuIcon.classList.replace("fa-xmark", "fa-bars");
    }
};

// Événement clic sur le hamburger
hamburger.addEventListener("click", toggleMenu);

// Fermeture automatique au clic sur un lien
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuIcon.classList.replace("fa-xmark", "fa-bars");
    });
});

// Optionnel : Fermer le menu si on clique en dehors
document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
        menuIcon.classList.replace("fa-xmark", "fa-bars");
    }
});

// Scroll detection pour cacher le top-bar
window.addEventListener("scroll", () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 50) {
        topBar.classList.add("hidden");
    } else {
        topBar.classList.remove("hidden");
    }
});

// ===== HERO SLIDER =====
document.addEventListener("DOMContentLoaded", () => {
    const slidesContainer = document.querySelector(".slides");
    const allSlides = document.querySelectorAll(".slide");

    if (!slidesContainer || allSlides.length === 0) return; // Sécurité

    let slideIndex = 0;
    const totalSlides = allSlides.length;

    function updateSlider() {
        // Force le calcul propre du décalage
        slidesContainer.style.transform = `translateX(-${slideIndex * 100}%)`;
    }

    function nextSlide() {
        slideIndex++;
        if (slideIndex >= totalSlides) {
            slideIndex = 0;
        }
        updateSlider();
    }

    // Lancement automatique
    let autoSlideInterval = setInterval(nextSlide, 7000);
});

// ===== ANIMATION DES CHIFFRES =====

const speed = 200;

const animateStats = () => {
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        const isPercent = stat.innerText.includes('%');
        
        const updateCount = () => {
            const currentText = stat.innerText.replace('+', '').replace('%', '');
            const count = +currentText;
            const inc = Math.ceil(target / speed);

            if (count < target) {
                const nextVal = count + inc > target ? target : count + inc;
                stat.innerText = isPercent ? nextVal + '%' : '+' + nextVal;
                setTimeout(updateCount, 15);
            } else {
                stat.innerText = isPercent ? target + '%' : '+' + target;
            }
        };
        updateCount();
    });
};

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        animateStats();
        observer.disconnect();
    }
}, { threshold: 0.5 });

observer.observe(document.querySelector('.stats-section'));

// ===== TABS Services =====
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // 2. Masquer tous les éléments avec la classe "tab-content"
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    // 3. Supprimer la classe "active" de tous les boutons
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // 4. Afficher l'onglet actuel et ajouter la classe "active" au bouton cliqué
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// ===== ANIMATION PROCESSUS =====
window.addEventListener('scroll', () => {
    const steps = document.querySelectorAll('.process-step');
    const lineFill = document.querySelector('.line-fill');
    const triggerBottom = window.innerHeight * 0.8; // Se déclenche à 80% de la vue

    let activeSteps = 0;

    steps.forEach((step, index) => {
        const stepTop = step.getBoundingClientRect().top;

        if (stepTop < triggerBottom) {
            step.classList.add('reveal');
            activeSteps = index + 1;
        }
    });

    // Calcul de la hauteur de la ligne verte
    const progress = ((activeSteps - 1) / (steps.length - 1)) * 100;
    lineFill.style.height = Math.max(0, progress) + "%";
});

// ===== ACCORDÉON FAQ =====
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        
        // Ferme les autres questions ouvertes
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Alterne l'état de la question cliquée
        item.classList.toggle('active');
    });
});
// ==== SLIDER TESTIMONIALS =====
const trackTesti = document.getElementById('sliderTrack');
const slidesTesti = document.querySelectorAll('.slide-3d'); // Renommé ici
let currentIndex = Math.min(1, slidesTesti.length - 1);

function updateSlider() {
    slidesTesti.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentIndex) {
            slide.classList.add('active');
        }
    });

    // Vérification de sécurité pour éviter les erreurs si l'élément n'existe pas encore
    if (slidesTesti.length > 0) {
        const slideWidth = slidesTesti[0].offsetWidth;
        const containerWidth = document.querySelector('.slider-3d-wrapper').offsetWidth;
        
        // Calcul précis pour centrer
        const offset = (containerWidth / 2) - (slideWidth * currentIndex) - (slideWidth / 2);
        trackTesti.style.transform = `translateX(${offset}px)`;
    }
}

function moveSlide(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= slidesTesti.length) currentIndex = slidesTesti.length - 1;
    updateSlider();
}

// Initialisation et adaptation au redimensionnement
window.addEventListener('resize', updateSlider);
window.addEventListener('load', updateSlider);

// Petit délai pour s'assurer que le DOM est bien calculé avant le premier rendu
setTimeout(updateSlider, 100);


// ===== FORMULAIRE DE CONTACT =====
document.getElementById("contactForm").addEventListener("submit", async function(e) {
    e.preventDefault(); // Empêche le rechargement de la page

    const form = e.target;
    const status = document.getElementById("formStatus");
    const btnText = document.getElementById("btnText");
    const data = new FormData(form);

    // État de chargement
    btnText.innerText = "Envoi en cours...";
    form.querySelector('button').style.opacity = "0.7";
    form.querySelector('button').disabled = true;

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // Succès
            status.style.display = "block";
            status.style.color = "#28a745"; // Vert succès
            status.innerText = "Merci ! Votre demande a été envoyée avec succès.";
            form.reset(); // Réinitialise le formulaire
        } else {
            // Erreur serveur
            throw new Error();
        }
    } catch (error) {
        // Erreur réseau
        status.style.display = "block";
        status.style.color = "#dc3545"; // Rouge erreur
        status.innerText = "Oups ! Une erreur est survenue lors de l'envoi.";
    } finally {
        // Rétablir le bouton
        btnText.innerText = "Envoyer ma demande";
        form.querySelector('button').style.opacity = "1";
        form.querySelector('button').disabled = false;
        
        // Cacher le message après 5 secondes
        setTimeout(() => { status.style.display = "none"; }, 5000);
    }
});

// ===== TOOLTIP WHATSAPP =====
const tooltip = document.getElementById('whatsapp-tooltip');
const button = document.getElementById('whatsapp-button');

button.addEventListener('mouseenter', function() {
    tooltip.style.display = 'block';
});

button.addEventListener('mouseleave', function() {
    tooltip.style.display = 'none';
});


// Dans ton event listener de bouton :
element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });