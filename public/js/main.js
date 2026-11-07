(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  // Header shadow on scroll
  var header = document.querySelector('[data-header]');
  var onScroll = function () { header && header.classList.toggle('is-scrolled', window.scrollY > 10); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile nav
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');
  var setNav = function (open) {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  };
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setNav(false); });
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Product filter
  var filterBar = document.querySelector('[data-filter]');
  if (filterBar) {
    var cards = document.querySelectorAll('[data-material]');
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var value = btn.dataset.value;
      filterBar.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      cards.forEach(function (c) { c.hidden = value !== 'all' && c.dataset.material !== value; });
    });
  }

  // Article TOC active state
  var tocLinks = document.querySelectorAll('[data-toc] a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var tocIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
          var link = map[entry.target.id];
          if (link) link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) tocIo.observe(el); });
  }

  // WhatsApp order form -> opens WhatsApp with composed message
  var waForm = document.querySelector('[data-wa-form]');
  if (waForm) {
    waForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(waForm);
      var nama = (data.get('nama') || '').toString().trim();
      var error = waForm.querySelector('[data-error]');
      if (!nama) {
        error.textContent = 'Mohon isi nama Anda terlebih dahulu.';
        waForm.querySelector('#nama').focus();
        return;
      }
      error.textContent = '';
      var lines = [
        'Halo SONINDOGRAFIKA, saya ingin minta penawaran.',
        '',
        'Nama: ' + nama,
        data.get('usaha') ? 'Usaha: ' + data.get('usaha') : '',
        data.get('kota') ? 'Kota: ' + data.get('kota') : '',
        'Bahan: ' + data.get('bahan'),
        data.get('jumlah') ? 'Perkiraan jumlah: ' + data.get('jumlah') : '',
        data.get('pesan') ? 'Kebutuhan: ' + data.get('pesan') : '',
      ].filter(function (l, i) { return l !== '' || i === 1; });
      var url = 'https://wa.me/' + waForm.dataset.number + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
  }
})();
