// meta-pixel.js - Meta Pixel mejorado con eventos avanzados

// ===== CONFIGURACIÓN =====
const META_CONFIG = {
    // Reemplaza 'YOUR_PIXEL_ID' con tu ID real del Píxel de Meta
    pixelId: 'YOUR_PIXEL_ID',
    
    // Configuración de eventos estándar
    standardEvents: {
        pageView: 'PageView',
        viewContent: 'ViewContent',
        addToCart: 'AddToCart',
        initiateCheckout: 'InitiateCheckout',
        purchase: 'Purchase',
        lead: 'Lead',
        completeRegistration: 'CompleteRegistration',
        contact: 'Contact',
        schedule: 'Schedule'
    },
    
    // Configuración de productos
    productInfo: {
        content_ids: ['vitallife_premium'],
        content_name: 'VitalLife Premium Supplement',
        content_category: 'Health & Wellness',
        content_type: 'product',
        currency: 'USD',
        value: 59.99
    }
};

// ===== CLASE PRINCIPAL DE META PIXEL =====
class MetaPixelManager {
    constructor() {
        this.isInitialized = false;
        this.eventsQueue = [];
        this.userEngagementScore = 0;
        this.sessionStartTime = Date.now();
        this.scrollDepthTracked = new Set();
        this.timeThresholds = [10, 30, 60, 120, 300]; // segundos
        this.timeThresholdsTracked = new Set();
        
        this.init();
    }
    
    init() {
        this.loadMetaPixel();
        this.setupEventListeners();
        this.setupAdvancedTracking();
        this.processQueuedEvents();
    }
    
    // ===== CARGA DEL META PIXEL =====
    loadMetaPixel() {
        // Código base del Meta Pixel
        !function(f,b,e,v,n,t,s) {
            if(f.fbq) return;
            n=f.fbq=function(){
                n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
            };
            if(!f._fbq) f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s);
        }(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        // Inicializar el pixel
        fbq('init', META_CONFIG.pixelId);
        
        // Configuración avanzada
        fbq('set', 'autoConfig', true, META_CONFIG.pixelId);
        fbq('set', 'firstPartyTracking', true, META_CONFIG.pixelId);
        
        // Evento PageView inicial
        fbq('track', META_CONFIG.standardEvents.pageView, {
            content_name: document.title,
            content_category: 'Landing Page',
            source: 'organic',
            timestamp: new Date().toISOString()
        });
        
        this.isInitialized = true;
        console.log('Meta Pixel initialized successfully');
        
        // Evento ViewContent inicial
        this.trackViewContent();
    }
    
    // ===== CONFIGURACIÓN DE EVENT LISTENERS =====
    setupEventListeners() {
        // Tracking de CTAs principales
        this.trackMainCTAs();
        
        // Tracking de engagement
        this.trackUserEngagement();
        
        // Tracking de formularios
        this.trackFormInteractions();
        
        // Tracking de video
        this.trackVideoInteractions();
        
        // Tracking de scroll y tiempo
        this.trackScrollAndTime();
        
        // Tracking de exit intent
        this.trackExitIntent();
    }
    
    // ===== TRACKING DE CTAS PRINCIPALES =====
    trackMainCTAs() {
        // CTAs principales que indican intención de compra
        const mainCTAs = document.querySelectorAll('[data-link-id*="main-cta"], [data-link-id*="final-cta"]');
        
        mainCTAs.forEach(cta => {
            cta.addEventListener('click', (e) => {
                const linkId = cta.getAttribute('data-link-id');
                const section = this.findParentSection(cta);
                
                // Evento Lead para CTAs principales
                this.trackEvent(META_CONFIG.standardEvents.lead, {
                    content_name: META_CONFIG.productInfo.content_name,
                    content_category: META_CONFIG.productInfo.content_category,
                    content_ids: META_CONFIG.productInfo.content_ids,
                    currency: META_CONFIG.productInfo.currency,
                    value: META_CONFIG.productInfo.value,
                    lead_type: 'product_interest',
                    source: section,
                    button_id: linkId,
                    engagement_score: this.userEngagementScore
                });
                
                // También trackear como InitiateCheckout
                this.trackEvent(META_CONFIG.standardEvents.initiateCheckout, {
                    content_name: META_CONFIG.productInfo.content_name,
                    content_ids: META_CONFIG.productInfo.content_ids,
                    content_type: META_CONFIG.productInfo.content_type,
                    currency: META_CONFIG.productInfo.currency,
                    value: META_CONFIG.productInfo.value,
                    num_items: 1
                });
                
                console.log(`Meta Pixel: Lead tracked for ${linkId}`);
            });
        });
        
        // CTAs secundarios
        const secondaryCTAs = document.querySelectorAll('.affiliate-link:not([data-link-id*="main-cta"]):not([data-link-id*="final-cta"])');
        
        secondaryCTAs.forEach(cta => {
            cta.addEventListener('click', (e) => {
                const linkId = cta.getAttribute('data-link-id');
                const section = this.findParentSection(cta);
                
                this.trackCustomEvent('SecondaryInteraction', {
                    button_id: linkId,
                    section: section,
                    engagement_score: this.userEngagementScore,
                    interaction_type: 'secondary_cta'
                });
            });
        });
    }
    
