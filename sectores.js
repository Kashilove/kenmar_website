/* Lógica Interactiva del Portafolio por Sectores de San Carlos */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // 0. Efecto Scroll en Header
    // ----------------------------------------------------
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ----------------------------------------------------
    // 1. Control del Menú Móvil
    // ----------------------------------------------------
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
        
        // Cerrar menú al hacer clic en enlaces o botones del sector
        const menuItems = navMenu.querySelectorAll('a, button');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ----------------------------------------------------
    // 2. Control de Pestañas / Cambio de Sectores
    // ----------------------------------------------------
    const sectorButtons = document.querySelectorAll('.nav-sector-btn');
    const footerButtons = document.querySelectorAll('.footer-sector-link');
    const infoPanels = document.querySelectorAll('.sector-info-panel');
    const mockupViews = document.querySelectorAll('.mockup-view');
    const browserUrl = document.getElementById('mockup-url');
    
    const hiddenSectorInput = document.getElementById('form-selected-sector');
    const contactMessage = document.getElementById('sectors-message');

    // URLs simuladas para el navegador de cada sector
    const sectorUrls = {
        retail: 'ropaycalzadosancarlos.com',
        agro: 'agrosancarlos.cr',
        cafe: 'cafequesadacowork.com',
        turismo: 'arenaladventuretours.com'
    };

    // Mensajes predeterminados del formulario para cada sector
    const sectorMessages = {
        retail: 'Hola Kenmar, estoy interesado en una página web para el sector Ropa & Zapatería / Retail con catálogo interactivo.',
        agro: 'Hola Kenmar, me gustaría cotizar un sitio web corporativo para mi distribuidora de Agroinsumos / Sector Agrícola.',
        cafe: 'Hola Kenmar, estoy interesado en diseñar un sitio web moderno con menú digital y sistema de reservas para Café / Coworking.',
        turismo: 'Hola Kenmar, me interesa cotizar una página web interactiva para mi agencia de Turismo & Aventura en la zona norte.'
    };

    function changeSector(sectorId) {
        // Desactivar botones de navegación
        sectorButtons.forEach(btn => {
            if (btn.getAttribute('data-sector') === sectorId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Actualizar URL del mockup
        if (browserUrl) {
            browserUrl.textContent = sectorUrls[sectorId];
        }

        // Intercambiar paneles de información
        infoPanels.forEach(panel => {
            if (panel.getAttribute('id') === `info-${sectorId}`) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Intercambiar vistas de mockup
        mockupViews.forEach(view => {
            if (view.getAttribute('id') === `mockup-view-${sectorId}`) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        // Sincronizar con el formulario de contacto
        if (hiddenSectorInput) {
            hiddenSectorInput.value = sectorId;
        }
        if (contactMessage) {
            contactMessage.value = sectorMessages[sectorId];
        }

        // Si se cambia desde el footer, hacer scroll al showcase
        if (document.activeElement && document.activeElement.classList.contains('footer-sector-link')) {
            document.querySelector('.showcase-hero').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Eventos para botones de la navegación superior
    sectorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sector = btn.getAttribute('data-sector');
            changeSector(sector);
        });
    });

    // Eventos para enlaces del footer
    footerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sector = btn.getAttribute('data-sector');
            changeSector(sector);
        });
    });

    // ----------------------------------------------------
    // 3. Interacciones Mockup 1: ROPA & ZAPATERÍA / RETAIL
    // ----------------------------------------------------
    // Función para actualizar dinámicamente el enlace de WhatsApp de cada producto
    function updateProductWaLink(card) {
        const waBtn = card.querySelector('.btn-product-wa');
        if (!waBtn) return;
        
        const itemName = waBtn.getAttribute('data-item');
        
        // Obtener color seleccionado
        const activeColorDot = card.querySelector('.color-dot.active');
        let colorName = 'Predeterminado';
        if (activeColorDot) {
            const colorHex = activeColorDot.getAttribute('data-color');
            if (colorHex === '#1e3a8a') colorName = 'Azul Marino';
            else if (colorHex === '#1c1917') colorName = 'Negro';
            else if (colorHex === '#3f6212') colorName = 'Verde Oliva';
            else if (colorHex === '#5c4033') colorName = 'Café';
            else if (colorHex === '#a0522d') colorName = 'Sienna';
        }
        
        // Obtener talla seleccionada
        const sizeSelect = card.querySelector('.size-select');
        const selectedSize = sizeSelect ? sizeSelect.value : 'Talla única';
        
        const textMessage = `Hola Kenmar, estoy consultando disponibilidad desde su portafolio interactivo de Ropa & Zapatería:%0A%0A` +
            `- *Producto:* ${itemName}%0A` +
            `- *Color:* ${colorName}%0A` +
            `- *Talla:* ${selectedSize}%0A%0A` +
            `¿Me podrían indicar si lo tienen disponible y cómo sería el proceso de cotización?`;
            
        waBtn.setAttribute('href', `https://wa.me/50686737455?text=${textMessage}`);
    }

    // Inicializar links y eventos de color / talla
    const shopCards = document.querySelectorAll('.shop-card');
    shopCards.forEach(card => {
        // Inicializar el link de WhatsApp
        updateProductWaLink(card);

        // Evento para cambios de color
        const dots = card.querySelectorAll('.color-dot');
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const color = e.target.getAttribute('data-color');
                
                dots.forEach(d => d.classList.remove('active'));
                e.target.classList.add('active');

                // Cambiar el color del calzado (SVG) si existe
                const shoePath = card.querySelector('.shoe-color-path');
                if (shoePath) {
                    shoePath.style.fill = color;
                }

                // Cambiar el color de la chaqueta (SVG) si existe
                const clothingPaths = card.querySelectorAll('.clothing-color-path, .clothing-color-path-collar');
                clothingPaths.forEach(path => {
                    path.style.fill = color;
                });

                // Actualizar enlace de WhatsApp
                updateProductWaLink(card);
            });
        });

        // Evento para cambios de talla
        const sizeSelect = card.querySelector('.size-select');
        if (sizeSelect) {
            sizeSelect.addEventListener('change', () => {
                updateProductWaLink(card);
            });
        }
    });

    // Enviar a Formulario desde el catálogo de Ropa/Calzado
    const btnProductForms = document.querySelectorAll('.btn-product-form');
    btnProductForms.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.shop-card');
            const itemName = e.target.getAttribute('data-item');
            
            // Obtener color
            const activeColorDot = card.querySelector('.color-dot.active');
            let colorName = 'Predeterminado';
            if (activeColorDot) {
                const colorHex = activeColorDot.getAttribute('data-color');
                if (colorHex === '#1e3a8a') colorName = 'Azul Marino';
                else if (colorHex === '#1c1917') colorName = 'Negro';
                else if (colorHex === '#3f6212') colorName = 'Verde Oliva';
                else if (colorHex === '#5c4033') colorName = 'Café';
                else if (colorHex === '#a0522d') colorName = 'Sienna';
            }
            
            // Obtener talla
            const sizeSelect = card.querySelector('.size-select');
            const selectedSize = sizeSelect ? sizeSelect.value : 'Talla única';
            
            // Forzar vista de Retail
            changeSector('retail');
            
            // Scroll a Formulario
            const formSection = document.getElementById('contacto-form');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Pre-llenar mensaje
            if (contactMessage) {
                contactMessage.value = `Hola Kenmar, estoy interesado en cotizar y consultar disponibilidad de este producto:\n- Producto: ${itemName}\n- Color: ${colorName}\n- Talla: ${selectedSize}\n\nPor favor, asesórenme sobre las opciones y plazos de entrega.`;
            }
        });
    });

    // Filtros de Ropa vs Calzado en el mockup de retail
    const shopFilterBtns = document.querySelectorAll('.shop-filter-btn');
    const shopCardsList = document.querySelectorAll('.shop-product-grid .shop-card');
    
    shopFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            shopFilterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filterVal = e.target.getAttribute('data-filter');
            
            shopCardsList.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (filterVal === 'all' || cardCat === filterVal) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ----------------------------------------------------
    // 4. Interacciones Mockup 2: AGROINSUMOS
    // ----------------------------------------------------
    const agroSearchInput = document.getElementById('agro-search-input');
    const agroCatButtons = document.querySelectorAll('.agro-cat-btn');
    const agroCards = document.querySelectorAll('.agro-card');

    // Filtrar por categoría
    agroCatButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            agroCatButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const selectedCat = e.target.getAttribute('data-category');
            
            agroCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (selectedCat === 'all' || cardCat === selectedCat) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Filtrar por búsqueda de texto
    if (agroSearchInput) {
        agroSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            agroCards.forEach(card => {
                const productName = card.getAttribute('data-name');
                if (productName.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Eventos para Cotizar Lote desde el mockup de Agro
    const agroQuoteBtns = document.querySelectorAll('.agro-btn-quote');
    agroQuoteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const itemName = e.target.getAttribute('data-item');
            
            // Cambiar vista a Agro
            changeSector('agro');

            // Scroll y setear mensaje
            const formSection = document.getElementById('contacto-form');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
            }

            if (contactMessage) {
                contactMessage.value = `Hola Kenmar, estoy cotizando un lote de insumos para el sector agrícola. Específicamente me interesa cotizar una web que muestre productos como: "${itemName}".`;
            }
        });
    });

    // ----------------------------------------------------
    // 5. Interacciones Mockup 3: CAFÉ & COWORKING
    // ----------------------------------------------------
    // Control de Sub-pestañas (El Espacio vs Nuestro Menú)
    const cafeTabBtns = document.querySelectorAll('.cafe-tab-btn');
    const cafeSubviews = document.querySelectorAll('.cafe-subview');

    cafeTabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            cafeTabBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const selectedTab = e.target.getAttribute('data-cafe-tab');

            cafeSubviews.forEach(view => {
                if (view.getAttribute('id') === `cafe-subview-${selectedTab}`) {
                    view.classList.add('active');
                } else {
                    view.classList.remove('active');
                }
            });
        });
    });

    // Configurar enlaces de WhatsApp y eventos de formulario para Spots (Ambientes)
    const spotCards = document.querySelectorAll('.cafe-spot-card');
    spotCards.forEach(card => {
        const spotName = card.querySelector('h5').textContent;
        const waBtn = card.querySelector('.btn-spot-wa');
        const formBtn = card.querySelector('.btn-spot-form');

        // Configurar WhatsApp
        if (waBtn) {
            const textMessage = `Hola KAFË & Coworking, estoy interesado en consultar la disponibilidad, capacidad y tarifas de su espacio "%2A${spotName}%2A" para trabajar de forma remota o realizar una actividad.`;
            waBtn.setAttribute('href', `https://wa.me/50686737455?text=${textMessage}`);
        }

        // Configurar Formulario
        if (formBtn) {
            formBtn.addEventListener('click', () => {
                changeSector('cafe');

                const formSection = document.getElementById('contacto-form');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                }

                if (contactMessage) {
                    contactMessage.value = `Hola Kenmar, estoy cotizando un sitio web para mi cafetería o espacio de co-working. Me gustó mucho el visualizador aesthetic de ambientes, en especial la tarjeta de: "${spotName}".`;
                }
            });
        }
    });

    // Configurar enlaces de WhatsApp y eventos de formulario para Menú de Alimentos
    const menuItemCards = document.querySelectorAll('.menu-item-card');
    menuItemCards.forEach(card => {
        const itemName = card.getAttribute('data-menu-item');
        const itemPrice = card.getAttribute('data-menu-price');
        const waBtn = card.querySelector('.btn-menu-wa');
        const formBtn = card.querySelector('.btn-menu-form');

        // Configurar WhatsApp
        if (waBtn) {
            const textMessage = `Hola KAFË & Coworking, me gustaría consultar la disponibilidad del producto o paquete: "%2A${itemName}%2A" (Precio: ${itemPrice}) en su menú.`;
            waBtn.setAttribute('href', `https://wa.me/50686737455?text=${textMessage}`);
        }

        // Configurar Formulario
        if (formBtn) {
            formBtn.addEventListener('click', () => {
                changeSector('cafe');

                const formSection = document.getElementById('contacto-form');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                }

                if (contactMessage) {
                    contactMessage.value = `Hola Kenmar, me interesa diseñar una página web con un menú digital interactivo para mi negocio gourmet. Me gustaría incorporar una sección que cotice o muestre especialidades como: "${itemName}" (Precio estimado: ${itemPrice}).`;
                }
            });
        }
    });

    // ----------------------------------------------------
    // 6. Interacciones Mockup 4: TURISMO & AVENTURA
    // ----------------------------------------------------
    const tourAccordionHeaders = document.querySelectorAll('.tour-header-btn');
    
    tourAccordionHeaders.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.currentTarget.closest('.tour-accordion-item');
            const isOpen = item.classList.contains('open');
            
            // Cerrar todos los acordeones
            document.querySelectorAll('.tour-accordion-item').forEach(i => i.classList.remove('open'));
            
            // Si no estaba abierto, abrir este
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // Botones Reservar Tour
    const bookTourBtns = document.querySelectorAll('.btn-tour-book');
    bookTourBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tourName = e.target.getAttribute('data-tour');

            changeSector('turismo');

            const formSection = document.getElementById('contacto-form');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
            }

            if (contactMessage) {
                contactMessage.value = `Hola Kenmar, estoy interesado en cotizar un sitio web para mi empresa de turismo y me gusta el diseño adaptado para tours como: "${tourName}".`;
            }
        });
    });

    // ----------------------------------------------------
    // 8. Validación y Envío del Formulario en Tema Oscuro
    // ----------------------------------------------------
    const sectorsContactForm = document.getElementById('sectors-contact-form');
    const sectorsFormFeedback = document.getElementById('sectors-form-feedback');

    if (sectorsContactForm) {
        sectorsContactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('sectors-name');
            const emailInput = document.getElementById('sectors-email');
            const messageInput = document.getElementById('sectors-message');
            const submitBtn = sectorsContactForm.querySelector('.btn-submit');
            const submitBtnText = submitBtn.querySelector('span');

            // Validación simple
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                showSectorsFeedback('Por favor, rellena todos los campos obligatorios.', 'error');
                return;
            }

            // Simulación de envío
            submitBtn.disabled = true;
            const originalText = submitBtnText.textContent;
            submitBtnText.textContent = 'Enviando solicitud...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtnText.textContent = originalText;
                
                showSectorsFeedback('¡Solicitud enviada! Nos pondremos en contacto contigo en las próximas horas.', 'success');
                
                // Reiniciar formulario
                sectorsContactForm.reset();
                
                // Poner mensaje inicial para el sector activo
                const activeBtn = document.querySelector('.nav-sector-btn.active');
                const sectorId = activeBtn ? activeBtn.getAttribute('data-sector') : 'retail';
                if (contactMessage) {
                    contactMessage.value = sectorMessages[sectorId];
                }
            }, 1500);
        });
    }

    function showSectorsFeedback(message, type) {
        if (!sectorsFormFeedback) return;
        
        sectorsFormFeedback.textContent = message;
        sectorsFormFeedback.className = `form-feedback ${type}`; // Elimina 'hidden' y aplica clase success/error
        
        if (type === 'success') {
            setTimeout(() => {
                sectorsFormFeedback.className = 'form-feedback hidden';
            }, 6000);
        }
    }
});
