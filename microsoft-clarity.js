// microsoft-clarity.js - Configuración y optimización específica para Microsoft Clarity

// ===== CONFIGURACIÓN AVANZADA DE MICROSOFT CLARITY =====
const CLARITY_CONFIG = {
    // Tu Project ID de Microsoft Clarity (reemplazar con el real)
    projectId: 'CLARITY_PROJECT_ID',
    
    // Configuración de eventos personalizados
    customEvents: {
        // Eventos de comercio electrónico
        productView: 'ProductView',
        addToCart: 'AddToCart',
        beginCheckout: 'BeginCheckout',
        purchase: 'Purchase',
        
        // Eventos de engagement
        highEngagement: 'HighEngagement',
        videoPlay: 'VideoPlay',
        formStart: 'FormStart',
        formComplete: 'FormComplete',
        
        // Eventos de navegación
        sectionView: 'SectionView',
        scrollMilestone: 'ScrollMilestone',
        timeSpent: 'TimeSpent',
        exitIntent: 'ExitIntent',
        
        // Eventos de conversión
        leadGenerated: 'LeadGenerated',
        phoneClick: 'PhoneClick',
        emailClick: 'EmailClick',
        
        // Eventos técnicos
        error: 'JavaScriptError',
        performanceIssue: 'PerformanceIssue',
        loadTime: 'PageLoadTime'
    },
    
    // Configuración de targeting (para A/B testing futuro)
    targeting: {
        trackUserSegments: true,
        trackTrafficSources: true,
        trackDeviceTypes: true,
        trackGeoLocation: false // Desactivado por privacidad
    },
    
    // Configuración de filtros
    filters: {
        excludeBots: true,
        excludeInternalTraffic: true,
        minimumSessionDuration: 5, // segundos
        trackOnlyActiveUsers: true
    },
    
    // Configuración de sampling (para sitios con mucho tráfico)
    sampling: {
        enabled: false,
        rate: 100 // 100% de sesiones grabadas
    }
};

// ===== CLASE PRINCIPAL DE MICROSOFT CLARITY =====
class MicrosoftClarityManager {
    constructor() {
        this.isInitialized = false;
        this.isActive = false;
        this.sessionData = {};
        this.userSegment = null;
        this.conversionFunnel = [];
        this.heatmapData = [];
        
        this.init();
    }
    
    init() {
        this.loadClarityScript();
        this.setupSessionTracking();
        this.setupAdvancedEvents();
        this.setupUserSegmentation();
        this.setupConversionFunnel();
        this.setupHeatmapTracking();
    }
    
    // ===== CARGA DEL SCRIPT DE CLARITY =====
    loadClarityScript() {
        // Verificar si ya está cargado
        if (typeof clarity !== 'undefined') {
            this.isInitialized = true;
            this.onClarityReady();
            return;
        }
        
        // Código oficial de Microsoft Clarity
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", CLARITY_CONFIG.projectId);
        
        // Verificar cuando esté listo
        this.waitForClarity();
    }
    
    waitForClarity() {
        let attempts = 0;
        const maxAttempts = 100; // 10 segundos máximo
        
        const checkClarity = () => {
            attempts++;
            if (typeof clarity !== 'undefined') {
                this.isInitialized = true;
                this.isActive = true;
                this.onClarityReady();
                console.log('Microsoft Clarity loaded and ready');
            } else if (attempts < maxAttempts) {
                setTimeout(checkClarity, 100);
            } else {
                console.warn('Microsoft Clarity failed to load after 10 seconds');
                this.handleClarityFailure();
            }
        };
        
        checkClarity();
    }
    
    onClarityReady() {
        // Configuraciones post-carga
        this.setupClarityConfiguration();
        this.trackInitialPageData();
        this.startSessionRecording();
    }
    
