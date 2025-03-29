function initMenu() {
    const menuIcon = document.querySelector('.menu-icon');
    const navMenu = document.querySelector('.nav-menu');

    menuIcon.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initMenu };
} else {
    initMenu();
}