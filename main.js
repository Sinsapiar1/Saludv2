// main.js - Funcionalidad principal mejorada con Microsoft Clarity

// ===== CONFIGURACIÓN INICIAL =====
const CONFIG = {
    // Microsoft Clarity - Reemplaza con tu Project ID real
    clarityProjectId: 'CLARITY_PROJECT_ID',
    
    // URLs de afiliados - Reemplaza con tus enlaces reales
    affiliateLinks: {
        'hero-main-cta': 'https://affiliate-link-1.com',
        'benefit-1-link': 'https://affiliate-link-2.com',
        'benefit-2-link': 'https://affiliate-link-3.com',
        'benefit-3-link': 'https://affiliate-link-4.com',
        'feature-1-link': 'https://affiliate-link-5.com',
        'feature-2-link': 'https://affiliate-link-6.com',
        'testimonial-cta': 'https://affiliate-link-7.com',
        'final-main-cta': 'https://affiliate-link-8.com'
    },
    
    // URL de video para el modal
    videoUrl: 'https://www.youtube.com/embed/VIDEO_ID',
    
    // URL del script de Google Apps para tracking
    trackingScriptUrl: 'https://script.google.com/macros/s/AKfycbxwebyRv2SM_k6BXLLW3KVZYBFW1cwG5ENZ-yfPXcaujtrQoA5bJaqjK2VpaawkTwmKDg/exec'
};

// ===== MICROSOFT CLARITY INTEGRATION =====
class ClarityIntegration {
    constructor() {
        this.isInitialized = false;
        this.init();
    }
    
    init() {
        // Verificar si Clarity ya está cargado
        if (typeof clarity !== 'undefined') {
            this.isInitialized = true;
            this.setupCustomTracking();
        } else {
            // Esperar a que Clarity se cargue
            this.waitForClarity();
        }
    }
    
    waitForClarity() {
        let attempts = 0;
        const maxAttempts = 50; // 5 segundos máximo
        
        const checkClarity = () => {
            attempts++;
            if (typeof clarity !== 'undefined') {
                this.isInitialized = true;
                this.setupCustomTracking();
                console.log('Microsoft Clarity loaded successfully');
            } else if (attempts < maxAttempts) {
                setTimeout(checkClarity, 100);
            } else {
                console.warn('Microsoft Clarity failed to load');
            }
        };
        
        checkClarity();
    }
    
    setupCustomTracking() {
        if (!this.isInitialized) return;
        
        // Configurar eventos personalizados de Clarity
        this.trackPageSections();
        this.trackUserEngagement();
        this.trackFormInteractions();
        this.trackCTAClicks();
    }
    
