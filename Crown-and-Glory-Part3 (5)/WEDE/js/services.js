/* Services page: dynamic cards, search / filter / sort, details modal, gallery lightbox */
(function () {
  'use strict';
  var grid = document.getElementById('service-grid');
  if (!grid || !window.CG_SERVICES) return;

  var data = window.CG_SERVICES;
  var searchInput = document.getElementById('search');
  var categorySel = document.getElementById('category');
  var sortSel = document.getElementById('sort');
  var count = document.getElementById('result-count');
  var modal = document.getElementById('service-modal');
  var lightbox = document.getElementById('lightbox');
  var visible = [];
  var lbIndex = 0;

  function money(n) { return 'R' + n.toLocaleString('en-ZA'); }

  /* Build the filter dropdown from the data itself (dynamic) */
  var cats = data.map(function (s) { return s.category; })
    .filter(function (c, i, a) { return a.indexOf(c) === i; }).sort();
  cats.forEach(function (c) {
    var o = document.createElement('option'); o.value = c; o.textContent = c; categorySel.appendChild(o);
  });

  /* Create one card with DOM methods (textContent, not innerHTML = safe) */
  function makeCard(s, i) {
    var card = document.createElement('article');
    card.className = 'service-card';
    card.style.animationDelay = (i * 60) + 'ms';

    var wrap = document.createElement('div'); wrap.className = 'img-wrap';
    var img = document.createElement('img');
    img.src = s.image; img.alt = s.alt; img.width = 480; img.height = 600; img.loading = 'lazy';
    img.dataset.index = i; img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'View larger photo: ' + s.name);
    wrap.appendChild(img);

    var body = document.createElement('div'); body.className = 'body';
    var tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = s.category;
    var h3 = document.createElement('h3'); h3.textContent = s.name;
    var p = document.createElement('p'); p.textContent = s.blurb;
    var price = document.createElement('div'); price.className = 'price'; price.textContent = 'from ' + money(s.price);
    var actions = document.createElement('div'); actions.className = 'card-actions';
    var more = document.createElement('button'); more.type = 'button'; more.className = 'btn btn-outline';
    more.textContent = 'Details'; more.dataset.id = s.id;
    var book = document.createElement('a'); book.className = 'btn';
    book.href = 'enquiry.html?service=' + encodeURIComponent(s.id); book.textContent = 'Book';
    actions.append(more, book);
    body.append(tag, h3, p, price, actions);
    card.append(wrap, body);
    return card;
  }

  function render() {
    var q = searchInput.value.trim().toLowerCase();
    var cat = categorySel.value;
    visible = data.filter(function (s) {
      var matchText = (s.name + ' ' + s.blurb + ' ' + s.category).toLowerCase().indexOf(q) !== -1;
      return matchText && (cat === 'all' || s.category === cat);
    });
    var sort = sortSel.value;
    if (sort !== 'featured') visible.sort(function (a, b) {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

    grid.textContent = '';
    if (!visible.length) {
      var empty = document.createElement('div'); empty.className = 'empty-state';
      empty.textContent = 'No services match "' + searchInput.value + '" yet. Try another word!';
      grid.appendChild(empty);
    } else {
      var frag = document.createDocumentFragment();
      visible.forEach(function (s, i) { frag.appendChild(makeCard(s, i)); });
      grid.appendChild(frag);
    }
    count.textContent = visible.length + ' of ' + data.length + ' services shown';
  }

  [searchInput, categorySel, sortSel].forEach(function (el) {
    el.addEventListener(el === searchInput ? 'input' : 'change', render);
  });

  /* Details modal + lightbox via event delegation on the grid */
  grid.addEventListener('click', function (e) {
    var more = e.target.closest('button[data-id]');
    if (more) return openDetails(more.dataset.id);
    var img = e.target.closest('img[data-index]');
    if (img) openLightbox(Number(img.dataset.index));
  });
  grid.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('img[data-index]')) {
      e.preventDefault(); openLightbox(Number(e.target.dataset.index));
    }
  });

  function openDetails(id) {
    var s = data.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    modal.querySelector('#modal-title').textContent = s.name;
    modal.querySelector('#modal-price').textContent = 'from ' + money(s.price) + ' · ' + s.duration;
    var list = modal.querySelector('#modal-list'); list.textContent = '';
    s.includes.forEach(function (item) { var li = document.createElement('li'); li.textContent = item; list.appendChild(li); });
    modal.querySelector('#modal-book').href = 'enquiry.html?service=' + encodeURIComponent(s.id);
    window.CG.openOverlay(modal);
  }

  function showLightbox() {
    var s = visible[lbIndex];
    var img = lightbox.querySelector('img');
    img.src = s.image; img.alt = s.alt;
    lightbox.querySelector('figcaption').textContent = s.name;
  }
  function openLightbox(i) { lbIndex = i; showLightbox(); window.CG.openOverlay(lightbox); }
  function step(d) { lbIndex = (lbIndex + d + visible.length) % visible.length; showLightbox(); }
  lightbox.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
  lightbox.querySelector('.lb-next').addEventListener('click', function () { step(1); });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  render();
})();
