document.addEventListener('DOMContentLoaded', () => {
    // Защита от повторной инициализации
    if (window.isInitialized) {
        return;
    }
    window.isInitialized = true;

    // Инициализация модулей
    initMenu();
    initComments();
    const testAnswers = initTest();
    initDate();
    initPhoneInputs();
    initPixel();
    initFormSubmit(testAnswers);
});