    handleClarityFailure() {
        // Fallback cuando Clarity no se carga
        console.warn('Clarity failed to load, implementing fallback tracking');
        this.isActive = false;
        
        // Tracking básico sin Clarity
        this.implementFallbackTracking();
    }
    
    // ===== CONFIGURACIÓN AVANZADA =====
    setupClarityConfiguration() {
        if (!this.isActive) return;
        
        try {
            // Configurar identificación de usuario (sin PII)
            const anonymousId = this.getAnonymousUserId();
            clarity("identify", anonymousId);
            
            // Configurar consentimiento de privacidad
            clarity("consent", true);
            
            // Configurar metadatos de sesión
            clarity("set", "userSegment", this.getUserSegment());
            clarity("set", "trafficSource", this.getTrafficSource());
            clarity("set", "deviceType", this.getDeviceType());
            clarity("set", "pageType", "landing");
            clarity("set", "productCategory", "health-supplements");
            
        } catch (error) {
            console.error('Error configuring Clarity:', error);
        }
    }
    
    // ===== TRACKING DE SESIÓN =====
    setupSessionTracking() {
        this.sessionData = {
            sessionId: this.generateSessionId(),
            startTime: Date.now(),
            pageViews: 1,
            interactions: 0,
            scrollDepth: 0,
            timeOnPage: 0,
            conversionEvents: []
        };
        
        // Actualizar datos de sesión periódicamente
        setInterval(() => {
            this.updateSessionData();
        }, 5000);
    }
    
    updateSessionData() {
        this.sessionData.timeOnPage = Math.floor((Date.now() - this.sessionData.startTime) / 1000);
        
        if (this.isActive) {
            clarity("set", "sessionDuration", this.sessionData.timeOnPage);
            clarity("set", "interactionCount", this.sessionData.interactions);
            clarity("set", "maxScrollDepth", this.sessionData.scrollDepth);
        }
    }
    
    // ===== EVENTOS AVANZADOS =====
    setupAdvancedEvents() {
        this.setupScrollTracking();
        this.setupClickTracking();
        this.setupFormTracking();
        this.setupVideoTracking();
        this.setupErrorTracking();
        this.setupPerformanceTracking();
    }
    
