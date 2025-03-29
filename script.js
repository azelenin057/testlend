document.addEventListener('DOMContentLoaded', () => {
    // Открытие/закрытие меню
    const menuIcon = document.querySelector('.menu-icon');
    const navMenu = document.querySelector('.nav-menu');

    menuIcon.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Обработка лайков и дизлайков для комментариев
    const comments = document.querySelectorAll('.comment');
    comments.forEach(comment => {
        const commentId = comment.getAttribute('data-comment-id');
        const likeButton = comment.querySelector('.action-like');
        const likeCountElement = comment.querySelector('.like-count');
        let likeCount = parseInt(likeCountElement.textContent);
        const dislikeButton = comment.querySelector('.action-dislike');
        const dislikeCountElement = dislikeButton.querySelector('.dislike-count');
        let dislikeCount = parseInt(dislikeCountElement.textContent);

        let hasLiked = localStorage.getItem(`liked_${commentId}`) === 'true';
        if (hasLiked) likeButton.classList.add('liked');
        let hasDisliked = localStorage.getItem(`disliked_${commentId}`) === 'true';
        if (hasDisliked) dislikeButton.classList.add('disliked');

        likeButton.addEventListener('click', () => {
            if (hasLiked) {
                likeCount -= 1;
                likeCountElement.textContent = likeCount;
                localStorage.setItem(`liked_${commentId}`, 'false');
                likeButton.classList.remove('liked');
                hasLiked = false;
            } else {
                likeCount += 1;
                likeCountElement.textContent = likeCount;
                localStorage.setItem(`liked_${commentId}`, 'true');
                likeButton.classList.add('liked');
                hasLiked = true;
                if (hasDisliked) {
                    dislikeCount -= 1;
                    dislikeCountElement.textContent = dislikeCount;
                    localStorage.setItem(`disliked_${commentId}`, 'false');
                    dislikeButton.classList.remove('disliked');
                    hasDisliked = false;
                }
            }
        });

        dislikeButton.addEventListener('click', () => {
            if (hasDisliked) {
                dislikeCount -= 1;
                dislikeCountElement.textContent = dislikeCount;
                localStorage.setItem(`disliked_${commentId}`, 'false');
                dislikeButton.classList.remove('disliked');
                hasDisliked = false;
            } else {
                dislikeCount += 1;
                dislikeCountElement.textContent = dislikeCount;
                localStorage.setItem(`disliked_${commentId}`, 'true');
                dislikeButton.classList.add('disliked');
                hasDisliked = true;
                if (hasLiked) {
                    likeCount -= 1;
                    likeCountElement.textContent = likeCount;
                    localStorage.setItem(`liked_${commentId}`, 'false');
                    likeButton.classList.remove('liked');
                    hasLiked = false;
                }
            }
        });
    });

    // Логика для теста
    const openTestModal = document.getElementById('open-test-modal');
    const testModal = document.getElementById('test-modal');
    const closeTestModal = document.getElementById('close-test-modal');
    const testContent = document.getElementById('test-content');
    const questions = document.querySelectorAll('.question');
    const resultSection = document.getElementById('test-result');
    const resultText = document.getElementById('result-text');

    let currentQuestion = 0;
    let score = 0;
    let testAnswers = [];

    openTestModal.addEventListener('click', () => {
        testModal.style.display = 'flex';
        currentQuestion = 0;
        score = 0;
        testAnswers = [];
        questions.forEach((q, index) => {
            q.style.display = index === 0 ? 'block' : 'none';
        });
        resultSection.style.display = 'none';
    });

    closeTestModal.addEventListener('click', () => {
        testModal.style.display = 'none';
    });

    testModal.addEventListener('click', (e) => {
        if (e.target === testModal) {
            testModal.style.display = 'none';
        }
    });

    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            const questionText = questions[currentQuestion].querySelector('p').textContent;
            const answerText = option.textContent;
            testAnswers.push({ question: questionText, answer: answerText });
            console.log('Сохранённый ответ:', { question: questionText, answer: answerText });
            console.log('Текущие ответы:', testAnswers);

            score += parseInt(option.getAttribute('data-score'));
            questions[currentQuestion].style.display = 'none';
            currentQuestion++;

            if (currentQuestion < questions.length) {
                questions[currentQuestion].style.display = 'block';
            } else {
                resultSection.style.display = 'block';
                if (score >= 8) {
                    resultText.textContent = 'Ваші суглоби потребують негайної уваги! Ви відчуваєте значний дискомфорт, який може свідчити про серйозні проблеми.';
                } else if (score >= 4) {
                    resultText.textContent = 'У вас є певні проблеми з суглобами, які можуть погіршитися, якщо не вжити заходів.';
                } else {
                    resultText.textContent = 'Ваші суглоби в хорошому стані, але профілактика ніколи не завадить!';
                }
            }
        });
    });

    // Настройка текущей даты
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const currentDateElement = document.getElementById('current-date');
    const modalCurrentDateElement = document.getElementById('modal-current-date');

    if (currentDateElement) {
        currentDateElement.textContent = formattedDate;
    } else {
        console.warn("Элемент с ID 'current-date' не найден на странице.");
    }

    if (modalCurrentDateElement) {
        modalCurrentDateElement.textContent = formattedDate;
    } else {
        console.warn("Элемент с ID 'modal-current-date' не найден на странице.");
    }

    // Функция для извлечения параметра из URL (дублируем для использования в script.js)
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Проверяем, инициализирован ли Facebook Pixel
    const pixelId = getQueryParam('pixel');
    const isPixelInitialized = pixelId && typeof fbq !== 'undefined';

    // Обработка отправки формы в CRM
    const apiUrl = 'https://ecohealth-crm.voiptime.app/api/v2/admin/order';
    const adminToken = 'Your admin token'; // Замените на ваш реальный токен авторизации

    const submitOrderToCRM = async (formData, formId, retries = 3) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                let phone = formData.get('phone');
                if (!phone.startsWith('+')) {
                    phone = '+380' + phone;
                }

                let comment = '';
                if (formId === 'modal-order-form' && testAnswers.length > 0) {
                    comment = testAnswers.map(answer => `${answer.question} - ${answer.answer}`).join('\n');
                }

                console.log('Отправляемые данные:', {
                    full_name: formData.get('full_name'),
                    phone: phone,
                    shop_id: 1,
                    project_id: 1,
                    price: 0,
                    status_id: 1,
                    cart: [{ good_id: 1, quantity: 1 }],
                    comment: comment
                });

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': adminToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        full_name: formData.get('full_name'),
                        phone: phone,
                        shop_id: 1,
                        project_id: 1,
                        price: 0,
                        status_id: 1,
                        cart: [{ good_id: 1, quantity: 1 }],
                        comment: comment
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    console.error('Ответ сервера при ошибке:', result);
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                if (result.success) {
                    // Отправляем событие Lead в Facebook Pixel, если он инициализирован
                    if (isPixelInitialized) {
                        fbq('track', 'Lead');
                        console.log('Событие Lead отправлено в Facebook Pixel');
                    }
                    // Перенаправляем на страницу благодарности
                    window.location.href = 'thank-you.html';
                    return;
                } else {
                    throw new Error(result.error || 'Неизвестная ошибка от сервера');
                }
            } catch (error) {
                if (attempt === retries) {
                    console.error('Помилка після всех спроб:', error.message);
                    if (error.message.includes('Failed to fetch')) {
                        alert('Не вдалося підключитися до сервера CRM. Перевірте URL або налаштування CORS.');
                    } else {
                        alert(`Сталася помилка при відправці даних: ${error.message}`);
                    }
                } else {
                    console.warn(`Спроба ${attempt} не вдалася. Повтор через 2 секунди...`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }
    };

    // Обработка основной формы
    const mainForm = document.getElementById('main-order-form');
    mainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(mainForm);
        submitOrderToCRM(formData, 'main-order-form');
    });

    // Обработка формы в модальном окне
    const modalForm = document.getElementById('modal-order-form');
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(modalForm);
        submitOrderToCRM(formData, 'modal-order-form');
    });
});