import { initMenu } from './menu.js';
import { initComments } from './comments.js';
import { initTest } from './test.js';
import { initDate } from './date.js';
import { initPhoneInputs } from './phoneInput.js';
import { initPixel, trackLead } from './pixel.js';
import { initFormSubmit } from './formSubmit.js';

document.addEventListener('DOMContentLoaded', () => {
    if (window.isInitialized) {
        return;
    }
    window.isInitialized = true;

    initMenu();
    initComments();
    const testAnswers = initTest();
    initDate();
    initPhoneInputs();
    window.isPixelInitialized = initPixel();
    window.trackLead = trackLead;
    initFormSubmit(testAnswers);
});