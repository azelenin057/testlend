function setupPhoneInput(input) {
    if (input.value === '') {
        input.value = '+380';
    }

    input.addEventListener('input', (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9+]/g, '');

        if (!value.startsWith('+380')) {
            value = '+380' + value.replace(/^\+?380/, '');
        }

        value = value.slice(0, 13);
        e.target.value = value;

        if (!e.target.value.startsWith('+380')) {
            e.target.value = '+380';
        }
    });

    input.addEventListener('keydown', (e) => {
        const cursorPosition = e.target.selectionStart;
        const value = e.target.value;

        if (cursorPosition <= 4 && (e.key === 'Backspace' || e.key === 'Delete')) {
            e.preventDefault();
        }

        if (value.length >= 13 && e.key !== 'Backspace' && e.key !== 'Delete' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
    });

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

export { initPhoneInputs };