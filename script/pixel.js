function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function initPixel() {
    const pixelId = getQueryParam('pixel');
    const isPixelInitialized = pixelId && typeof fbq !== 'undefined';

    return isPixelInitialized;
}

function trackLead() {
    if (typeof fbq !== 'undefined') {
        try {
            fbq('track', 'Lead');
            console.log('Событие Lead отправлено в Facebook Pixel');
        } catch (error) {
            console.warn('Не удалось отправить событие Lead в Facebook Pixel:', error.message);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initPixel, trackLead };
} else {
    window.isPixelInitialized = initPixel();
}