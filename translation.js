
// translation.js - Sistema de traducción mejorado con seguimiento avanzado

// ===== CONFIGURACIÓN =====
const TRANSLATION_CONFIG = {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es'],
    storageKey: 'vitallife_preferred_language',
    autoDetect: true,
    fallbackToDefault: true,
    trackLanguageEvents: true
};

// ===== TRADUCCIONES COMPLETAS =====
const translations = {
    // === NAVEGACIÓN Y HEADER ===
    'English': { en: 'English', es: 'Inglés' },
    'Español': { en: 'Spanish', es: 'Español' },
    
    // === HERO SECTION ===
    'Revolutionary Health Formula': { 
        en: 'Revolutionary Health Formula', 
        es: 'Fórmula Revolucionaria de Salud' 
    },
    'Transform Your Health, Transform Your Life': { 
        en: 'Transform Your Health, Transform Your Life', 
        es: 'Transforma Tu Salud, Transforma Tu Vida' 
    },
    'Discover the revolutionary supplement that thousands are using to reclaim their energy, vitality, and well-being with scientifically-proven ingredients.': { 
        en: 'Discover the revolutionary supplement that thousands are using to reclaim their energy, vitality, and well-being with scientifically-proven ingredients.', 
        es: 'Descubre el suplemento revolucionario que miles están usando para recuperar su energía, vitalidad y bienestar con ingredientes científicamente probados.' 
    },
    'Happy Customers': { en: 'Happy Customers', es: 'Clientes Felices' },
    'Success Rate': { en: 'Success Rate', es: 'Tasa de Éxito' },
    'Day Guarantee': { en: 'Day Guarantee', es: 'Días de Garantía' },
    'Start Your Transformation': { en: 'Start Your Transformation', es: 'Comienza Tu Transformación' },
    'Watch How It Works': { en: 'Watch How It Works', es: 'Ver Cómo Funciona' },
    'FDA Approved': { en: 'FDA Approved', es: 'Aprobado FDA' },
    '100% Organic': { en: '100% Organic', es: '100% Orgánico' },
    'Lab Tested': { en: 'Lab Tested', es: 'Probado en Lab' },
    'Scroll to discover more': { en: 'Scroll to discover more', es: 'Desliza para descubrir más' },

    // === BENEFITS SECTION ===
    'Experience These Life-Changing Benefits': { 
        en: 'Experience These Life-Changing Benefits', 
        es: 'Experimenta Estos Beneficios Transformadores' 
    },
    'Scientifically formulated to optimize your body\'s natural processes': { 
        en: 'Scientifically formulated to optimize your body\'s natural processes', 
        es: 'Formulado científicamente para optimizar los procesos naturales de tu cuerpo' 
    },
    'Boosted Energy': { en: 'Boosted Energy', es: 'Energía Potenciada' },
    'Feel more energized throughout the day without crashes or jitters, powered by natural adaptogens': { 
        en: 'Feel more energized throughout the day without crashes or jitters, powered by natural adaptogens', 
        es: 'Siéntete más energizado durante todo el día sin caídas ni nerviosismo, potenciado por adaptógenos naturales' 
    },
    'Learn how it works': { en: 'Learn how it works', es: 'Aprende cómo funciona' },
    'Enhanced Immunity': { en: 'Enhanced Immunity', es: 'Inmunidad Mejorada' },
    'Strengthen your body\'s natural defenses with our powerful immune-boosting formula': { 
        en: 'Strengthen your body\'s natural defenses with our powerful immune-boosting formula', 
        es: 'Fortalece las defensas naturales de tu cuerpo con nuestra potente fórmula que estimula la inmunidad' 
    },
    'See the ingredients': { en: 'See the ingredients', es: 'Ver los ingredientes' },
    'Improved Sleep': { en: 'Improved Sleep', es: 'Mejor Sueño' },
    'Enjoy deeper, more restful sleep that leaves you refreshed and rejuvenated every morning': { 
        en: 'Enjoy deeper, more restful sleep that leaves you refreshed and rejuvenated every morning', 
        es: 'Disfruta de un sueño más profundo y reparador que te deja renovado y rejuvenecido cada mañana' 
    },
    'Discover the science': { en: 'Discover the science', es: 'Descubre la ciencia' },

    // === FEATURES SECTION ===
    'Why VitalLife Is Different': { 
        en: 'Why VitalLife Is Different', 
        es: 'Por Qué VitalLife Es Diferente' 
    },
    'Science-Backed Formula': { 
        en: 'Science-Backed Formula', 
        es: 'Fórmula Respaldada por la Ciencia' 
    },
    'Our unique blend of adaptogens, vitamins, and minerals is based on over 50 clinical studies to optimize your body\'s natural processes and maximize bioavailability.': { 
        en: 'Our unique blend of adaptogens, vitamins, and minerals is based on over 50 clinical studies to optimize your body\'s natural processes and maximize bioavailability.', 
        es: 'Nuestra mezcla única de adaptógenos, vitaminas y minerales está basada en más de 50 estudios clínicos para optimizar los procesos naturales de tu cuerpo y maximizar la biodisponibilidad.' 
    },
    'Read the Research': { en: 'Read the Research', es: 'Leer la Investigación' },
    'Premium Quality Ingredients': { 
        en: 'Premium Quality Ingredients', 
        es: 'Ingredientes de Calidad Premium' 
    },
    'We source only the highest quality, organic ingredients from certified farms worldwide and test each batch for purity and potency in our state-of-the-art laboratory.': { 
        en: 'We source only the highest quality, organic ingredients from certified farms worldwide and test each batch for purity and potency in our state-of-the-art laboratory.', 
        es: 'Obtenemos solo ingredientes orgánicos de la más alta calidad de granjas certificadas en todo el mundo y probamos cada lote para verificar su pureza y potencia en nuestro laboratorio de última generación.' 
    },
    'View Certification': { en: 'View Certification', es: 'Ver Certificación' },

    // === RESULTS SECTION ===
    'Real Results from Real People': { 
        en: 'Real Results from Real People', 
        es: 'Resultados Reales de Personas Reales' 
    },
    'Join thousands who have transformed their health with VitalLife': { 
        en: 'Join thousands who have transformed their health with VitalLife', 
        es: 'Únete a miles que han transformado su salud con VitalLife' 
    },
    'Marketing Executive, NYC': { en: 'Marketing Executive, NYC', es: 'Ejecutiva de Marketing, NYC' },
    '"After just one month, my energy levels are through the roof. I no longer need afternoon coffee, and I\'m sleeping better than I have in years! VitalLife has truly transformed my daily routine."': { 
        en: '"After just one month, my energy levels are through the roof. I no longer need afternoon coffee, and I\'m sleeping better than I have in years! VitalLife has truly transformed my daily routine."', 
        es: '"Después de solo un mes, mis niveles de energía están por las nubes. Ya no necesito café por la tarde, ¡y estoy durmiendo mejor de lo que he dormido en años! VitalLife realmente ha transformado mi rutina diaria."' 
    },
    'Energy Increase': { en: 'Energy Increase', es: 'Aumento de Energía' },
    'Days': { en: 'Days', es: 'Días' },
    'Software Engineer, SF': { en: 'Software Engineer, SF', es: 'Ingeniero de Software, SF' },
    '"I used to catch every cold going around the office. Since starting VitalLife, I haven\'t been sick once in six months. My immune system feels bulletproof!"': { 
        en: '"I used to catch every cold going around the office. Since starting VitalLife, I haven\'t been sick once in six months. My immune system feels bulletproof!"', 
        es: '"Solía contraer todos los resfriados que circulaban por la oficina. Desde que comencé con VitalLife, no me he enfermado ni una vez en seis meses. ¡Mi sistema inmunológico se siente a prueba de balas!"' 
    },
    'Sick Days': { en: 'Sick Days', es: 'Días de Enfermedad' },
    'Months': { en: 'Months', es: 'Meses' },
    'Start Your Transformation Today': { 
        en: 'Start Your Transformation Today', 
        es: 'Comienza Tu Transformación Hoy' 
    },

    // === GUARANTEE SECTION ===
    '100% Money Back Guarantee': { 
        en: '100% Money Back Guarantee', 
        es: 'Garantía de Devolución del 100%' 
    },
    'We\'re so confident you\'ll love VitalLife that we offer a 60-day, no-questions-asked money back guarantee. If you don\'t see results, we\'ll refund every penny.': { 
        en: 'We\'re so confident you\'ll love VitalLife that we offer a 60-day, no-questions-asked money back guarantee. If you don\'t see results, we\'ll refund every penny.', 
        es: 'Estamos tan seguros de que te encantará VitalLife que ofrecemos una garantía de devolución de dinero de 60 días sin hacer preguntas. Si no ves resultados, te devolveremos hasta el último centavo.' 
    },
    '60-Day Trial': { en: '60-Day Trial', es: 'Prueba de 60 Días' },
    'No Questions Asked': { en: 'No Questions Asked', es: 'Sin Preguntas' },
    'Full Refund': { en: 'Full Refund', es: 'Reembolso Completo' },

    // === PRICING SECTION ===
    'Ready to Transform Your Health?': { 
        en: 'Ready to Transform Your Health?', 
        es: '¿Listo para Transformar tu Salud?' 
    },
    'Join thousands of satisfied customers who have already experienced the VitalLife difference': { 
        en: 'Join thousands of satisfied customers who have already experienced the VitalLife difference', 
        es: 'Únete a miles de clientes satisfechos que ya han experimentado la diferencia VitalLife' 
    },
    'Most Popular': { en: 'Most Popular', es: 'Más Popular' },
    'VitalLife Premium': { en: 'VitalLife Premium', es: 'VitalLife Premium' },
    '3-Month Supply': { en: '3-Month Supply', es: 'Suministro de 3 Meses' },
    'Regular: $269.97': { en: 'Regular: $269.97', es: 'Regular: $269.97' },
    'Save $89.98 (33% OFF)': { en: 'Save $89.98 (33% OFF)', es: 'Ahorra $89.98 (33% DESC)' },
    'Just $59.99 per bottle': { en: 'Just $59.99 per bottle', es: 'Solo $59.99 por frasco' },
    '3 Bottles (90-day supply)': { en: '3 Bottles (90-day supply)', es: '3 Frascos (suministro de 90 días)' },
    'FREE Shipping & Handling': { en: 'FREE Shipping & Handling', es: 'Envío y Manejo GRATIS' },
    '60-Day Money Back Guarantee': { en: '60-Day Money Back Guarantee', es: 'Garantía de 60 Días' },
    'FREE Health & Wellness Guide': { en: 'FREE Health & Wellness Guide', es: 'Guía de Salud y Bienestar GRATIS' },
    'Get VitalLife Now': { en: 'Get VitalLife Now', es: 'Obtén VitalLife Ahora' },
    'Secure Checkout': { en: 'Secure Checkout', es: 'Pago Seguro' },
    'Fast Delivery': { en: 'Fast Delivery', es: 'Entrega Rápida' },
    'Privacy Protected': { en: 'Privacy Protected', es: 'Privacidad Protegida' },

    // === FOOTER ===
    'Transforming lives through science-backed nutrition and wellness solutions.': { 
        en: 'Transforming lives through science-backed nutrition and wellness solutions.', 
        es: 'Transformando vidas a través de nutrición y soluciones de bienestar respaldadas por la ciencia.' 
    },
    'Product': { en: 'Product', es: 'Producto' },
    'Ingredients': { en: 'Ingredients', es: 'Ingredientes' },
    'Science': { en: 'Science', es: 'Ciencia' },
    'Reviews': { en: 'Reviews', es: 'Reseñas' },
    'Support': { en: 'Support', es: 'Soporte' },
    'Contact Us': { en: 'Contact Us', es: 'Contáctanos' },
    'FAQ': { en: 'FAQ', es: 'Preguntas' },
    'Shipping': { en: 'Shipping', es: 'Envío' },
    'Legal': { en: 'Legal', es: 'Legal' },
    'Privacy Policy': { en: 'Privacy Policy', es: 'Política de Privacidad' },
    'Terms of Service': { en: 'Terms of Service', es: 'Términos de Servicio' },
    'Refund Policy': { en: 'Refund Policy', es: 'Política de Reembolso' },
    '© 2025 VitalLife. All rights reserved.': { 
        en: '© 2025 VitalLife. All rights reserved.', 
        es: '© 2025 VitalLife. Todos los derechos reservados.' 
    },
    '*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.': { 
        en: '*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.', 
        es: '*Estas declaraciones no han sido evaluadas por la Administración de Alimentos y Medicamentos. Este producto no está destinado a diagnosticar, tratar, curar o prevenir ninguna enfermedad.' 
    },

    // === NAVEGACIÓN ===
    'Benefits': { en: 'Benefits', es: 'Beneficios' },
    'Features': { en: 'Features', es: 'Características' },
    'Results': { en: 'Results', es: 'Resultados' },
    'Pricing': { en: 'Pricing', es: 'Precios' }
};

