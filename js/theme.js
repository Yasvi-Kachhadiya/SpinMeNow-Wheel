let currentTheme = localStorage.getItem('theme') || 'light';
const themeIcon = document.getElementById('themeIcon');

// Apply saved theme on page load
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.src = 'assets/icons/sun.png';
} else {
    themeIcon.src = 'assets/icons/moon.png';
}

themeIcon.addEventListener('click', () => {
    themeIcon.classList.add('rotate'); // Add rotation animation

    if (currentTheme === 'light') {
        document.body.classList.add('dark-mode');
        themeIcon.src = 'assets/icons/sun.png';
        currentTheme = 'dark';
    } else {
        document.body.classList.remove('dark-mode');
        themeIcon.src = 'assets/icons/moon.png';
        currentTheme = 'light';
    }

    localStorage.setItem('theme', currentTheme);

    // Remove rotation class after animation completes
    setTimeout(() => {
        themeIcon.classList.remove('rotate');
    }, 500); // Match the CSS animation time
});
