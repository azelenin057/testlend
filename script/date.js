function initDate() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const currentDateElement = document.getElementById('current-date');
    const modalCurrentDateElement = document.getElementById('modal-current-date');
    const articleDateElement = document.getElementById('article-date');

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

    if (articleDateElement) {
        articleDateElement.textContent = formattedDate;
    } else {
        console.warn("Элемент с ID 'article-date' не найден на странице.");
    }
}

export { initDate };