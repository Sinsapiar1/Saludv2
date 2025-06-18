// tracking.js - COMPATIBLE CON TU APPS SCRIPT EXISTENTE

// ===== CONFIGURACIÓN =====
const TRACKING_CONFIG = {
    // URL de tu Google Apps Script (MANTÉN LA TUYA)
    googleAppsScriptUrl: 'https://script.google.com/macros/s/AKfycbz_RDX-ldlgI3Ov_GJAFI01FcIK7qS4kuTTtCVDlwUZkPxMtu9EaCkS1cBIsv6802EmJA/exec',
    
    // Configuración de batch sending
    batchSize: 5, // Reducido para ser compatible
    batchTimeout: 3000, // 3 segundos
    
    // Configuración de retry
    maxRetries: 3,
    retryDelay: 1000,
    
    // Identificadores únicos
    sessionId: generateSessionId(),
    userId: getUserId(),
    
    // Eventos compatibles con tu estructura actual
    events: {
        pageView: 'page_view',
        pageLoad: 'page_load', 
        pageExit: 'page_exit',
        affiliateClick: 'affiliate_click',
        sectionView: 'section_view',
        timeOnPage: 'time_on_page',
        languageChange: 'language_change'
    }
};

// ===== CLASE PRINCIPAL DE TRACKING =====
class UnifiedTrackingManager {
    constructor() {
        this.eventQueue = [];
        this.isOnline = navigator.onLine;
        this.sessionData = this.initializeSession();
        this.userBehavior = {
            scrollDepth: 0,
            timeOnPage: 0,
            interactions: 0,
            sectionsViewed: new Set()
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startBatchProcessor();
        this.trackPageLoad();
        this.setupPerformanceMonitoring();
    }
    
    // ===== INICIALIZACIÓN DE SESIÓN =====
    initializeSession() {
        const sessionData = {
            sessionId: TRACKING_CONFIG.sessionId,
            userId: TRACKING_CONFIG.userId,
            startTime: Date.now(),
            pageViews: 1,
            referrer: document.referrer || 'direct',
            source: this.getTrafficSource()
        };
        
        return sessionData;
    }
    
    // ===== CONFIGURACIÓN DE EVENT LISTENERS =====
    setupEventListeners() {
        // Network status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processBatchQueue();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
        
        // Page lifecycle
        window.addEventListener('beforeunload', () => {
            this.trackPageExit();
            this.sendQueuedEvents(true);
        });
        
        // Tracking específico
        this.setupScrollTracking();
        this.setupClickTracking();
        this.setupSectionTracking();
        this.setupTimeTracking();
    }
    
    // ===== TRACKING DE SCROLL =====
    setupScrollTracking() {
        let maxScrollDepth = 0;
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                this.userBehavior.scrollDepth = scrollPercent;
            }
        }, 100));
    }
    
    // ===== TRACKING DE CLICS =====
    setupClickTracking() {
        document.addEventListener('click', (e) => {
            this.userBehavior.interactions++;
            
            // Tracking específico para enlaces de afiliados
            const affiliateLink = e.target.closest('.affiliate-link');
            if (affiliateLink) {
                this.trackAffiliateClick(affiliateLink, e);
            }
        });
    }
    
    // ===== TRACKING DE SECCIONES =====
    setupSectionTracking() {
        const sections = document.querySelectorAll('section[id], [data-section]');
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.3
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.id || entry.target.getAttribute('data-section');
                    
                    if (!this.userBehavior.sectionsViewed.has(sectionName)) {
                        this.userBehavior.sectionsViewed.add(sectionName);
                        
                        this.trackEvent(TRACKING_CONFIG.events.sectionView, {
                            sectionName: sectionName,
                            timeToReach: this.getTimeOnPage(),
                            scrollDepth: this.userBehavior.scrollDepth
                        });
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(section => sectionObserver.observe(section));
    }
    
    // ===== TRACKING DE TIEMPO =====
    setupTimeTracking() {
        const timeThresholds = [30, 60, 120, 300]; // segundos
        const trackedThresholds = new Set();
        
        setInterval(() => {
            const timeOnPage = this.getTimeOnPage();
            this.userBehavior.timeOnPage = timeOnPage;
            
            timeThresholds.forEach(threshold => {
                if (timeOnPage >= threshold && !trackedThresholds.has(threshold)) {
                    trackedThresholds.add(threshold);
                    
                    this.trackEvent(TRACKING_CONFIG.events.timeOnPage, {
                        seconds: timeOnPage // Campo compatible con tu Apps Script
                    });
                }
            });
        }, 1000);
    }
    
    // ===== TRACKING ESPECÍFICO =====
    trackPageView(customData = {}) {
        const pageViewData = {
            page: window.location.pathname,
            url: window.location.href,
            title: document.title,
            timeOnPage: this.getTimeOnPage(),
            ...customData
        };
        
        this.trackEvent(TRACKING_CONFIG.events.pageView, pageViewData);
    }
    
    trackAffiliateClick(link, event) {
        // Estructura de datos COMPATIBLE con tu Apps Script existente
        const linkData = {
            linkId: link.getAttribute('data-link-id') || 'unknown',
            linkUrl: link.getAttribute('href'),
            linkText: link.textContent.trim().substring(0, 100),
            sectionId: this.findParentSection(link),
            timeOnPage: this.getTimeOnPage(),
            scrollDepth: this.userBehavior.scrollDepth
        };
        
        this.trackEvent(TRACKING_CONFIG.events.affiliateClick, linkData);
        
        // También enviar a otros sistemas de tracking
        this.sendToExternalSystems('affiliate_click', linkData);
    }
    
    trackPageLoad() {
        // Datos básicos de la página
        const baseData = {
            url: window.location.href,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            timestamp: new Date().toISOString(),
            sessionData: this.sessionData
        };
        
        // Enviar page_view para el dashboard de métricas
        this.trackEvent(TRACKING_CONFIG.events.pageView, {
            ...baseData,
            page: window.location.pathname // Campo específico para page views
        });
        
        // También enviar page_load para datos técnicos
        this.trackEvent(TRACKING_CONFIG.events.pageLoad, baseData);
    }
    
    trackPageExit() {
        const exitData = {
            timeOnPage: this.getTimeOnPage(),
            scrollDepth: this.userBehavior.scrollDepth,
            interactions: this.userBehavior.interactions,
            sectionsViewed: Array.from(this.userBehavior.sectionsViewed)
        };
        
        this.trackEvent(TRACKING_CONFIG.events.pageExit, exitData);
    }
    
    // ===== PERFORMANCE MONITORING =====
    setupPerformanceMonitoring() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (window.performance && window.performance.timing) {
                    const timing = window.performance.timing;
                    
                    const performanceData = {
                        loadTime: timing.loadEventEnd - timing.navigationStart,
                        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                        userAgent: navigator.userAgent.substring(0, 100)
                    };
                    
                    this.trackEvent('performance', performanceData);
                }
            }, 1000);
        });
    }
    
    // ===== FUNCIONES PRINCIPALES =====
    trackEvent(eventType, eventData = {}) {
        // Estructura EXACTAMENTE compatible con tu Apps Script
        const event = {
            timestamp: new Date().toISOString(),
            eventType: eventType,
            url: window.location.href,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            // Campos específicos según el tipo de evento
            ...eventData
        };
        
        this.addToQueue(event);
        
        console.log(`Tracked Event: ${eventType}`, event);
    }
    
    addToQueue(event) {
        this.eventQueue.push(event);
        
        // Procesar si el queue está lleno
        if (this.eventQueue.length >= TRACKING_CONFIG.batchSize) {
            this.processBatchQueue();
        }
    }
    
    // ===== PROCESAMIENTO DE QUEUE =====
    startBatchProcessor() {
        setInterval(() => {
            if (this.eventQueue.length > 0) {
                this.processBatchQueue();
            }
        }, TRACKING_CONFIG.batchTimeout);
    }
    
    processBatchQueue() {
        if (this.eventQueue.length === 0 || !this.isOnline) {
            return;
        }
        
        // Enviar eventos uno por uno para compatibilidad con tu Apps Script
        const events = [...this.eventQueue];
        this.eventQueue = [];
        
        events.forEach(event => {
            this.sendSingleEvent(event);
        });
    }
    
    sendSingleEvent(event, retry = 0) {
        // Formato EXACTO que espera tu Apps Script
        fetch(TRACKING_CONFIG.googleAppsScriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event) // Evento individual, no array
        })
        .then(() => {
            console.log(`Successfully sent event: ${event.eventType}`);
        })
        .catch(error => {
            console.error('Error sending tracking data:', error);
            
            // Retry logic
            if (retry < TRACKING_CONFIG.maxRetries) {
                setTimeout(() => {
                    this.sendSingleEvent(event, retry + 1);
                }, TRACKING_CONFIG.retryDelay * (retry + 1));
            } else {
                // Re-add to queue if all retries failed
                this.eventQueue.unshift(event);
            }
        });
    }
    
    sendQueuedEvents(immediate = false) {
        if (immediate && this.eventQueue.length > 0) {
            const events = [...this.eventQueue];
            this.eventQueue = [];
            
            // Para envío inmediato, usar sendBeacon si está disponible
            events.forEach(event => {
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(
                        TRACKING_CONFIG.googleAppsScriptUrl, 
                        JSON.stringify(event)
                    );
                } else {
                    this.sendSingleEvent(event);
                }
            });
        } else {
            this.processBatchQueue();
        }
    }
    
    // ===== INTEGRACIÓN CON OTROS SISTEMAS =====
    sendToExternalSystems(eventType, eventData) {
        // Enviar a Google Analytics
        if (typeof trackGAEvent === 'function') {
            trackGAEvent(eventType, eventData);
        }
        
        // Enviar a Meta Pixel
        if (typeof trackMetaCustomEvent === 'function') {
            trackMetaCustomEvent(eventType, eventData);
        }
        
        // Enviar a Microsoft Clarity
        if (window.vitalLifePage?.clarity) {
            window.vitalLifePage.clarity.track(eventType, eventData);
        }
    }
    
    // ===== UTILIDADES =====
    getTimeOnPage() {
        return Math.floor((Date.now() - this.sessionData.startTime) / 1000);
    }
    
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
    
    getTrafficSource() {
        const referrer = document.referrer;
        const url = new URL(window.location.href);
        const utmSource = url.searchParams.get('utm_source');
        
        if (utmSource) return utmSource;
        if (!referrer) return 'direct';
        
        try {
            const referrerDomain = new URL(referrer).hostname;
            if (referrerDomain.includes('google')) return 'google';
            if (referrerDomain.includes('facebook')) return 'facebook';
            if (referrerDomain.includes('instagram')) return 'instagram';
            return 'referral';
        } catch (error) {
            return 'unknown';
        }
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

// ===== FUNCIONES UTILITARIAS =====
function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getUserId() {
    let userId = localStorage.getItem('vitallife_user_id');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('vitallife_user_id', userId);
    }
    return userId;
}