// ===== CLASE PRINCIPAL DE TRADUCCIÓN =====
class TranslationManager {
    constructor() {
        this.currentLanguage = TRANSLATION_CONFIG.defaultLanguage;
        this.translations = translations;
        this.observers = [];
        this.animationEnabled = true;
        
        this.init();
    }
    
    init() {
        this.detectLanguage();
        this.setupLanguageToggle();
        this.loadSavedLanguage();
        this.applyTranslations();
        this.setupMutationObserver();
        this.trackInitialLanguage();
    }
    
    // ===== DETECCIÓN DE IDIOMA =====
    detectLanguage() {
        if (!TRANSLATION_CONFIG.autoDetect) return;
        
        // Detectar idioma del navegador
        const browserLang = navigator.language.split('-')[0];
        
        // Detectar idioma de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        
        // Prioridad: URL > localStorage > navegador > default
        if (urlLang && TRANSLATION_CONFIG.supportedLanguages.includes(urlLang)) {
            this.currentLanguage = urlLang;
        } else if (TRANSLATION_CONFIG.supportedLanguages.includes(browserLang)) {
            this.currentLanguage = browserLang;
        }
    }
    
    // ===== CONFIGURACIÓN DEL TOGGLE =====
    setupLanguageToggle() {
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleLanguage();
            });
            
            // Actualizar el estado inicial del botón
            this.updateToggleButton();
        }
    }
    
    // ===== GESTIÓN DE IDIOMAS =====
    toggleLanguage() {
        const newLang = this.currentLanguage === 'en' ? 'es' : 'en';
        this.setLanguage(newLang);
    }
    
    setLanguage(lang) {
        if (!TRANSLATION_CONFIG.supportedLanguages.includes(lang)) {
            console.warn(`Language ${lang} is not supported`);
            return;
        }
        
        const previousLang = this.currentLanguage;
        this.currentLanguage = lang;
        
        // Aplicar traducciones
        this.applyTranslations();
        
        // Actualizar botón de toggle
        this.updateToggleButton();
        
        // Guardar preferencia
        this.saveLanguagePreference();
        
        // Tracking del cambio de idioma
        this.trackLanguageChange(previousLang, lang);
        
        // Disparar evento personalizado
        this.dispatchLanguageChangeEvent(previousLang, lang);
        
        // Actualizar URL si es necesario
        this.updateURL();
    }
    
    // ===== APLICACIÓN DE TRADUCCIONES =====
    applyTranslations() {
        // Elementos con clases de idioma
        this.updateLanguageElements();
        
        // Elementos con atributos data-translate
        this.updateDataTranslateElements();
        
        // Placeholders y otros atributos
        this.updateAttributeTranslations();
        
        // Notificar a observadores
        this.notifyObservers();
    }
    
    updateLanguageElements() {
        const elementsToShow = document.querySelectorAll(`.lang-${this.currentLanguage}`);
        const elementsToHide = document.querySelectorAll(
            TRANSLATION_CONFIG.supportedLanguages
                .filter(lang => lang !== this.currentLanguage)
                .map(lang => `.lang-${lang}`)
                .join(', ')
        );
        
        // Ocultar elementos del idioma anterior
        elementsToHide.forEach(element => {
            if (this.animationEnabled) {
                this.fadeOut(element, () => {
                    element.style.display = 'none';
                });
            } else {
                element.style.display = 'none';
            }
        });
        
        // Mostrar elementos del idioma actual
        elementsToShow.forEach(element => {
            if (this.animationEnabled) {
                element.style.display = '';
                this.fadeIn(element);
            } else {
                element.style.display = '';
            }
        });
    }
    
    updateDataTranslateElements() {
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const translationKey = element.getAttribute('data-translate');
            const translation = this.getTranslation(translationKey);
            
            if (translation) {
                if (this.animationEnabled) {
                    this.animateTextChange(element, translation);
                } else {
                    element.textContent = translation;
                }
            }
        });
    }
    
    updateAttributeTranslations() {
        // Placeholders
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            const translation = this.getTranslation(key);
            if (translation) {
                element.placeholder = translation;
            }
        });
        
        // Títulos (tooltips)
        const titleElements = document.querySelectorAll('[data-translate-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-translate-title');
            const translation = this.getTranslation(key);
            if (translation) {
                element.title = translation;
            }
        });
        
        // Alt text para imágenes
        const altElements = document.querySelectorAll('[data-translate-alt]');
        altElements.forEach(element => {
            const key = element.getAttribute('data-translate-alt');
            const translation = this.getTranslation(key);
            if (translation) {
                element.alt = translation;
            }
        });
    }
    
    // ===== OBTENCIÓN DE TRADUCCIONES =====
    getTranslation(key) {
        const translationObj = this.translations[key];
        
        if (!translationObj) {
            if (TRANSLATION_CONFIG.fallbackToDefault) {
                console.warn(`Translation not found for key: ${key}`);
                return key; // Retornar la clave como fallback
            }
            return null;
        }
        
        return translationObj[this.currentLanguage] || translationObj[TRANSLATION_CONFIG.defaultLanguage] || key;
    }
    
    // ===== ANIMACIONES =====
    fadeOut(element, callback) {
        element.style.transition = 'opacity 0.2s ease-out';
        element.style.opacity = '0';
        
        setTimeout(() => {
            if (callback) callback();
        }, 200);
    }
    
    fadeIn(element) {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.2s ease-in';
        
        // Force reflow
        element.offsetHeight;
        
        element.style.opacity = '1';
    }
    
    animateTextChange(element, newText) {
        const originalText = element.textContent;
        
        if (originalText === newText) return;
        
        element.style.transition = 'opacity 0.15s ease-out';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.textContent = newText;
            element.style.opacity = '1';
        }, 150);
    }
    
    // ===== ACTUALIZACIÓN DE UI =====
    updateToggleButton() {
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.setAttribute('data-lang', this.currentLanguage);
            
            // Actualizar texto del botón si es necesario
            const enText = langToggle.querySelector('.lang-en');
            const esText = langToggle.querySelector('.lang-es');
            
            if (enText && esText) {
                if (this.currentLanguage === 'en') {
                    enText.style.display = 'inline';
                    esText.style.display = 'none';
                } else {
                    enText.style.display = 'none';
                    esText.style.display = 'inline';
                }
            }
        }
    }
    
    updateURL() {
        if (this.currentLanguage !== TRANSLATION_CONFIG.defaultLanguage) {
            const url = new URL(window.location);
            url.searchParams.set('lang', this.currentLanguage);
            window.history.replaceState({}, '', url);
        } else {
            const url = new URL(window.location);
            url.searchParams.delete('lang');
            window.history.replaceState({}, '', url);
        }
    }
    
    // ===== PERSISTENCIA =====
    saveLanguagePreference() {
        try {
            localStorage.setItem(TRANSLATION_CONFIG.storageKey, this.currentLanguage);
        } catch (error) {
            console.warn('Could not save language preference:', error);
        }
    }
    
    loadSavedLanguage() {
        try {
            const savedLang = localStorage.getItem(TRANSLATION_CONFIG.storageKey);
            if (savedLang && TRANSLATION_CONFIG.supportedLanguages.includes(savedLang)) {
                this.currentLanguage = savedLang;
            }
        } catch (error) {
            console.warn('Could not load language preference:', error);
        }
    }
    
    // ===== TRACKING =====
    trackLanguageChange(fromLang, toLang) {
        if (!TRANSLATION_CONFIG.trackLanguageEvents) return;
        
        const eventData = {
            from_language: fromLang,
            to_language: toLang,
            method: 'manual_toggle',
            timestamp: new Date().toISOString()
        };
        
        // Tracking interno
        if (typeof trackCustomEvent === 'function') {
            trackCustomEvent('language_change', eventData);
        }
        
        // Google Analytics
        if (typeof trackGAEvent === 'function') {
            trackGAEvent('language_change', eventData);
        }
        
        // Meta Pixel
        if (typeof trackMetaCustomEvent === 'function') {
            trackMetaCustomEvent('LanguageChange', eventData);
        }
        
        // Microsoft Clarity
        if (window.vitalLifePage?.clarity) {
            window.vitalLifePage.clarity.track('LanguageChange', eventData);
        }
    }
    
    trackInitialLanguage() {
        if (!TRANSLATION_CONFIG.trackLanguageEvents) return;
        
        const eventData = {
            initial_language: this.currentLanguage,
            detected_language: navigator.language,
            source: 'page_load'
        };
        
        if (typeof trackCustomEvent === 'function') {
            trackCustomEvent('language_detected', eventData);
        }
    }
    
    // ===== EVENTOS =====
    dispatchLanguageChangeEvent(fromLang, toLang) {
        const event = new CustomEvent('languagechange', {
            detail: {
                from: fromLang,
                to: toLang,
                currentLanguage: this.currentLanguage
            }
        });
        
        document.dispatchEvent(event);
    }
    
    // ===== MUTATION OBSERVER =====
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.applyTranslationsToElement(node);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    applyTranslationsToElement(element) {
        // Aplicar traducciones a un elemento específico y sus hijos
        const langElements = element.querySelectorAll(`[class*="lang-"]`);
        const translateElements = element.querySelectorAll('[data-translate]');
        
        langElements.forEach(el => {
            const classes = el.className.split(' ');
            const langClass = classes.find(cls => cls.startsWith('lang-'));
            
            if (langClass) {
                const elementLang = langClass.replace('lang-', '');
                el.style.display = elementLang === this.currentLanguage ? '' : 'none';
            }
        });
        
        translateElements.forEach(el => {
            const key = el.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            if (translation) {
                el.textContent = translation;
            }
        });
    }
    
    // ===== OBSERVADORES =====
    addObserver(callback) {
        this.observers.push(callback);
    }
    
    removeObserver(callback) {
        const index = this.observers.indexOf(callback);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    
    notifyObservers() {
        this.observers.forEach(callback => {
            try {
                callback(this.currentLanguage);
            } catch (error) {
                console.error('Error in translation observer:', error);
            }
        });
    }
    
    // ===== API PÚBLICA =====
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getSupportedLanguages() {
        return [...TRANSLATION_CONFIG.supportedLanguages];
    }
    
    isLanguageSupported(lang) {
        return TRANSLATION_CONFIG.supportedLanguages.includes(lang);
    }
    
    addTranslation(key, translations) {
        this.translations[key] = translations;
    }
    
    addTranslations(translationsObj) {
        Object.assign(this.translations, translationsObj);
    }
    
    translateText(key) {
        return this.getTranslation(key);
    }
    
    setAnimationEnabled(enabled) {
        this.animationEnabled = enabled;
    }
    
    forceUpdate() {
        this.applyTranslations();
    }
}

