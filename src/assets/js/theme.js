document.addEventListener('DOMContentLoaded', function () {
  // Theme toggle
  var toggle = document.querySelector('.theme-toggle');
  var panel = document.getElementById('theme-panel');
  var radios = panel.querySelectorAll('input[type="radio"]');
  var saved = localStorage.getItem('theme') || 'auto';

  // Set initial radio state
  var checked = panel.querySelector('input[value="' + saved + '"]');
  if (checked) checked.checked = true;
  updateIcon(saved);

  function closeThemePanel() {
    toggle.setAttribute('aria-expanded', 'false');
    panel.classList.remove('visible');
  }

  // Toggle panel visibility
  toggle.addEventListener('click', function () {
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    panel.classList.toggle('visible');
  });

  // Escape key closes theme panel
  panel.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeThemePanel();
      toggle.focus();
    }
  });

  // Click outside closes theme panel
  document.addEventListener('click', function (e) {
    if (panel.classList.contains('visible') && !panel.contains(e.target) && !toggle.contains(e.target)) {
      closeThemePanel();
    }
  });

  // Handle radio changes
  radios.forEach(function (radio) {
    radio.addEventListener('change', function (e) {
      var theme = e.target.value;
      if (theme === 'auto') {
        localStorage.setItem('theme', 'auto');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      }
      updateIcon(theme);
      closeThemePanel();
    });
  });

  // React to OS preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    var current = localStorage.getItem('theme');
    if (!current || current === 'auto') {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateIcon('auto');
    }
  });

  // Hamburger menu
  var menuToggle = document.querySelector('.menu-toggle');
  var mainNav = document.getElementById('main-nav');
  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('open');
    menuToggle.querySelector('use').setAttribute('href', '#icon-menu');
  }

  menuToggle.addEventListener('click', function () {
    var expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('open');
    var use = menuToggle.querySelector('use');
    use.setAttribute('href', expanded ? '#icon-menu' : '#icon-close');
  });

  // Escape key closes hamburger menu
  mainNav.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
      menuToggle.focus();
    }
  });

  function updateIcon(theme) {
    var use = toggle.querySelector('use');
    if (theme === 'dark') {
      use.setAttribute('href', '#icon-moon');
    } else if (theme === 'light') {
      use.setAttribute('href', '#icon-sun');
    } else {
      use.setAttribute('href', '#icon-circle-half');
    }
  }
});
