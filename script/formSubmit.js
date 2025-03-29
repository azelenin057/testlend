import { validatePhoneBeforeSubmit } from './phoneValidation.js';
import { trackLead } from './pixel.js';

async function submitOrderToCRM(formData, formId, testAnswers, retries = 3) {
    console.log(`Отправка формы ${formId} в ${new Date().toISOString()}`);
    if (!validatePhoneBeforeSubmit(formData, formId)) {
        console.log('Валидация телефона не пройдена');
        return;
    }

    const apiUrl = 'https://ecohealth-crm.voiptime.app/api/v2/admin/order';
    const adminToken = import.meta.env.VITE_ADMIN_TOKEN;
    console.log('Admin Token:', adminToken);

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            let phone = formData.get('phone');
            let comment = '';
            if (formId === 'modal-order-form' && testAnswers.length > 0) {
                comment = testAnswers.map(answer => `${answer.question} - ${answer.answer}`).join('\n');
            }

            const requestId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            console.log('Отправляемые данные:', {
                full_name: formData.get('full_name'),
                phone: phone,
                shop_id: 4,
                project_id: 2,
                price: 0,
                status_id: 1,
                cart: [{ good_id: 26, quantity: 1 }],
                comment: comment,
                requestId: requestId
            });

            const response = await fetch(apiUrl, {
                method: 'POST', // Пробуем POST, но можно попробовать PUT
                headers: {
                    'Authorization': adminToken, // Пробуем без Bearer, но можно добавить Bearer
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    full_name: formData.get('full_name'),
                    phone: phone,
                    shop_id: 4,
                    project_id: 2,
                    price: 0,
                    status_id: 1,
                    cart: [{ good_id: 26, quantity: 1 }],
                    comment: comment,
                    requestId: requestId
                })
            });

            console.log('Статус ответа:', response.status);
            const result = await response.json();
            console.log('Ответ от сервера:', result);

            if (!response.ok) {
                console.error('Ответ сервера при ошибке:', result);
                throw new Error(`HTTP error! Status: ${response.status} - ${result.error || 'Неизвестная ошибка'}`);
            }

            if (result.success) {
                console.log('Запрос успешен, перенаправляем на thank-you.html');
                if (window.isPixelInitialized) {
                    trackLead();
                }
                window.location.replace('/thank-you.html');
                console.log('Перенаправление выполнено');
                return;
            } else {
                throw new Error(result.error || 'Неизвестная ошибка от сервера');
            }
        } catch (error) {
            console.error(`Попытка ${attempt} не удалась:`, error.message);
            if (attempt === retries) {
                console.error('Помилка після всех спроб:', error.message);
                if (error.message.includes('Failed to fetch')) {
                    alert('Не вдалося підключитися до сервера CRM. Перевірте URL или налаштування CORS.');
                } else {
                    alert(`Сталася помилка при відправці даних: ${error.message}`);
                }
            } else {
                console.warn(`Спроба ${attempt} не вдалася. Повтор через 2 секунди...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
}

function initFormSubmit(testAnswers) {
    if (window.formSubmitInitialized) {
        console.log('initFormSubmit уже инициализирован, пропускаем повторную регистрацию');
        return;
    }
    window.formSubmitInitialized = true;

    console.log('Инициализация initFormSubmit в', new Date().toISOString());

    const mainForm = document.getElementById('main-order-form');
    const modalForm = document.getElementById('modal-order-form');
    const mainSubmitBtn = document.getElementById('main-submit-btn');
    const modalSubmitBtn = document.getElementById('modal-submit-btn');

    mainForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        mainSubmitBtn.disabled = true;
        const formData = new FormData(mainForm);
        await submitOrderToCRM(formData, 'main-order-form', testAnswers);
        mainSubmitBtn.disabled = false;
    });

    modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        modalSubmitBtn.disabled = true;
        const formData = new FormData(modalForm);
        await submitOrderToCRM(formData, 'modal-order-form', testAnswers);
        modalSubmitBtn.disabled = false;
    });
}

export { submitOrderToCRM, initFormSubmit };