    // Seguimiento de secciones visibles
    trackPageSections() {
        const sections = document.querySelectorAll('section[id]');
        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0.3
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.id || entry.target.className;
                    this.track('SectionView', { section: sectionName });
                }
            });
        }, observerOptions);
        
        sections.forEach(section => sectionObserver.observe(section));
    }
    
    // Seguimiento de engagement del usuario
    trackUserEngagement() {
        let scrollDepth = 0;
        let timeOnPage = 0;
        let startTime = Date.now();
        
        // Profundidad de scroll
        window.addEventListener('scroll', this.throttle(() => {
            const currentScroll = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (currentScroll > scrollDepth && currentScroll % 25 === 0) {
                scrollDepth = currentScroll;
                this.track('ScrollDepth', { depth: scrollDepth });
            }
        }, 100));
        
        // Tiempo en página
        setInterval(() => {
            timeOnPage = Math.floor((Date.now() - startTime) / 1000);
            if (timeOnPage % 30 === 0 && timeOnPage > 0) {
                this.track('TimeOnPage', { seconds: timeOnPage });
            }
        }, 1000);
        
        // Detección de inactividad
        let inactivityTimer;
        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                this.track('UserInactive', { timeBeforeInactive: timeOnPage });
            }, 30000); // 30 segundos de inactividad
        };
        
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetInactivityTimer, true);
        });
        
        resetInactivityTimer();
    }
    
    // Seguimiento de interacciones con formularios
    trackFormInteractions() {
        // Seguimiento de campos de entrada (si los hay)
        document.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('focus', () => {
                this.track('FormFieldFocus', { 
                    fieldType: field.type || field.tagName.toLowerCase(),
                    fieldName: field.name || field.id || 'unnamed'
                });
            });
            
            field.addEventListener('blur', () => {
                this.track('FormFieldBlur', { 
                    fieldType: field.type || field.tagName.toLowerCase(),
                    fieldName: field.name || field.id || 'unnamed',
                    hasValue: field.value.length > 0
                });
            });
        });
    }
    
    // Seguimiento de clics en CTAs
    trackCTAClicks() {
        document.querySelectorAll('[data-clarity-track]').forEach(element => {
            element.addEventListener('click', (e) => {
                const trackingData = element.getAttribute('data-clarity-track');
                const linkId = element.getAttribute('data-link-id') || 'unknown';
                
                this.track('CTAClick', {
                    element: trackingData,
                    linkId: linkId,
                    text: element.textContent.trim().substring(0, 50),
                    position: this.getElementPosition(element)
                });
            });
        });
    }
    
    // Función principal para enviar eventos a Clarity
    track(eventName, data = {}) {
        if (!this.isInitialized || typeof clarity === 'undefined') {
            console.warn('Clarity not initialized, event not tracked:', eventName);
            return;
        }
        
        try {
            // Enviar evento personalizado a Clarity
            clarity('set', eventName, JSON.stringify({
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent.substring(0, 100),
                ...data
            }));
            
            console.log(`Clarity event tracked: ${eventName}`, data);
        } catch (error) {
            console.error('Error tracking Clarity event:', error);
        }
    }
    
    // Utilidades
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: Math.round(rect.left + rect.width / 2),
            y: Math.round(rect.top + rect.height / 2),
            section: this.findParentSection(element)
        };
    }
    
    findParentSection(element) {
        let current = element;
        while (current && current !== document.body) {
            if (current.tagName === 'SECTION') {
                return current.id || current.className || 'unknown-section';
            }
            current = current.parentElement;
        }
        return 'no-section';
    }
}

// ===== FUNCIONALIDAD PRINCIPAL =====
class VitalLifeLandingPage {
    constructor() {
        this.clarity = new ClarityIntegration();
        this.isLoaded = false;
        this.init();
    }
    
    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        this.setupLoadingScreen();
        this.setupScrollProgress();
        this.setupNavigation();
        this.setupHeroAnimations();
        this.setupVideoModal();
        this.setupAffiliateTracking();
        this.setupIntersectionObservers();
        this.setupPerformanceTracking();
        this.setupExitIntent();
        this.isLoaded = true;
        
