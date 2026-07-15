/* Lógica Interactiva para la Página Web de Kenmar */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Efecto Scroll en Header (Sombreado y reducción de altura)
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Ejecutar una vez al inicio por si la página ya está desplazada
    handleScroll();

    // 2. Menú de Navegación Móvil (Toggle)
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Cerrar menú al hacer clic en cualquier enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // 3. Enlaces Activos basados en el Scroll (Intersection Observer)
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Detecta la sección activa en el centro de la pantalla
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // 4. Validación y Envío Simulado del Formulario de Contacto
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitBtnText = submitBtn.querySelector('span');

            // Validación simple
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                showFeedback('Por favor, rellena todos los campos.', 'error');
                return;
            }

            // Simulación de envío
            submitBtn.disabled = true;
            const originalText = submitBtnText.textContent;
            submitBtnText.textContent = 'Enviando...';

            setTimeout(() => {
                // Envío exitoso simulado
                submitBtn.disabled = false;
                submitBtnText.textContent = originalText;
                
                showFeedback('¡Gracias! Tu mensaje ha sido enviado con éxito. Nos pondremos en contacto contigo pronto.', 'success');
                
                // Reiniciar el formulario
                contactForm.reset();
            }, 1500);
        });
    }

    const showFeedback = (message, type) => {
        if (!formFeedback) return;
        
        formFeedback.textContent = message;
        formFeedback.className = `form-feedback ${type}`; // Elimina 'hidden' y aplica clase de tipo
        
        // Ocultar automáticamente después de 6 segundos si es de éxito
        if (type === 'success') {
            setTimeout(() => {
                formFeedback.className = 'form-feedback hidden';
            }, 6000);
        }
    };

    // 5. Efecto Máquina de Escribir en Hero
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const words = ['negocio', 'PyME', 'empresa', 'marca'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const type = () => {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 75 : 150;
            
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Pausa al finalizar la escritura
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pausa antes de empezar la nueva palabra
            }
            
            setTimeout(type, typeSpeed);
        };
        
        setTimeout(type, 1000);
    }

    // 6. Efecto de Inclinación 3D (Tilt) y Parallax en el Hero Visual
    const heroVisual = document.getElementById('hero-visual');
    const browserMockup = document.getElementById('browser-mockup');
    const badgeSpeed = document.getElementById('badge-speed');
    const badgeSeo = document.getElementById('badge-seo');
    
    if (heroVisual && browserMockup) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((centerY - y) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            browserMockup.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            
            if (badgeSpeed) {
                badgeSpeed.style.transform = `translate(${(centerX - x) * 0.04}px, ${(centerY - y) * 0.04}px)`;
            }
            if (badgeSeo) {
                badgeSeo.style.transform = `translate(${(centerX - x) * -0.04}px, ${(centerY - y) * -0.04}px)`;
            }
        });
        
        heroVisual.addEventListener('mouseleave', () => {
            browserMockup.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
            if (badgeSpeed) {
                badgeSpeed.style.transform = '';
            }
            if (badgeSeo) {
                badgeSeo.style.transform = '';
            }
        });
    }
});
