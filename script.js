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
    let testAnswers = []; // Массив для хранения вопросов и ответов

    openTestModal.addEventListener('click', () => {
        testModal.style.display = 'flex';
        currentQuestion = 0;
        score = 0;
        testAnswers = []; // Очищаем ответы при открытии теста
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
            // Сохраняем вопрос и ответ
            const questionText = questions[currentQuestion].querySelector('p').textContent;
            const answerText = option.textContent;
            testAnswers.push({ question: questionText, answer: answerText });

            // Обрабатываем логику теста
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
    document.getElementById('current-date').textContent = formattedDate;
    document.getElementById('modal-current-date').textContent = formattedDate;

    // Обработка отправки формы в CRM
    const apiUrl = 'https://ecohealth-crm.voiptime.app/api/v2/admin/order';
    const adminToken = 'qTrnYsKRx7TL'; // Замените на ваш реальный токен авторизации

    const submitOrderToCRM = async (formData) => {
        try {
            // Форматируем номер телефона (добавляем код страны, если его нет)
            let phone = formData.get('phone');
            if (!phone.startsWith('+')) {
                phone = '+380' + phone; // Предполагаем, что это украинский номер
            }

            // Форматируем ответы теста в строку "Вопрос - ответ"
            let comment = '';
            if (testAnswers.length > 0) {
                comment = testAnswers.map(answer => `${answer.question} - ${answer.answer}`).join('\n');
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': adminToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    full_name: formData.get('full_name'),
                    phone: phone,
                    shop_id: 4, // Замените на ваш shop_id
                    project_id: 2, // Замените на ваш project_id
                    price: 0, // Указываем цену (например, 0, если это бесплатный заказ)
                    status_id: 1, // Указываем статус (например, 1 для нового заказа)
                    cart: [ // Добавляем минимальный объект корзины
                        {
                            good_id: 26, // Замените на реальный good_id
                            quantity: 1
                        }
                    ],
                    comment: comment // Добавляем ответы теста в поле comment
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                alert('Дані успішно відправлено до CRM!');
            } else {
                console.error('Помилка відправки:', result.error);
                alert(`Сталася помилка при відправці даних до CRM: ${result.error}`);
            }
        } catch (error) {
            console.error('Помилка:', error.message);
            if (error.message.includes('Failed to fetch')) {
                alert('Не вдалося підключитися до сервера CRM. Перевірте URL або налаштування CORS.');
            } else {
                alert(`Сталася помилка при відправці даних: ${error.message}`);
            }
        }
    };

    // Обработка основной формы
    const mainForm = document.getElementById('main-order-form');
    mainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(mainForm);
        submitOrderToCRM(formData);
    });

    // Обработка формы в модальном окне
    const modalForm = document.getElementById('modal-order-form');
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(modalForm);
        submitOrderToCRM(formData);
    });
});