    setupScrollTracking() {
        let maxScroll = 0;
        const milestones = [10, 25, 50, 75, 90, 100];
        const trackedMilestones = new Set();
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.sessionData.scrollDepth = scrollPercent;
            }
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    this.trackEvent(CLARITY_CONFIG.customEvents.scrollMilestone, {
                        milestone: milestone,
                        timeToReach: this.sessionData.timeOnPage,
                        currentSection: this.getCurrentSection()
                    });
                }
            });
        }, 200));
    }
    
    setupClickTracking() {
        document.addEventListener('click', (e) => {
            this.sessionData.interactions++;
            
            const element = e.target;
            const clickData = {
                elementType: element.tagName.toLowerCase(),
                elementClass: element.className,
                elementId: element.id,
                elementText: element.textContent?.trim().substring(0, 50),
                clickX: e.clientX,
                clickY: e.clientY,
                timestamp: Date.now(),
                section: this.getCurrentSection()
            };
            
            // Tracking especial para elementos importantes
            if (element.matches('.cta-button, .affiliate-link, button, a')) {
                this.trackEvent('ImportantClick', clickData);
                
                // Si es un CTA principal, marcar como evento de conversión
                if (element.matches('.cta-primary, [data-link-id*="main-cta"]')) {
                    this.trackConversionEvent('MainCTAClick', clickData);
                }
            }
            
            // Heatmap data
            this.heatmapData.push({
                x: e.clientX,
                y: e.clientY,
                type: 'click',
                timestamp: Date.now(),
                element: element.tagName
            });
            
            // Limitar el tamaño del heatmap data
            if (this.heatmapData.length > 100) {
                this.heatmapData.shift();
            }
        });
    }
    
    setupFormTracking() {
        document.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('focus', () => {
                this.trackEvent(CLARITY_CONFIG.customEvents.formStart, {
                    fieldType: field.type || field.tagName.toLowerCase(),
                    fieldName: field.name || field.id,
                    formId: this.getFormId(field)
                });
            });
            
            field.addEventListener('blur', () => {
                const hasValue = field.value && field.value.length > 0;
                
                this.trackEvent('FormFieldComplete', {
                    fieldType: field.type || field.tagName.toLowerCase(),
                    fieldName: field.name || field.id,
                    formId: this.getFormId(field),
                    hasValue: hasValue
                });
                
                // Tracking especial para email
                if (field.type === 'email' && hasValue && this.isValidEmail(field.value)) {
                    this.trackConversionEvent(CLARITY_CONFIG.customEvents.leadGenerated, {
                        leadType: 'email_provided',
                        formId: this.getFormId(field)
                    });
                }
            });
        });
    }
    
    setupVideoTracking() {
        const videoButton = document.getElementById('watchVideoBtn');
        if (videoButton) {
            videoButton.addEventListener('click', () => {
                this.trackEvent(CLARITY_CONFIG.customEvents.videoPlay, {
                    videoTitle: 'VitalLife Product Demo',
                    videoPosition: 'hero',
                    timeOnPageWhenClicked: this.sessionData.timeOnPage
                });
            });
        }
    }
    
    setupErrorTracking() {
        window.addEventListener('error', (e) => {
            this.trackEvent(CLARITY_CONFIG.customEvents.error, {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                userAgent: navigator.userAgent.substring(0, 100)
            });
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.trackEvent(CLARITY_CONFIG.customEvents.error, {
                type: 'unhandled_promise',
                reason: e.reason?.toString().substring(0, 100)
            });
        });
    }
    
    setupPerformanceTracking() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const performanceData = this.getPerformanceMetrics();
                
                this.trackEvent(CLARITY_CONFIG.customEvents.loadTime, performanceData);
                
                // Detectar problemas de rendimiento
                if (performanceData.loadTime > 3000) {
                    this.trackEvent(CLARITY_CONFIG.customEvents.performanceIssue, {
                        issue: 'slow_page_load',
                        loadTime: performanceData.loadTime
                    });
                }
            }, 1000);
        });
    }
    
    // ===== SEGMENTACIÓN DE USUARIOS =====
    setupUserSegmentation() {
        this.userSegment = this.determineUserSegment();
        
        if (this.isActive) {
            clarity("set", "userSegment", this.userSegment);
        }
    }
    
    determineUserSegment() {
        const referrer = document.referrer;
        const utmSource = new URLSearchParams(window.location.search).get('utm_source');
        const deviceType = this.getDeviceType();
        
        // Segmentación básica
        if (utmSource) {
            return `${utmSource}_${deviceType}`;
        } else if (referrer.includes('google')) {
            return `organic_google_${deviceType}`;
        } else if (referrer.includes('facebook') || referrer.includes('instagram')) {
            return `social_meta_${deviceType}`;
        } else if (!referrer) {
            return `direct_${deviceType}`;
        } else {
            return `referral_${deviceType}`;
        }
    }
    
    // ===== FUNNEL DE CONVERSIÓN =====
    setupConversionFunnel() {
        this.conversionFunnel = [
            { step: 'page_load', completed: true, timestamp: Date.now() },
            { step: 'hero_view', completed: false },
            { step: 'benefits_view', completed: false },
            { step: 'features_view', completed: false },
            { step: 'testimonials_view', completed: false },
            { step: 'pricing_view', completed: false },
            { step: 'cta_click', completed: false },
            { step: 'form_start', completed: false },
            { step: 'conversion', completed: false }
        ];
        
        this.setupFunnelTracking();
    }
    
    setupFunnelTracking() {
        // Observador de intersección para pasos del funnel
        const sections = document.querySelectorAll('#benefits, #features, #results, #pricing');
        const sectionMap = {
            'benefits': 'benefits_view',
            'features': 'features_view',
            'results': 'testimonials_view',
            'pricing': 'pricing_view'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stepName = sectionMap[entry.target.id];
                    if (stepName) {
                        this.completeFunnelStep(stepName);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => observer.observe(section));
    }
    
    completeFunnelStep(stepName) {
        const step = this.conversionFunnel.find(s => s.step === stepName);
        if (step && !step.completed) {
            step.completed = true;
            step.timestamp = Date.now();
            
            this.trackEvent('FunnelStep', {
                step: stepName,
                timeFromStart: Math.floor((Date.now() - this.sessionData.startTime) / 1000),
                funnelProgress: this.getFunnelProgress()
            });
        }
    }
    
    getFunnelProgress() {
        const completedSteps = this.conversionFunnel.filter(s => s.completed).length;
        return Math.round((completedSteps / this.conversionFunnel.length) * 100);
    }
    
    // ===== TRACKING DE HEATMAP =====
    setupHeatmapTracking() {
        // Tracking de movimientos del mouse para heatmap
        let mouseData = [];
        
        document.addEventListener('mousemove', this.throttle((e) => {
            mouseData.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now()
            });
            
            // Limitar datos para performance
            if (mouseData.length > 500) {
                mouseData = mouseData.slice(-250);
            }
        }, 100));
        
        // Enviar datos de heatmap periódicamente
        setInterval(() => {
            if (mouseData.length > 10 && this.isActive) {
                this.trackEvent('MouseHeatmap', {
                    points: mouseData.slice(-50), // Solo los últimos 50 puntos
                    section: this.getCurrentSection()
                });
                mouseData = [];
            }
        }, 30000); // Cada 30 segundos
    }
    
    // ===== FUNCIONES PRINCIPALES =====
    trackEvent(eventName, data = {}) {
        if (!this.isActive) {
            this.fallbackTrackEvent(eventName, data);
            return;
        }
        
        try {
            const enrichedData = {
                ...data,
                timestamp: new Date().toISOString(),
                sessionId: this.sessionData.sessionId,
                userSegment: this.userSegment,
                timeOnPage: this.sessionData.timeOnPage,
                scrollDepth: this.sessionData.scrollDepth,
                interactions: this.sessionData.interactions
            };
            
            clarity("set", eventName, JSON.stringify(enrichedData));
            
            console.log(`Clarity Event: ${eventName}`, enrichedData);
        } catch (error) {
            console.error('Error tracking Clarity event:', error);
        }
    }
    
    trackConversionEvent(eventName, data = {}) {
        this.sessionData.conversionEvents.push({
            event: eventName,
            data: data,
            timestamp: Date.now()
        });
        
        this.trackEvent(eventName, {
            ...data,
            conversionType: 'high_value',
            conversionOrder: this.sessionData.conversionEvents.length
        });
    }
    
    // ===== FALLBACK TRACKING =====
    implementFallbackTracking() {
        // Implementar tracking básico cuando Clarity no está disponible
        this.fallbackEvents = [];
        
        console.log('Implementing fallback tracking for Clarity events');
    }
    
    fallbackTrackEvent(eventName, data) {
        this.fallbackEvents = this.fallbackEvents || [];
        this.fallbackEvents.push({
            event: eventName,
            data: data,
            timestamp: Date.now()
        });
        
        // Límite de eventos en fallback
        if (this.fallbackEvents.length > 100) {
            this.fallbackEvents.shift();
        }
    }
    
    // ===== UTILIDADES =====
    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + window.innerHeight / 2;
        
        for (let section of sections) {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.scrollY;
            const sectionBottom = sectionTop + rect.height;
            
            if (scrollPos >= sectionTop && scrollPos <= sectionBottom) {
                return section.id;
            }
        }
        
        return 'unknown';
    }
    
    getFormId(field) {
        const form = field.closest('form');
        return form ? (form.id || form.className || 'unnamed') : 'no-form';
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    getDeviceType() {
        const width = window.innerWidth;
        if (width <= 768) return 'mobile';
        if (width <= 1024) return 'tablet';
        return 'desktop';
    }
    
    getTrafficSource() {
        const referrer = document.referrer;
        const utmSource = new URLSearchParams(window.location.search).get('utm_source');
        
        if (utmSource) return utmSource;
        if (!referrer) return 'direct';
        
        try {
            const domain = new URL(referrer).hostname;
            if (domain.includes('google')) return 'google';
            if (domain.includes('facebook')) return 'facebook';
            if (domain.includes('instagram')) return 'instagram';
            return 'referral';
        } catch {
            return 'unknown';
        }
    }
    
    getAnonymousUserId() {
        let userId = sessionStorage.getItem('clarity_anonymous_id');
        if (!userId) {
            userId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('clarity_anonymous_id', userId);
        }
        return userId;
    }
    
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getPerformanceMetrics() {
        if (!window.performance || !window.performance.timing) {
            return { loadTime: 0, error: 'Performance API not available' };
        }
        
        const timing = window.performance.timing;
        return {
            loadTime: timing.loadEventEnd - timing.navigationStart,
            domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
            firstByte: timing.responseStart - timing.navigationStart,
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            connection: timing.connectEnd - timing.connectStart,
            response: timing.responseEnd - timing.responseStart
        };
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
    
    // ===== API PÚBLICA =====
    isReady() {
        return this.isInitialized && this.isActive;
    }
    
    getSessionData() {
        return { ...this.sessionData };
    }
    
    getFunnelData() {
        return [...this.conversionFunnel];
    }
    
    getHeatmapData() {
        return [...this.heatmapData];
    }
    
    trackCustomEvent(eventName, data) {
        this.trackEvent(eventName, data);
    }
    
    identifyUser(anonymousId) {
        if (this.isActive) {
            clarity("identify", anonymousId);
        }
    }
    
    setCustomData(key, value) {
        if (this.isActive) {
            clarity("set", key, value);
        }
    }
}

// ===== FUNCIONES PÚBLICAS =====
function initializeClarity() {
    if (!window.clarityManager) {
        window.clarityManager = new MicrosoftClarityManager();
    }
    return window.clarityManager;
}

function trackClarityEvent(eventName, data = {}) {
    if (window.clarityManager) {
        window.clarityManager.trackEvent(eventName, data);
    } else {
        console.warn('Clarity Manager not initialized');
    }
}

function trackClarityConversion(eventName, data = {}) {
    if (window.clarityManager) {
        window.clarityManager.trackConversionEvent(eventName, data);
    } else {
        console.warn('Clarity Manager not initialized');
    }
}

function getClaritySessionData() {
    return window.clarityManager ? window.clarityManager.getSessionData() : null;
}

// ===== INICIALIZACIÓN AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', () => {
    window.clarityManager = initializeClarity();
    
    // Hacer funciones disponibles globalmente
    window.trackClarityEvent = trackClarityEvent;
    window.trackClarityConversion = trackClarityConversion;
    window.getClaritySessionData = getClaritySessionData;
    
    console.log('Microsoft Clarity Manager initialized');
});

// ===== DEBUGGING =====
if (typeof window !== 'undefined') {
    window.ClarityDebug = {
        isReady: () => window.clarityManager?.isReady(),
        getSession: getClaritySessionData,
        getFunnel: () => window.clarityManager?.getFunnelData(),
        getHeatmap: () => window.clarityManager?.getHeatmapData(),
        trackEvent: trackClarityEvent,
        trackConversion: trackClarityConversion,
        getConfig: () => CLARITY_CONFIG
    };
}

// Exportar para uso modular si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MicrosoftClarityManager,
        CLARITY_CONFIG,
        initializeClarity,
        trackClarityEvent,
        trackClarityConversion
    };
}