        console.log('VitalLife Landing Page initialized successfully');
    }
    
    // ===== LOADING SCREEN =====
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        
        // Simular tiempo de carga
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                document.body.classList.remove('no-scroll');
                
                // Remover el loading screen del DOM después de la animación
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }
        }, 1500);
    }
    
    // ===== BARRA DE PROGRESO =====
    setupScrollProgress() {
        const progressBar = document.querySelector('.progress-bar');
        
        if (progressBar) {
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / scrollHeight) * 100;
                
                progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
            });
        }
    }
    
    // ===== NAVEGACIÓN =====
    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        
        if (navbar) {
            // Mostrar navbar al hacer scroll
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    navbar.classList.add('visible');
                } else {
                    navbar.classList.remove('visible');
                }
            });
            
            // Smooth scroll para los enlaces de navegación
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Tracking de navegación
                        this.clarity.track('NavigationClick', {
                            target: targetId,
                            text: link.textContent.trim()
                        });
                    }
                });
            });
        }
    }
    
    // ===== ANIMACIONES DEL HERO =====
    setupHeroAnimations() {
        // Animación de las estadísticas
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
            const suffix = finalValue.replace(/[\d]/g, '');
            
            if (numericValue) {
                this.animateCounter(stat, 0, numericValue, 2000, suffix);
            }
        });
        
        // Efecto parallax en elementos flotantes
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.float-element');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    // ===== MODAL DE VIDEO =====
    setupVideoModal() {
        const videoBtn = document.getElementById('watchVideoBtn');
        const videoModal = document.getElementById('videoModal');
        const modalClose = document.querySelector('.modal-close');
        const iframe = videoModal?.querySelector('iframe');
        
        if (videoBtn && videoModal) {
            videoBtn.addEventListener('click', () => {
                if (iframe) {
                    iframe.src = CONFIG.videoUrl;
                }
                videoModal.style.display = 'block';
                document.body.classList.add('no-scroll');
                
                // Tracking de apertura de video
                this.clarity.track('VideoModalOpen', {
                    trigger: 'hero-video-button'
                });
            });
            
            const closeModal = () => {
                videoModal.style.display = 'none';
                document.body.classList.remove('no-scroll');
                if (iframe) {
                    iframe.src = '';
                }
                
                // Tracking de cierre de video
                this.clarity.track('VideoModalClose');
            };
            
            modalClose?.addEventListener('click', closeModal);
            
            videoModal.addEventListener('click', (e) => {
                if (e.target === videoModal) {
                    closeModal();
                }
            });
            
            // Cerrar modal con ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && videoModal.style.display === 'block') {
                    closeModal();
                }
            });
        }
    }
    
    // ===== TRACKING DE AFILIADOS =====
    setupAffiliateTracking() {
        document.querySelectorAll('.affiliate-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const linkId = link.getAttribute('data-link-id') || 'unknown';
                const linkUrl = link.getAttribute('href');
                const linkText = link.textContent.trim();
                
                // Tracking completo del clic
                this.trackAffiliateClick({
                    linkId: linkId,
                    linkUrl: linkUrl,
                    linkText: linkText,
                    sectionId: this.findParentSection(link),
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    referrer: document.referrer,
                    pageUrl: window.location.href
                });
                
                // Tracking en Clarity
                this.clarity.track('AffiliateClick', {
                    linkId: linkId,
                    linkText: linkText.substring(0, 50),
                    section: this.findParentSection(link)
                });
                
                // Pequeño retraso para asegurar que el tracking se envíe
                e.preventDefault();
                setTimeout(() => {
                    window.open(linkUrl, '_blank');
                }, 100);
            });
        });
    }
    
    // ===== INTERSECTION OBSERVERS =====
    setupIntersectionObservers() {
        // Observador para animaciones al entrar en vista
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Tracking de visibilidad de sección
                    this.clarity.track('SectionVisible', {
                        section: entry.target.id || entry.target.className
                    });
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observar secciones principales
        document.querySelectorAll('section, .benefit-card, .testimonial-card, .feature-item').forEach(el => {
            animationObserver.observe(el);
        });
        
        // Observador específico para el pricing
        const pricingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.clarity.track('PricingSectionView', {
                        timeOnPage: Math.floor((Date.now() - this.pageStartTime) / 1000)
                    });
                }
            });
        }, { threshold: 0.5 });
        
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
            pricingObserver.observe(pricingSection);
        }
    }
    
    // ===== TRACKING DE RENDIMIENTO =====
    setupPerformanceTracking() {
        this.pageStartTime = Date.now();
        
        // Métricas de rendimiento al cargar
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (window.performance && window.performance.timing) {
                    const timing = window.performance.timing;
                    const performanceData = {
                        loadTime: timing.loadEventEnd - timing.navigationStart,
                        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                        firstPaint: this.getFirstPaint(),
                        connection: this.getConnectionInfo()
                    };
                    
                    this.clarity.track('PerformanceMetrics', performanceData);
                    
                    // Tracking adicional con sistema interno
                    this.trackEvent('page_performance', performanceData);
                }
            }, 1000);
        });
        
        // Web Vitals
        this.trackWebVitals();
    }
    
    // ===== EXIT INTENT =====
    setupExitIntent() {
        let exitIntentShown = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentShown) {
                exitIntentShown = true;
                
                // Tracking de exit intent
                this.clarity.track('ExitIntent', {
                    timeOnPage: Math.floor((Date.now() - this.pageStartTime) / 1000),
                    scrollDepth: Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
                });
                
                // Aquí podrías mostrar un modal de exit intent
                // showExitIntentModal();
            }
        });
    }
    
    // ===== UTILIDADES =====
    animateCounter(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * this.easeOutQuart(progress));
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    findParentSection(element) {
        let current = element;
        while (current && current !== document.body) {
            if (current.tagName === 'SECTION') {
                return current.id || current.className || 'unknown-section';
            }
            current = current.parentElement;
        }
        return 'no-section';
    }
    
    getFirstPaint() {
        try {
            const paintEntries = performance.getEntriesByType('paint');
            const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
            return firstPaint ? Math.round(firstPaint.startTime) : null;
        } catch (error) {
            return null;
        }
    }
    
    getConnectionInfo() {
        try {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            return connection ? {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt
            } : null;
        } catch (error) {
            return null;
        }
    }
    
    trackWebVitals() {
        // Simplified Web Vitals tracking
        try {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.clarity.track('WebVital_LCP', {
                    value: Math.round(lastEntry.startTime),
                    element: lastEntry.element?.tagName || 'unknown'
                });
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    this.clarity.track('WebVital_FID', {
                        value: Math.round(entry.processingStart - entry.startTime)
                    });
                });
            }).observe({ entryTypes: ['first-input'] });
            
        } catch (error) {
            console.warn('Web Vitals tracking not supported:', error);
        }
    }
    
    // ===== TRACKING INTERNO =====
    trackEvent(eventType, eventData = {}) {
        const payload = {
            timestamp: new Date().toISOString(),
            eventType: eventType,
            url: window.location.href,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            ...eventData
        };
        
        // Enviar a Google Apps Script
        fetch(CONFIG.trackingScriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        }).catch(error => {
            console.error('Error sending tracking data:', error);
        });
        
        // También enviar a otros sistemas de tracking si están disponibles
        if (typeof fbq === 'function') {
            fbq('trackCustom', eventType, eventData);
        }
        
        if (typeof gtag === 'function') {
            gtag('event', eventType, eventData);
        }
    }
    
    trackAffiliateClick(data) {
        this.trackEvent('affiliate_click', data);
    }
}

