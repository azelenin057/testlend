function initTest() {
    const openTestModal = document.getElementById('open-test-modal');
    const testModal = document.getElementById('test-modal');
    const closeTestModal = document.getElementById('close-test-modal');
    const testContent = document.getElementById('test-content');
    const questions = document.querySelectorAll('.question');
    const resultSection = document.getElementById('test-result');
    const resultText = document.getElementById('result-text');

    let currentQuestion = 0;
    let score = 0;
    const testAnswers = [];

    openTestModal.addEventListener('click', () => {
        testModal.style.display = 'flex';
        currentQuestion = 0;
        score = 0;
        testAnswers.length = 0;
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

    return testAnswers;
}

export { initTest };