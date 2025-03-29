function setupPhoneInput(input) {
    // Устанавливаем начальное значение
    if (input.value === '') {
        input.value = '+380';
    }

    // Обработчик ввода
    input.addEventListener('input', (e) => {
        let value = e.target.value;
        // Удаляем всё, кроме цифр и символа +
        value = value.replace(/[^0-9+]/g, '');

        // Проверяем, чтобы строка начиналась с +380
        if (!value.startsWith('+380')) {
            value = '+380' + value.replace(/^\+?380/, '');
        }

        // Ограничиваем длину до 13 символов (+380 + 9 цифр)
        value = value.slice(0, 13);
        e.target.value = value;

        // Проверяем, чтобы пользователь не мог удалить +380
        if (!e.target.value.startsWith('+380')) {
            e.target.value = '+380';
        }
    });

    // Обработчик для предотвращения удаления +380
    input.addEventListener('keydown', (e) => {
        const cursorPosition = e.target.selectionStart;
        const value = e.target.value;

        // Запрещаем удаление +380
        if (cursorPosition <= 4 && (e.key === 'Backspace' || e.key === 'Delete')) {
            e.preventDefault();
        }

        // Запрещаем ввод, если длина уже 13 символов
        if (value.length >= 13 && e.key !== 'Backspace' && e.key !== 'Delete' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
    });

    // Обработчик для предотвращения вставки некорректных данных
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
        let newValue = '+380' + pastedData;
        newValue = newValue.slice(0, 13);
        e.target.value = newValue;
    });
}

function initPhoneInputs() {
    const mainPhoneInput = document.getElementById('main-phone');
    const modalPhoneInput = document.getElementById('modal-phone');

    if (mainPhoneInput) {
        setupPhoneInput(mainPhoneInput);
    }
    if (modalPhoneInput) {
        setupPhoneInput(modalPhoneInput);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initPhoneInputs };
} else {
    initPhoneInputs();
}