// ===== FUNCIONES PÚBLICAS =====
function trackCustomEvent(eventType, eventData = {}) {
    if (window.unifiedTracker) {
        window.unifiedTracker.trackEvent(eventType, eventData);
    }
}

function trackPageView(customData = {}) {
    if (window.unifiedTracker) {
        window.unifiedTracker.trackPageView(customData);
    }
}

function flushTrackingQueue() {
    if (window.unifiedTracker) {
        window.unifiedTracker.sendQueuedEvents(true);
    }
}

// ===== INICIALIZACIÓN =====
window.unifiedTracker = new UnifiedTrackingManager();

// Hacer funciones disponibles globalmente
window.trackCustomEvent = trackCustomEvent;
window.trackPageView = trackPageView;
window.flushTrackingQueue = flushTrackingQueue;

// Debugging para desarrollo
if (typeof window !== 'undefined') {
    window.TrackingDebug = {
        getQueue: () => window.unifiedTracker?.eventQueue || [],
        getSession: () => window.unifiedTracker?.sessionData || {},
        trackEvent: trackCustomEvent,
        trackPageView: trackPageView,
        flushQueue: flushTrackingQueue,
        getConfig: () => TRACKING_CONFIG
    };
}

console.log('Unified Tracking System (Compatible) loaded successfully');