// ===== LANGUAGE SWITCHING =====
class LanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.init();
    }
    
    init() {
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }
        
        // Cargar idioma guardado
        const savedLang = localStorage.getItem('vitallife_language');
        if (savedLang && savedLang !== 'en') {
            this.setLanguage(savedLang);
        }
    }
    
    toggleLanguage() {
        const newLang = this.currentLang === 'en' ? 'es' : 'en';
        this.setLanguage(newLang);
    }
    
    setLanguage(lang) {
        this.currentLang = lang;
        
        // Actualizar elementos de idioma
        document.querySelectorAll('.lang-en').forEach(el => {
            el.style.display = lang === 'en' ? 'inline' : 'none';
        });
        
        document.querySelectorAll('.lang-es').forEach(el => {
            el.style.display = lang === 'es' ? 'inline' : 'none';
        });
        
        // Actualizar botón de idioma
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.setAttribute('data-lang', lang);
        }
        
        // Guardar preferencia
        localStorage.setItem('vitallife_language', lang);
        
        // Tracking de cambio de idioma
        if (window.vitalLifePage) {
            window.vitalLifePage.clarity.track('LanguageChange', { 
                language: lang === 'en' ? 'english' : 'spanish'
            });
            
            window.vitalLifePage.trackEvent('language_change', { 
                language: lang === 'en' ? 'english' : 'spanish'
            });
        }
    }
}

// ===== INICIALIZACIÓN =====
// Inicializar la página cuando el DOM esté listo
window.vitalLifePage = new VitalLifeLandingPage();
window.languageManager = new LanguageManager();

// Tracking de carga inicial
window.addEventListener('load', () => {
    if (window.vitalLifePage) {
        window.vitalLifePage.trackEvent('page_load', {
            loadTime: Math.round(performance.now()),
            timestamp: new Date().toISOString()
        });
    }
});

// Tracking de salida de página
window.addEventListener('beforeunload', () => {
    if (window.vitalLifePage) {
        const timeOnPage = Math.floor((Date.now() - window.vitalLifePage.pageStartTime) / 1000);
        window.vitalLifePage.trackEvent('page_exit', {
            timeOnPage: timeOnPage,
            scrollDepth: Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
        });
    }
});

// ===== DESARROLLO - CONSOLA HELPER =====
if (typeof window !== 'undefined') {
    window.VitalLifeDebug = {
        trackEvent: (eventType, data) => {
            if (window.vitalLifePage) {
                window.vitalLifePage.trackEvent(eventType, data);
            }
        },
        clarityTrack: (eventName, data) => {
            if (window.vitalLifePage) {
                window.vitalLifePage.clarity.track(eventName, data);
            }
        },
        setLanguage: (lang) => {
            if (window.languageManager) {
                window.languageManager.setLanguage(lang);
            }
        },
        getPageData: () => {
            return {
                currentLang: window.languageManager?.currentLang,
                isLoaded: window.vitalLifePage?.isLoaded,
                clarityInitialized: window.vitalLifePage?.clarity?.isInitialized
            };
        }
    };
}