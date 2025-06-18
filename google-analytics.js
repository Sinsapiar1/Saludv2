// google-analytics.js - Google Analytics 4 mejorado con integración avanzada

// ===== CONFIGURACIÓN =====
const GA_CONFIG = {
    // Reemplaza con tu ID real de Google Analytics
    measurementId: 'G-2R9V4ZC0XM',
    
    // Configuración de enhanced ecommerce
    currency: 'USD',
    
    // Configuración de eventos personalizados
    customEvents: {
        affiliate_click: 'affiliate_click',
        video_play: 'video_play',
        newsletter_signup: 'newsletter_signup',
        scroll_depth: 'scroll_depth',
        time_on_page: 'time_on_page',
        exit_intent: 'exit_intent'
    }
};

// ===== CLASE PRINCIPAL DE GOOGLE ANALYTICS =====
class GoogleAnalyticsManager {
    constructor() {
        this.isInitialized = false;
        this.dataLayer = [];
        this.scrollDepthTracked = new Set();
        this.timeThresholds = [10, 30, 60, 120, 300]; // segundos
        this.timeThresholdsTracked = new Set();
        this.startTime = Date.now();
        
        this.init();
    }
    
    init() {
        this.loadGoogleAnalytics();
        this.setupEventListeners();
        this.setupEnhancedMeasurement();
    }
    