    // ===== TRACKING DE ENGAGEMENT =====
    trackUserEngagement() {
        // Sistema de puntuación de engagement
        let interactions = 0;
        
        // Incrementar score por diferentes acciones
        document.addEventListener('click', () => {
            interactions++;
            this.userEngagementScore += 1;
        });
        
        document.addEventListener('scroll', this.throttle(() => {
            this.userEngagementScore += 0.1;
        }, 1000));
        
        // Tracking de high engagement
        setInterval(() => {
            if (this.userEngagementScore >= 50 && !this.highEngagementTracked) {
                this.highEngagementTracked = true;
                
                this.trackCustomEvent('HighEngagement', {
                    engagement_score: Math.round(this.userEngagementScore),
                    time_on_page: Math.floor((Date.now() - this.sessionStartTime) / 1000),
                    interactions: interactions
                });
            }
        }, 5000);
    }
    
    // ===== TRACKING DE FORMULARIOS =====
    trackFormInteractions() {
        // Email inputs (newsletter, contact forms, etc.)
        document.querySelectorAll('input[type="email"]').forEach(input => {
            let focused = false;
            
            input.addEventListener('focus', () => {
                if (!focused) {
                    focused = true;
                    this.trackCustomEvent('FormStart', {
                        form_type: 'email_capture',
                        field_type: 'email'
                    });
                }
            });
            
            input.addEventListener('input', this.debounce(() => {
                if (this.isValidEmail(input.value)) {
                    this.trackEvent(META_CONFIG.standardEvents.lead, {
                        content_name: 'Email Signup',
                        content_category: 'Newsletter',
                        lead_type: 'email_provided',
                        currency: META_CONFIG.productInfo.currency,
                        value: 5 // Valor estimado de un email
                    });
                }
            }, 1000));
        });
        
        // Form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const formType = this.getFormType(form);
                
                this.trackEvent(META_CONFIG.standardEvents.completeRegistration, {
                    content_name: `Form Submission - ${formType}`,
                    content_category: 'Form',
                    registration_method: formType,
                    currency: META_CONFIG.productInfo.currency,
                    value: 10
                });
            });
        });
    }
    
    // ===== TRACKING DE VIDEO =====
    trackVideoInteractions() {
        const videoBtn = document.getElementById('watchVideoBtn');
        const videoModal = document.getElementById('videoModal');
        
        if (videoBtn) {
            videoBtn.addEventListener('click', () => {
                this.trackCustomEvent('VideoInteraction', {
                    action: 'play_attempt',
                    video_title: 'VitalLife Product Demo',
                    video_position: 'hero'
                });
                
                // Incrementar engagement score significativamente
                this.userEngagementScore += 15;
            });
        }
        
        if (videoModal) {
            // Observer para detectar cuando se abre el modal
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const isVisible = videoModal.style.display === 'block';
                        if (isVisible) {
                            this.trackCustomEvent('VideoModalOpen', {
                                video_title: 'VitalLife Product Demo',
                                engagement_score: this.userEngagementScore
                            });
                        }
                    }
                });
            });
            
            observer.observe(videoModal, { attributes: true });
        }
    }
    
    // ===== TRACKING DE SCROLL Y TIEMPO =====
    trackScrollAndTime() {
        // Scroll depth tracking
        const scrollThresholds = [25, 50, 75, 90];
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            scrollThresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !this.scrollDepthTracked.has(threshold)) {
                    this.scrollDepthTracked.add(threshold);
                    
                    this.trackCustomEvent('ScrollDepth', {
                        scroll_depth: threshold,
                        content_name: document.title,
                        engagement_score: this.userEngagementScore
                    });
                    
                    // Incrementar engagement score
                    this.userEngagementScore += 5;
                }
            });
        }, 200));
        
        // Time on page tracking
        setInterval(() => {
            const timeOnPage = Math.floor((Date.now() - this.sessionStartTime) / 1000);
            
            this.timeThresholds.forEach(threshold => {
                if (timeOnPage >= threshold && !this.timeThresholdsTracked.has(threshold)) {
                    this.timeThresholdsTracked.add(threshold);
                    
                    this.trackCustomEvent('TimeOnPage', {
                        time_threshold: threshold,
                        actual_time: timeOnPage,
                        engagement_score: this.userEngagementScore,
                        scroll_depth: this.getCurrentScrollDepth()
                    });
                    
                    // Incrementar engagement score por tiempo
                    this.userEngagementScore += 3;
                }
            });
        }, 1000);
    }
    
    // ===== TRACKING DE EXIT INTENT =====
    trackExitIntent() {
        let exitIntentTracked = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentTracked) {
                exitIntentTracked = true;
                
                const timeOnPage = Math.floor((Date.now() - this.sessionStartTime) / 1000);
                
                this.trackCustomEvent('ExitIntent', {
                    time_on_page: timeOnPage,
                    scroll_depth: this.getCurrentScrollDepth(),
                    engagement_score: this.userEngagementScore,
                    exit_trigger: 'mouse_leave'
                });
                
                // Si el usuario tiene alto engagement, trackear como lead potencial
                if (this.userEngagementScore >= 30) {
                    this.trackEvent(META_CONFIG.standardEvents.lead, {
                        content_name: 'Exit Intent - High Engagement',
                        content_category: 'Behavioral',
                        lead_type: 'exit_intent_qualified',
                        currency: META_CONFIG.productInfo.currency,
                        value: 15
                    });
                }
            }
        });
    }
    
    // ===== TRACKING AVANZADO =====
    setupAdvancedTracking() {
        // Tracking de secciones vistas
        this.setupSectionTracking();
        
        // Tracking de rendimiento
        this.setupPerformanceTracking();
        
        // Tracking de errores
        this.setupErrorTracking();
        
        // Tracking de dispositivo y conexión
        this.trackDeviceInfo();
    }
    
    setupSectionTracking() {
        const sections = document.querySelectorAll('section[id]');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.id;
                    
                    this.trackCustomEvent('SectionView', {
                        section_name: sectionName,
                        engagement_score: this.userEngagementScore,
                        time_to_reach: Math.floor((Date.now() - this.sessionStartTime) / 1000)
                    });
                    
                    // Incrementar engagement por llegar a secciones importantes
                    if (['pricing', 'results', 'guarantee'].includes(sectionName)) {
                        this.userEngagementScore += 10;
                    } else {
                        this.userEngagementScore += 2;
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(section => sectionObserver.observe(section));
    }
    
    setupPerformanceTracking() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (window.performance && window.performance.timing) {
                    const timing = window.performance.timing;
                    const loadTime = timing.loadEventEnd - timing.navigationStart;
                    
                    this.trackCustomEvent('PagePerformance', {
                        load_time: loadTime,
                        connection_type: this.getConnectionType(),
                        device_type: this.getDeviceType()
                    });
                }
            }, 1000);
        });
    }
    
    setupErrorTracking() {
        window.addEventListener('error', (e) => {
            this.trackCustomEvent('JavaScriptError', {
                error_message: e.message.substring(0, 100),
                error_filename: e.filename,
                error_line: e.lineno,
                user_agent: navigator.userAgent.substring(0, 100)
            });
        });
    }
    
    // ===== EVENTOS ESPECÍFICOS =====
    trackViewContent() {
        this.trackEvent(META_CONFIG.standardEvents.viewContent, {
            content_ids: META_CONFIG.productInfo.content_ids,
            content_name: META_CONFIG.productInfo.content_name,
            content_category: META_CONFIG.productInfo.content_category,
            content_type: META_CONFIG.productInfo.content_type,
            currency: META_CONFIG.productInfo.currency,
            value: META_CONFIG.productInfo.value
        });
    }
    
    // ===== FUNCIONES PRINCIPALES =====
    trackEvent(eventName, parameters = {}) {
        if (!this.isInitialized) {
            this.eventsQueue.push({ eventName, parameters });
            return;
        }
        
        try {
            fbq('track', eventName, {
                ...parameters,
                timestamp: new Date().toISOString(),
                page_title: document.title,
                page_url: window.location.href
            });
            
            console.log(`Meta Pixel Event: ${eventName}`, parameters);
        } catch (error) {
            console.error('Error sending Meta Pixel event:', error);
        }
    }
    
    trackCustomEvent(eventName, parameters = {}) {
        if (!this.isInitialized) {
            this.eventsQueue.push({ eventName, parameters, custom: true });
            return;
        }
        
        try {
            fbq('trackCustom', eventName, {
                ...parameters,
                timestamp: new Date().toISOString(),
                page_title: document.title,
                page_url: window.location.href
            });
            
            console.log(`Meta Pixel Custom Event: ${eventName}`, parameters);
        } catch (error) {
            console.error('Error sending Meta Pixel custom event:', error);
        }
    }
    
    processQueuedEvents() {
        this.eventsQueue.forEach(({ eventName, parameters, custom }) => {
            if (custom) {
                this.trackCustomEvent(eventName, parameters);
            } else {
                this.trackEvent(eventName, parameters);
            }
        });
        
        this.eventsQueue = [];
    }
    
    // ===== UTILIDADES =====
    findParentSection(element) {
        let current = element;
        while (current && current !== document.body) {
            if (current.tagName === 'SECTION') {
                return current.id || current.className || 'unknown';
            }
            current = current.parentElement;
        }
        return 'no-section';
    }
    
    getCurrentScrollDepth() {
        return Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    getFormType(form) {
        if (form.querySelector('input[type="email"]')) return 'newsletter';
        if (form.querySelector('input[name*="contact"]')) return 'contact';
        if (form.querySelector('input[name*="phone"]')) return 'phone_capture';
        return 'generic';
    }
    
    getConnectionType() {
        try {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            return connection ? connection.effectiveType : 'unknown';
        } catch (error) {
            return 'unknown';
        }
    }
    
    getDeviceType() {
        const width = window.innerWidth;
        if (width <= 768) return 'mobile';
        if (width <= 1024) return 'tablet';
        return 'desktop';
    }
    
    trackDeviceInfo() {
        this.trackCustomEvent('DeviceInfo', {
            device_type: this.getDeviceType(),
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            connection_type: this.getConnectionType(),
            user_agent: navigator.userAgent.substring(0, 100),
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
    }
    
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
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// ===== FUNCIONES PÚBLICAS =====

// Función para tracking manual de eventos de Meta
function trackMetaEvent(eventName, eventData = {}) {
    if (window.metaPixelManager) {
        window.metaPixelManager.trackEvent(eventName, eventData);
    } else {
        console.warn('Meta Pixel Manager not initialized');
    }
}

// Función para tracking de eventos personalizados
function trackMetaCustomEvent(eventName, eventData = {}) {
    if (window.metaPixelManager) {
        window.metaPixelManager.trackCustomEvent(eventName, eventData);
    } else {
        console.warn('Meta Pixel Manager not initialized');
    }
}

// Función para obtener el engagement score actual
function getEngagementScore() {
    return window.metaPixelManager ? window.metaPixelManager.userEngagementScore : 0;
}

// ===== INICIALIZACIÓN =====

// Inicializar Meta Pixel Manager
window.metaPixelManager = new MetaPixelManager();

// Hacer funciones disponibles globalmente
window.trackMetaEvent = trackMetaEvent;
window.trackMetaCustomEvent = trackMetaCustomEvent;
window.getEngagementScore = getEngagementScore;

// Debugging para desarrollo
if (typeof window !== 'undefined') {
    window.MetaDebug = {
        isInitialized: () => window.metaPixelManager?.isInitialized,
        getEngagementScore: getEngagementScore,
        trackEvent: trackMetaEvent,
        trackCustomEvent: trackMetaCustomEvent,
        getConfig: () => META_CONFIG,
        getManager: () => window.metaPixelManager
    };
}

console.log('Meta Pixel Enhanced Tracking loaded successfully');