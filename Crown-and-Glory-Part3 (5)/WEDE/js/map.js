/* Contact page: interactive Leaflet map with OpenStreetMap tiles (no API key needed) */
(function () {
  'use strict';
  var el = document.getElementById('map');
  if (!el) return;

  if (typeof L === 'undefined') {            // library blocked / offline: show a friendly fallback
    var p = document.createElement('p'); p.className = 'map-fallback';
    p.textContent = 'The interactive map could not load. ';
    var a = document.createElement('a');
    a.href = 'https://www.openstreetmap.org/?mlat=-26.1904&mlon=28.0335#map=15/-26.1904/28.0335';
    a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'Open our location on OpenStreetMap';
    p.appendChild(a); el.appendChild(p); return;
  }

  var studios = [
    { name: 'Main Studio', lat: -26.1904, lng: 28.0335, text: '123 Beauty Boulevard, Suite A, Johannesburg' },
    { name: 'Campus Pop-Up Studio', lat: -26.1944, lng: 28.0378, text: 'IIE Rosebank College, 23 Jorissen Street, Braamfontein, Johannesburg' }
  ];
  var map = L.map(el, { scrollWheelZoom: false }).setView([studios[0].lat, studios[0].lng], 15);
  // Esri World Street Map tiles: free, no API key, and they load even when the page is opened
  // straight from a folder (OpenStreetMap's own tile server blocks pages that send no Referer).
  var tiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, and the GIS User Community'
  }).addTo(map);

  // If the tiles cannot load (offline / blocked network), show a friendly link instead of grey boxes
  var tileErrors = 0;
  tiles.on('tileerror', function () {
    if (++tileErrors !== 5) return;
    var note = document.createElement('p'); note.className = 'map-fallback';
    note.textContent = 'The map pictures could not load. ';
    var a = document.createElement('a');
    a.href = 'https://www.openstreetmap.org/?mlat=-26.1904&mlon=28.0335#map=15/-26.1904/28.0335';
    a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'Open our location on OpenStreetMap';
    note.appendChild(a); el.insertAdjacentElement('afterend', note);
  });

  var markers = studios.map(function (s) {
    var box = document.createElement('div');
    var b = document.createElement('strong'); b.textContent = s.name;
    var t = document.createElement('div'); t.textContent = s.text;
    box.append(b, t);
    return L.marker([s.lat, s.lng]).addTo(map).bindPopup(box);
  });
  markers[0].openPopup();

  /* Clicking a location card flies the map to that studio */
  document.querySelectorAll('[data-studio]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var i = Number(btn.dataset.studio);
      map.flyTo([studios[i].lat, studios[i].lng], 16, { duration: 1.2 });
      markers[i].openPopup();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
  map.on('focus', function () { map.scrollWheelZoom.enable(); });
  map.on('blur', function () { map.scrollWheelZoom.disable(); });
})();