    // ===== CARGA DE GOOGLE ANALYTICS =====
    loadGoogleAnalytics() {
        // Crear script tag para gtag
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_CONFIG.measurementId}`;
        document.head.appendChild(script);
        
        // Inicializar dataLayer y gtag
        window.dataLayer = window.dataLayer || [];
        
        function gtag() {
            dataLayer.push(arguments);
        }
        
        // Hacer gtag accesible globalmente
        window.gtag = gtag;
        
        // Configuración inicial
        gtag('js', new Date());
        gtag('config', GA_CONFIG.measurementId, {
            // Configuración mejorada
            send_page_view: true,
            allow_google_signals: true,
            allow_ad_personalization_signals: true,
            
            // Enhanced ecommerce
            currency: GA_CONFIG.currency,
            
            // Custom parameters
            custom_map: {
                'custom_parameter_1': 'user_engagement_score',
                'custom_parameter_2': 'content_group1'
            },
            
            // Privacy settings
            anonymize_ip: true,
            
            // Performance settings
            transport_type: 'beacon'
        });
        
        this.isInitialized = true;
        console.log('Google Analytics 4 initialized successfully');
        
        // Enviar evento de inicialización
        this.trackEvent('ga_initialized', {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent.substring(0, 100)
        });
    }
    
    // ===== CONFIGURACIÓN DE EVENT LISTENERS =====
    setupEventListeners() {
        // Seguimiento de clics en enlaces de afiliados
        this.trackAffiliateClicks();
        
        // Seguimiento de profundidad de scroll
        this.trackScrollDepth();
        
        // Seguimiento de tiempo en página
        this.trackTimeOnPage();
        
        // Seguimiento de interacciones con video
        this.trackVideoInteractions();
        
        // Seguimiento de formularios
        this.trackFormInteractions();
        
        // Seguimiento de salida de página
        this.trackPageExit();
        
        // Seguimiento de cambios de idioma
        this.trackLanguageChanges();
    }
    
    // ===== SEGUIMIENTO DE CLICS EN AFILIADOS =====
    trackAffiliateClicks() {
        document.querySelectorAll('.affiliate-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const linkId = link.getAttribute('data-link-id') || 'unknown';
                const linkUrl = link.getAttribute('href');
                const linkText = link.textContent.trim();
                const section = this.findParentSection(link);
                
                // Event de GA4
                this.trackEvent('affiliate_click', {
                    link_id: linkId,
                    link_url: linkUrl,
                    link_text: linkText.substring(0, 100),
                    section: section,
                    click_position: this.getClickPosition(e),
                    event_category: 'affiliate',
                    event_label: linkId,
                    value: this.getLinkValue(linkId)
                });
                
                // Enhanced ecommerce event
                this.trackPurchaseIntent(linkId, linkUrl);
            });
        });
    }
    
    // ===== SEGUIMIENTO DE PROFUNDIDAD DE SCROLL =====
    trackScrollDepth() {
        const thresholds = [25, 50, 75, 90, 100];
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            thresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !this.scrollDepthTracked.has(threshold)) {
                    this.scrollDepthTracked.add(threshold);
                    
                    this.trackEvent('scroll_depth', {
                        scroll_depth: threshold,
                        event_category: 'engagement',
                        event_label: `${threshold}%`,
                        value: threshold
                    });
                }
            });
        }, 100));
    }
    
    // ===== SEGUIMIENTO DE TIEMPO EN PÁGINA =====
    trackTimeOnPage() {
        setInterval(() => {
            const timeOnPage = Math.floor((Date.now() - this.startTime) / 1000);
            
            this.timeThresholds.forEach(threshold => {
                if (timeOnPage >= threshold && !this.timeThresholdsTracked.has(threshold)) {
                    this.timeThresholdsTracked.add(threshold);
                    
                    this.trackEvent('time_on_page', {
                        time_threshold: threshold,
                        actual_time: timeOnPage,
                        event_category: 'engagement',
                        event_label: `${threshold}s`,
                        value: threshold
                    });
                }
            });
        }, 1000);
    }
    
    // ===== SEGUIMIENTO DE INTERACCIONES CON VIDEO =====
    trackVideoInteractions() {
        const videoBtn = document.getElementById('watchVideoBtn');
        const videoModal = document.getElementById('videoModal');
        
        if (videoBtn) {
            videoBtn.addEventListener('click', () => {
                this.trackEvent('video_play_attempt', {
                    video_title: 'VitalLife Product Demo',
                    video_provider: 'youtube',
                    event_category: 'video',
                    event_label: 'hero_video_button'
                });
            });
        }
        
        if (videoModal) {
            // Observar cuando se abre el modal
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const isVisible = videoModal.style.display === 'block';
                        if (isVisible) {
                            this.trackEvent('video_modal_open', {
                                event_category: 'video',
                                event_label: 'modal_opened'
                            });
                        }
                    }
                });
            });
            
            observer.observe(videoModal, { attributes: true });
        }
    }
    
    // ===== SEGUIMIENTO DE FORMULARIOS =====
    trackFormInteractions() {
        // Newsletter signup (si existe)
        document.querySelectorAll('input[type="email"]').forEach(input => {
            input.addEventListener('focus', () => {
                this.trackEvent('newsletter_focus', {
                    event_category: 'form',
                    event_label: 'email_input_focus'
                });
            });
            
            input.addEventListener('blur', () => {
                if (input.value.length > 0) {
                    this.trackEvent('newsletter_email_entered', {
                        event_category: 'form',
                        event_label: 'email_input_completed'
                    });
                }
            });
        });
        
        // Botones de envío de formulario
        document.querySelectorAll('button[type="submit"], input[type="submit"]').forEach(button => {
            button.addEventListener('click', () => {
                this.trackEvent('form_submit_attempt', {
                    form_type: this.getFormType(button),
                    event_category: 'form',
                    event_label: 'submit_clicked'
                });
            });
        });
    }
    
    // ===== SEGUIMIENTO DE SALIDA DE PÁGINA =====
    trackPageExit() {
        // Exit intent
        let exitIntentTracked = false;
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentTracked) {
                exitIntentTracked = true;
                const timeOnPage = Math.floor((Date.now() - this.startTime) / 1000);
                
                this.trackEvent('exit_intent', {
                    time_on_page: timeOnPage,
                    scroll_depth: this.getCurrentScrollDepth(),
                    event_category: 'engagement',
                    event_label: 'mouse_exit'
                });
            }
        });
        
        // Before unload
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.floor((Date.now() - this.startTime) / 1000);
            
            this.trackEvent('page_exit', {
                time_on_page: timeOnPage,
                scroll_depth: this.getCurrentScrollDepth(),
                exit_type: 'before_unload',
                event_category: 'engagement'
            });
        });
    }
    
    // ===== SEGUIMIENTO DE CAMBIOS DE IDIOMA =====
    trackLanguageChanges() {
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                const newLang = langToggle.getAttribute('data-lang') === 'en' ? 'es' : 'en';
                
                this.trackEvent('language_change', {
                    language_from: langToggle.getAttribute('data-lang'),
                    language_to: newLang,
                    event_category: 'settings',
                    event_label: newLang
                });
            });
        }
    }
    
    // ===== ENHANCED MEASUREMENT =====
    setupEnhancedMeasurement() {
        // Seguimiento automático de outbound links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.isOutboundLink(link.href)) {
                this.trackEvent('click', {
                    link_url: link.href,
                    link_domain: new URL(link.href).hostname,
                    outbound: true,
                    event_category: 'outbound'
                });
            }
        });
        
        // Seguimiento de errores JavaScript
        window.addEventListener('error', (e) => {
            this.trackEvent('exception', {
                description: e.message,
                filename: e.filename,
                lineno: e.lineno,
                fatal: false
            });
        });
        
        // Seguimiento de performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.trackPerformanceMetrics();
            }, 1000);
        });
    }
    
    // ===== ENHANCED ECOMMERCE =====
    trackPurchaseIntent(linkId, linkUrl) {
        // Simular evento de purchase intent para enlaces principales
        if (linkId.includes('main-cta') || linkId.includes('final-cta')) {
            gtag('event', 'begin_checkout', {
                currency: GA_CONFIG.currency,
                value: 59.99, // Precio del producto
                items: [{
                    item_id: 'vitallife_premium',
                    item_name: 'VitalLife Premium Supplement',
                    category: 'Health Supplements',
                    quantity: 1,
                    price: 59.99
                }]
            });
        }
    }
    
    // ===== MÉTRICAS DE PERFORMANCE =====
    trackPerformanceMetrics() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            this.trackEvent('page_timing', {
                page_load_time: loadTime,
                dom_ready_time: domReady,
                event_category: 'performance',
                value: Math.round(loadTime / 100) // Valor en centésimas de segundo
            });
        }
        
        // Core Web Vitals (si están disponibles)
        this.trackWebVitals();
    }
    
    trackWebVitals() {
        try {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.trackEvent('web_vitals', {
                    metric_name: 'LCP',
                    metric_value: Math.round(lastEntry.startTime),
                    event_category: 'performance'
                });
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    this.trackEvent('web_vitals', {
                        metric_name: 'FID',
                        metric_value: Math.round(entry.processingStart - entry.startTime),
                        event_category: 'performance'
                    });
                });
            }).observe({ entryTypes: ['first-input'] });
            
        } catch (error) {
            console.warn('Web Vitals not supported:', error);
        }
    }
    
    // ===== FUNCIÓN PRINCIPAL DE TRACKING =====
    trackEvent(eventName, parameters = {}) {
        if (!this.isInitialized || typeof gtag !== 'function') {
            console.warn('Google Analytics not initialized');
            return;
        }
        
        try {
            // Añadir parámetros adicionales
            const enrichedParameters = {
                ...parameters,
                page_title: document.title,
                page_location: window.location.href,
                timestamp: new Date().toISOString()
            };
            
            // Enviar evento
            gtag('event', eventName, enrichedParameters);
            
            console.log(`GA4 Event: ${eventName}`, enrichedParameters);
        } catch (error) {
            console.error('Error sending GA4 event:', error);
        }
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
    
    getClickPosition(event) {
        return {
            x: event.clientX,
            y: event.clientY,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight
        };
    }
    
    getLinkValue(linkId) {
        // Asignar valores a diferentes CTAs
        const values = {
            'hero-main-cta': 100,
            'final-main-cta': 95,
            'testimonial-cta': 80,
            'benefit-1-link': 30,
            'benefit-2-link': 30,
            'benefit-3-link': 30,
            'feature-1-link': 25,
            'feature-2-link': 25
        };
        
        return values[linkId] || 10;
    }
    
    getCurrentScrollDepth() {
        return Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
    }
    
    isOutboundLink(url) {
        try {
            const link = new URL(url);
            return link.hostname !== window.location.hostname;
        } catch (error) {
            return false;
        }
    }
    
    getFormType(button) {
        const form = button.closest('form');
        if (!form) return 'unknown';
        
        if (form.querySelector('input[type="email"]')) return 'newsletter';
        if (form.querySelector('input[name*="contact"]')) return 'contact';
        return 'generic';
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
}

// ===== FUNCIONES PÚBLICAS =====

// Función para tracking manual de eventos
function trackGAEvent(eventName, eventParams = {}) {
    if (window.gaManager) {
        window.gaManager.trackEvent(eventName, eventParams);
    } else {
        console.warn('Google Analytics Manager not initialized');
    }
}

// Función para tracking de conversiones
function trackConversion(conversionType, value = 0) {
    if (window.gaManager) {
        window.gaManager.trackEvent('conversion', {
            conversion_type: conversionType,
            value: value,
            currency: GA_CONFIG.currency,
            event_category: 'conversion'
        });
    }
}

// Función para tracking de custom dimensions
function setCustomDimension(index, value) {
    if (typeof gtag === 'function') {
        gtag('config', GA_CONFIG.measurementId, {
            [`custom_parameter_${index}`]: value
        });
    }
}

// ===== INICIALIZACIÓN =====

// Inicializar Google Analytics Manager
window.gaManager = new GoogleAnalyticsManager();

// Hacer funciones disponibles globalmente
window.trackGAEvent = trackGAEvent;
window.trackConversion = trackConversion;
window.setCustomDimension = setCustomDimension;

// Debugging para desarrollo
if (typeof window !== 'undefined') {
    window.GADebug = {
        isInitialized: () => window.gaManager?.isInitialized,
        trackEvent: trackGAEvent,
        trackConversion: trackConversion,
        getConfig: () => GA_CONFIG,
        getManager: () => window.gaManager
    };
}

console.log('Google Analytics 4 Enhanced Tracking loaded successfully');