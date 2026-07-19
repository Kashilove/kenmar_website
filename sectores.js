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
    
    const hiddenSectorInput = document.getElementById('form-selected-sector');
    const contactMessage = document.getElementById('sectors-message');

    // Mensajes predeterminados del formulario para cada sector
    const sectorMessages = {
        turismo: 'Hola Kenmar, estoy interesado en una página web para el sector Turismo & Hospedaje.',
        cafe: 'Hola Kenmar, estoy interesado en una página web para el sector Café & Coworking.',
        agro: 'Hola Kenmar, estoy interesado en una página web para el sector Agro & Ganadería.',
        retail: 'Hola Kenmar, estoy interesado en una página web para el sector Ropa & Zapatería.'
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
    // ==========================================
    // VÍA MODA - LÓGICA DE CATEGORÍAS, FILTROS Y VARIANTES
    // ==========================================
    const viamodaCatBtns = document.querySelectorAll('.viamoda-cat-btn');
    const viamodaSubfilterBtns = document.querySelectorAll('.viamoda-subfilter-btn');
    const viamodaCards = document.querySelectorAll('.viamoda-card');
    const btnViamodaConsults = document.querySelectorAll('.btn-viamoda-consult');

    let currentViamodaCat = 'prendas';
    let currentViamodaTone = 'all';

    function filterViamodaCatalog() {
        viamodaCards.forEach(card => {
            const cardCat = card.getAttribute('data-cat');
            const cardTone = card.getAttribute('data-tone');

            const matchCat = cardCat === currentViamodaCat;
            const matchTone = currentViamodaTone === 'all' || cardTone === currentViamodaTone;

            if (matchCat && matchTone) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // Cambio de Pestaña Principal (Prendas de Vestir vs. Calzado)
    viamodaCatBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            viamodaCatBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            currentViamodaCat = e.target.getAttribute('data-viamoda-cat');
            filterViamodaCatalog();
        });
    });

    // Filtros Rápidos Interactivos (Tonos Neutros, Salmón, Todos)
    viamodaSubfilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            viamodaSubfilterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            currentViamodaTone = e.target.getAttribute('data-filter');
            filterViamodaCatalog();
        });
    });

    // Variantes de Color (Interactivas en las Fichas)
    viamodaCards.forEach(card => {
        const swatches = card.querySelectorAll('.swatch');
        swatches.forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                swatches.forEach(s => s.classList.remove('active'));
                e.target.classList.add('active');
                
                // Animación sutil de cambio de variante
                const img = card.querySelector('.card-img');
                if (img) {
                    img.style.opacity = '0.7';
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 200);
                }
            });
        });
    });

    // Botón Consultar por WhatsApp
    btnViamodaConsults.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemInfo = e.target.getAttribute('data-item');
            const textMessage = `Hola Vía Moda, me interesa consultar por la prenda/calzado: "%2A${itemInfo}%2A". ¿Me podrían brindar tallas disponibles y formas de compra?`;
            window.open(`https://wa.me/50686737455?text=${textMessage}`, '_blank');
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
    // 6. Interacciones Mockup 4: TURISMO & HOSPEDAJE (Eco-Lodge & Villas)
    // ----------------------------------------------------
    const resortModal = document.getElementById('resort-modal');
    const btnViewVillas = document.getElementById('btn-view-villas');
    const btnTabReserve = document.getElementById('btn-tab-reserve');
    const btnNavStay = document.getElementById('btn-nav-stay');
    const btnCloseResortModal = document.getElementById('btn-close-resort-modal');
    const microNavBtns = document.querySelectorAll('.micro-nav-btn');
    const villaTabPanes = document.querySelectorAll('.villa-tab-pane');

    // Función para abrir la Mini-Página Modal
    function openResortModal() {
        if (resortModal) {
            resortModal.style.display = 'flex';
            setTimeout(() => {
                resortModal.classList.add('active');
            }, 10);
        }
    }

    // Función para cerrar la Mini-Página Modal
    function closeResortModal() {
        if (resortModal) {
            resortModal.classList.remove('active');
            setTimeout(() => {
                resortModal.style.display = 'none';
            }, 300);
        }
    }

    // Eventos para abrir el modal
    if (btnViewVillas) btnViewVillas.addEventListener('click', openResortModal);
    if (btnTabReserve) btnTabReserve.addEventListener('click', openResortModal);
    if (btnNavStay) btnNavStay.addEventListener('click', openResortModal);

    // Buscador interactivo amigable
    const resortSearchInput = document.getElementById('resort-search-input');
    if (resortSearchInput) {
        resortSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = resortSearchInput.value.trim();
                if (query) {
                    const textMessage = `Hola Kenmar, me interesa cotizar una página web interactiva para mi resort/hotel y probé la búsqueda con la palabra: "%2A${query}%2A".`;
                    window.open(`https://wa.me/50686737455?text=${textMessage}`, '_blank');
                } else {
                    openResortModal();
                }
            }
        });
    }

    // Eventos para cerrar el modal
    if (btnCloseResortModal) btnCloseResortModal.addEventListener('click', closeResortModal);
    if (resortModal) {
        resortModal.addEventListener('click', (e) => {
            if (e.target === resortModal) {
                closeResortModal();
            }
        });
    }

    // Micro-Navegación de pestañas dentro de la Mini-Página Modal
    microNavBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            microNavBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const selectedTab = e.target.getAttribute('data-villa-tab');

            villaTabPanes.forEach(pane => {
                if (pane.getAttribute('id') === `villa-tab-${selectedTab}`) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });

    // Configuración de botones WhatsApp de Villas
    const villaWaBtns = document.querySelectorAll('.btn-villa-wa');
    villaWaBtns.forEach(btn => {
        const villaInfo = btn.getAttribute('data-villa');
        const textMessage = `Hola Exotica Eco-Lodge, me interesa consultar la disponibilidad y reservar la categoría: "%2A${villaInfo}%2A".`;
        btn.setAttribute('href', `https://wa.me/50686737455?text=${textMessage}`);
        btn.setAttribute('target', '_blank');
        btn.setAttribute('rel', 'noopener noreferrer');
    });

    // Configuración de botones de Consulta de Villas por WhatsApp
    const villaFormBtns = document.querySelectorAll('.btn-villa-form');
    villaFormBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const villaInfo = e.target.getAttribute('data-villa');
            const textMessage = `Hola Kenmar, me interesa cotizar un sitio web interactivo como el demo de Exotica Eco-Lodge para mi hotel/resort. Me gustó la villa: "%2A${villaInfo}%2A".`;
            window.open(`https://wa.me/50686737455?text=${textMessage}`, '_blank');
        });
    });

    // Módulo de Disponibilidad del Modal
    const btnSubmitResortAvail = document.getElementById('btn-submit-resort-avail');
    if (btnSubmitResortAvail) {
        btnSubmitResortAvail.addEventListener('click', () => {
            const checkin = document.getElementById('resort-checkin').value;
            const checkout = document.getElementById('resort-checkout').value;
            const villaSelect = document.getElementById('resort-villa-select').value;
            const textMessage = `Hola Kenmar, deseo cotizar una página web para mi resort con motor de reservas instantáneo. Mi prueba de reserva en el demo fue: Check-in ${checkin}, Check-out ${checkout}, Villa: "%2A${villaSelect}%2A".`;
            window.open(`https://wa.me/50686737455?text=${textMessage}`, '_blank');
        });
    }

    // ==========================================
    // ALMOREA CAFÉ - LÓGICA DE MENÚ Y CATEGORÍAS
    // ==========================================
    const btnOpenAlmoreaMenu = document.getElementById('btn-open-almorea-menu');
    const btnCloseAlmoreaModal = document.getElementById('btn-close-almorea-modal');
    const almoreaMenuModal = document.getElementById('almorea-menu-modal');
    const almoreaCatBtns = document.querySelectorAll('.almorea-cat-btn');
    const almoreaDishCards = document.querySelectorAll('.almorea-dish-card');

    function openAlmoreaModal() {
        if (almoreaMenuModal) {
            almoreaMenuModal.style.display = 'flex';
            setTimeout(() => {
                almoreaMenuModal.classList.add('active');
            }, 10);
        }
    }

    function closeAlmoreaModal() {
        if (almoreaMenuModal) {
            almoreaMenuModal.classList.remove('active');
            setTimeout(() => {
                almoreaMenuModal.style.display = 'none';
            }, 300);
        }
    }

    if (btnOpenAlmoreaMenu) btnOpenAlmoreaMenu.addEventListener('click', openAlmoreaModal);
    if (btnCloseAlmoreaModal) btnCloseAlmoreaModal.addEventListener('click', closeAlmoreaModal);
    if (almoreaMenuModal) {
        almoreaMenuModal.addEventListener('click', (e) => {
            if (e.target === almoreaMenuModal) {
                closeAlmoreaModal();
            }
        });
    }

    // Filtrado por categorías de Almorea Café
    almoreaCatBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            almoreaCatBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const category = e.target.getAttribute('data-cafe-cat');

            almoreaDishCards.forEach(card => {
                if (card.getAttribute('data-cat') === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ===============================================
    // AGROSANCARLOS - LÓGICA DE MENÚ TRANSPARENTE Y FILTRADO INLINE
    // ===============================================
    const agroNavItems = document.querySelectorAll('.agro-nav-item');
    const agroFilterBtns = document.querySelectorAll('.agro-filter-btn');
    const agroInlineCards = document.querySelectorAll('.agro-inline-card');
    const btnAgroInlineQuotes = document.querySelectorAll('.btn-agro-inline-quote');
    const btnAgroDirectQuote = document.getElementById('btn-agro-direct-quote');

    function filterAgroCards(category) {
        agroInlineCards.forEach(card => {
            if (category === 'all' || category === 'todos' || card.getAttribute('data-cat') === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // Eventos del Menú Transparente Superior
    agroNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.id === 'btn-agro-direct-quote') return; // CTA button handled separately
            agroNavItems.forEach(i => i.classList.remove('active'));
            e.target.classList.add('active');

            const tab = e.target.getAttribute('data-agro-tab');
            
            // Sync with filter buttons
            agroFilterBtns.forEach(btn => {
                if (btn.getAttribute('data-filter') === tab || (tab === 'todos' && btn.getAttribute('data-filter') === 'all')) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            filterAgroCards(tab);
        });
    });

    // Eventos de los Botones de Filtro Inline
    agroFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            agroFilterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const filter = e.target.getAttribute('data-filter');

            // Sync with top nav
            agroNavItems.forEach(nav => {
                if (nav.getAttribute('data-agro-tab') === filter || (filter === 'all' && nav.getAttribute('data-agro-tab') === 'todos')) {
                    nav.classList.add('active');
                } else {
                    nav.classList.remove('active');
                }
            });

            filterAgroCards(filter);
        });
    });

    // Cotización Directa desde cada Tarjeta Inline
    btnAgroInlineQuotes.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const product = e.target.getAttribute('data-product');
            const textMessage = `Hola AgroInsumos, me interesa cotizar el insumo agrícola: "%2A${product}%2A". ¿Me podrían brindar disponibilidad y precio para finca?`;
            window.open(`https://wa.me/50686737455?text=${textMessage}`, '_blank');
        });
    });

    // Botón de Cotización Directa en el Menú Superior
    if (btnAgroDirectQuote) {
        btnAgroDirectQuote.addEventListener('click', () => {
            const textMessage = `Hola AgroInsumos, deseo cotizar insumos agrícolas y recibir asesoría técnica para mi finca.`;
            window.open(`https://wa.me/50686737455?text=${textMessage}`, '_blank');
        });
    }
});
