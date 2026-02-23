import './style.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Initialize AOS
AOS.init({
  duration: 800,
  once: true,
  offset: 100,
  easing: 'ease-in-out',
});

// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const html = document.documentElement;

const updateThemeIcon = (isLight) => {
  const icon = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  if (themeToggle) themeToggle.innerHTML = icon;
  if (themeToggleMobile) themeToggleMobile.innerHTML = icon;
};

// Check for saved theme
if (localStorage.getItem('theme') === 'light') {
  html.classList.add('light');
  updateThemeIcon(true);
}

const toggleTheme = () => {
  html.classList.toggle('light');
  const isLight = html.classList.contains('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  updateThemeIcon(isLight);
};

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

// Mobile menu toggle
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
if (btn && menu) {
  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
}

// Smooth scroll with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    if (menu && !menu.classList.contains('hidden')) {
      menu.classList.add('hidden');
    }
  });
});
