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

    // 6. Efecto de Inclinación 3D (Tilt) y Zoom Interactivo en la Maqueta del Hero
    const heroVisual = document.getElementById('hero-visual');
    const browserMockup = document.getElementById('browser-mockup');
    
    if (heroVisual && browserMockup) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((centerY - y) / centerY) * 14;
            const rotateY = ((x - centerX) / centerX) * 14;
            
            browserMockup.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06) translateZ(15px)`;
        });
        
        heroVisual.addEventListener('mouseleave', () => {
            browserMockup.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)';
        });
    }

    // 7. Widget Interactivo "Sobre Nosotros / Quiénes Somos"
    const aboutTabs = document.querySelectorAll('.about-tab-btn');
    const screenContents = document.querySelectorAll('.about-screen-content');
    
    // Configuración Test de Carga con 3 Barras Blancas
    const speedBtn = document.getElementById('run-speed-test');
    
    function runSpeedTest() {
        const fill1 = document.getElementById('speed-fill-1');
        const fill2 = document.getElementById('speed-fill-2');
        const fill3 = document.getElementById('speed-fill-3');
        const val1 = document.getElementById('bar-val-1');
        const val2 = document.getElementById('bar-val-2');
        const val3 = document.getElementById('bar-val-3');

        if (!fill1 || !fill2 || !fill3) return;

        // Reset state
        [fill1, fill2, fill3].forEach(fill => {
            fill.style.transition = 'none';
            fill.style.width = '0%';
        });
        if (val1) val1.textContent = 'Cargando...';
        if (val2) val2.textContent = 'Cargando...';
        if (val3) val3.textContent = 'Cargando...';

        setTimeout(() => {
            fill1.style.transition = 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            fill1.style.width = '100%';
            if (val1) val1.textContent = '0.1s — 100% Instantáneo';

            setTimeout(() => {
                fill2.style.transition = 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                fill2.style.width = '100%';
                if (val2) val2.textContent = '0.2s — 100% Optimizado';

                setTimeout(() => {
                    fill3.style.transition = 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                    fill3.style.width = '100%';
                    if (val3) val3.textContent = '0.1s — Carga Ultra Rápida';
                }, 120);
            }, 120);
        }, 50);
    }
    
    if (speedBtn) {
        speedBtn.addEventListener('click', runSpeedTest);
    }
    
    // Configuración Simulador Responsive
    const testerBtns = document.querySelectorAll('.tester-btn');
    const testerViewport = document.getElementById('tester-viewport');
    
    testerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            testerBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const widthMode = btn.getAttribute('data-width');
            testerViewport.className = `tester-viewport ${widthMode}`;
        });
    });
    
    // Manejo de clicks en pestañas del Widget
    aboutTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            aboutTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const activeTabName = tab.getAttribute('data-tab');
            
            // Switch screen content
            screenContents.forEach(content => {
                const contentId = content.getAttribute('id');
                if (contentId === `screen-${activeTabName}`) {
                    content.style.display = 'flex';
                } else {
                    content.style.display = 'none';
                }
            });
            
            // Trigger specific actions when switching tab
            if (activeTabName === 'velocidad') {
                runSpeedTest();
            }
        });
    });
});