// ===== FUNCIONES UTILITARIAS =====
function detectUserLanguage() {
    // Detectar idioma preferido del usuario
    const browserLang = navigator.language.split('-')[0];
    const acceptedLanguages = navigator.languages?.map(lang => lang.split('-')[0]) || [];
    
    for (let lang of acceptedLanguages) {
        if (TRANSLATION_CONFIG.supportedLanguages.includes(lang)) {
            return lang;
        }
    }
    
    return TRANSLATION_CONFIG.supportedLanguages.includes(browserLang) 
        ? browserLang 
        : TRANSLATION_CONFIG.defaultLanguage;
}

function formatCurrency(amount, currency = 'USD') {
    const lang = window.translationManager?.getCurrentLanguage() || 'en';
    
    try {
        return new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    } catch (error) {
        return `$${amount}`;
    }
}

function formatDate(date, options = {}) {
    const lang = window.translationManager?.getCurrentLanguage() || 'en';
    
    try {
        return new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', options).format(date);
    } catch (error) {
        return date.toLocaleDateString();
    }
}

// ===== FUNCIONES PÚBLICAS =====
function setLanguage(lang) {
    if (window.translationManager) {
        window.translationManager.setLanguage(lang);
    }
}

function getCurrentLanguage() {
    return window.translationManager ? window.translationManager.getCurrentLanguage() : TRANSLATION_CONFIG.defaultLanguage;
}

function translateText(key) {
    return window.translationManager ? window.translationManager.translateText(key) : key;
}

function addTranslation(key, translations) {
    if (window.translationManager) {
        window.translationManager.addTranslation(key, translations);
    }
}

// ===== INICIALIZACIÓN =====
// Inicializar el sistema de traducción cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.translationManager = new TranslationManager();
    
    // Hacer funciones disponibles globalmente
    window.setLanguage = setLanguage;
    window.getCurrentLanguage = getCurrentLanguage;
    window.translateText = translateText;
    window.addTranslation = addTranslation;
    window.formatCurrency = formatCurrency;
    window.formatDate = formatDate;
});

// ===== DEBUGGING PARA DESARROLLO =====
if (typeof window !== 'undefined') {
    window.TranslationDebug = {
        getCurrentLanguage: () => window.translationManager?.getCurrentLanguage(),
        getTranslations: () => window.translationManager?.translations,
        setLanguage: setLanguage,
        translateText: translateText,
        getConfig: () => TRANSLATION_CONFIG,
        forceUpdate: () => window.translationManager?.forceUpdate(),
        detectLanguage: detectUserLanguage
    };
}

console.log('Enhanced Translation System loaded successfully');