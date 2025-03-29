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
        
        // Лайки
        const likeButton = comment.querySelector('.action-like');
        const likeCountElement = comment.querySelector('.like-count');
        let likeCount = parseInt(likeCountElement.textContent);
        
        // Дизлайки
        const dislikeButton = comment.querySelector('.action-dislike');
        const dislikeCountElement = dislikeButton.querySelector('.dislike-count');
        let dislikeCount = parseInt(dislikeCountElement.textContent);

        // Проверяем, лайкнул ли пользователь этот комментарий ранее
        let hasLiked = localStorage.getItem(`liked_${commentId}`) === 'true';
        if (hasLiked) {
            likeButton.classList.add('liked');
        }

        // Проверяем, дизлайкнул ли пользователь этот комментарий ранее
        let hasDisliked = localStorage.getItem(`disliked_${commentId}`) === 'true';
        if (hasDisliked) {
            dislikeButton.classList.add('disliked');
        }

        // Обработчик для лайков
        likeButton.addEventListener('click', () => {
            if (hasLiked) {
                // Убираем лайк
                likeCount -= 1;
                likeCountElement.textContent = likeCount;
                localStorage.setItem(`liked_${commentId}`, 'false');
                likeButton.classList.remove('liked');
                hasLiked = false;
            } else {
                // Добавляем лайк
                likeCount += 1;
                likeCountElement.textContent = likeCount;
                localStorage.setItem(`liked_${commentId}`, 'true');
                likeButton.classList.add('liked');
                hasLiked = true;

                // Если пользователь лайкнул, убираем дизлайк
                if (hasDisliked) {
                    dislikeCount -= 1;
                    dislikeCountElement.textContent = dislikeCount;
                    localStorage.setItem(`disliked_${commentId}`, 'false');
                    dislikeButton.classList.remove('disliked');
                    hasDisliked = false;
                }
            }
        });

        // Обработчик для дизлайков
        dislikeButton.addEventListener('click', () => {
            if (hasDisliked) {
                // Убираем дизлайк
                dislikeCount -= 1;
                dislikeCountElement.textContent = dislikeCount;
                localStorage.setItem(`disliked_${commentId}`, 'false');
                dislikeButton.classList.remove('disliked');
                hasDisliked = false;
            } else {
                // Добавляем дизлайк
                dislikeCount += 1;
                dislikeCountElement.textContent = dislikeCount;
                localStorage.setItem(`disliked_${commentId}`, 'true');
                dislikeButton.classList.add('disliked');
                hasDisliked = true;

                // Если пользователь дизлайкнул, убираем лайк
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

    // Открытие модального окна
    openTestModal.addEventListener('click', () => {
        testModal.style.display = 'flex';
        currentQuestion = 0;
        score = 0;
        questions.forEach((q, index) => {
            q.style.display = index === 0 ? 'block' : 'none';
        });
        resultSection.style.display = 'none';
    });

    // Закрытие модального окна
    closeTestModal.addEventListener('click', () => {
        testModal.style.display = 'none';
    });

    // Закрытие модального окна при клике вне контента
    testModal.addEventListener('click', (e) => {
        if (e.target === testModal) {
            testModal.style.display = 'none';
        }
    });

    // Обработка ответов
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            score += parseInt(option.getAttribute('data-score'));
            questions[currentQuestion].style.display = 'none';
            currentQuestion++;

            if (currentQuestion < questions.length) {
                questions[currentQuestion].style.display = 'block';
            } else {
                // Показываем результат
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
});