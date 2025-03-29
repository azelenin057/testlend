function validatePhoneNumber(phone) {
    const phonePattern = /^\+380\d{9}$/;
    return phonePattern.test(phone);
}

function validatePhoneBeforeSubmit(formData, formId) {
    const phone = formData.get('phone');
    const phoneInput = formId === 'main-order-form' ? document.getElementById('main-phone') : document.getElementById('modal-phone');
    const phoneError = phoneInput.parentElement.querySelector('.phone-error');

    if (!validatePhoneNumber(phone)) {
        phoneError.style.display = 'block';
        phoneInput.style.borderColor = 'red';
        return false;
    }

    phoneError.style.display = 'none';
    phoneInput.style.borderColor = '#ccc';
    return true;
}

export { validatePhoneNumber, validatePhoneBeforeSubmit };