// Функция валидации номера телефона
function validatePhoneNumber(phone) {
    const phonePattern = /^\+380\d{9}$/;
    return phonePattern.test(phone);
}

// Функция для проверки номера телефона перед отправкой формы
function validatePhoneBeforeSubmit(formData, formId) {
    const phone = formData.get('phone');
    const phoneInput = formId === 'main-order-form' ? document.getElementById('main-phone') : document.getElementById('modal-phone');
    const phoneError = phoneInput.parentElement.querySelector('.phone-error');

    if (!validatePhoneNumber(phone)) {
        phoneError.style.display = 'block';
        phoneInput.style.borderColor = 'red';
        return false; // Валидация не пройдена
    }

    // Если валидация пройдена, скрываем сообщение об ошибке
    phoneError.style.display = 'none';
    phoneInput.style.borderColor = '#ccc';
    return true; // Валидация пройдена
}

// Экспортируем функции (для модульной системы, если используете)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validatePhoneNumber, validatePhoneBeforeSubmit };
}