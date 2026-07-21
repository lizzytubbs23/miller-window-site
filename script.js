(function () {
  var MOBILE_BREAKPOINT = 960;

  function syncNavMode() {
    var isCompact = window.innerWidth <= MOBILE_BREAKPOINT;
    document.body.classList.toggle('nav-compact', isCompact);
  }

  // Run immediately (script.js is deferred, so the DOM/body already exist),
  // then re-check on every event that could plausibly change or reveal the
  // real viewport width. Some real iOS Safari sessions load the page with
  // the mobile nav media query not yet applied, and only recalc it after an
  // interaction (pinch, scroll, orientation change). Measuring innerWidth
  // ourselves in JS sidesteps that and forces the correct state right away.
  syncNavMode();
  document.addEventListener('DOMContentLoaded', syncNavMode);
  window.addEventListener('load', syncNavMode);
  window.addEventListener('pageshow', syncNavMode);
  window.addEventListener('resize', syncNavMode);
  window.addEventListener('orientationchange', syncNavMode);
})();

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var navLinks = document.querySelector('nav.links');
  if (!toggle || !navLinks) return;

  function closeMenu() {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }

  toggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? '✕' : '☰';
  });

  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeMenu();
  });

  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== toggle) {
      closeMenu();
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var calcItems = document.querySelectorAll('.calc-item');
  var totalEl = document.getElementById('calc-total');
  var lineListEl = document.querySelector('.calc-line-list');
  if (!calcItems.length || !totalEl || !lineListEl) return;

  function updateCalc() {
    var total = 0;
    var lines = [];

    calcItems.forEach(function (item) {
      var price = parseFloat(item.getAttribute('data-price'));
      var qtyInput = item.querySelector('.calc-qty');
      var qty = parseInt(qtyInput.value, 10) || 0;
      if (qty > 0) {
        var name = item.querySelector('h4').textContent;
        var lineTotal = price * qty;
        total += lineTotal;
        lines.push(
          '<div class="calc-line"><span>' + qty + ' × ' + name + '</span><span>$' + lineTotal.toFixed(2) + '</span></div>'
        );
      }
    });

    if (total > 0 && total < 95) total = 95;

    lineListEl.innerHTML = lines.length
      ? lines.join('')
      : '<p class="calc-empty">Add a quantity above to see your estimate.</p>';
    totalEl.textContent = '$' + total.toFixed(2);
  }

  calcItems.forEach(function (item) {
    item.querySelector('.calc-qty').addEventListener('input', updateCalc);
  });

  updateCalc();
});
