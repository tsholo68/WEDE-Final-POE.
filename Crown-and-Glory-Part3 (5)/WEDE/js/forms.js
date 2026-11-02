/* Form validation + AJAX submission for enquiry.html and contact.html */
(function () {
  'use strict';

  /* >>> CHANGE THIS to the real address that should receive messages <<< */
  var RECIPIENT_EMAIL = 'hello@crownandglory.co.za';

  /* ---------- Validation rules (one function per field type) ---------- */
  var rules = {
    name: function (v) {
      if (!v) return 'Please enter your full name.';
      if (v.length < 2 || v.length > 60) return 'Your name must be between 2 and 60 characters.';
      if (!/^[A-Za-zÀ-ɏ][A-Za-zÀ-ɏ '\-]*$/.test(v)) return 'Use letters, spaces, hyphens or apostrophes only.';
      return '';
    },
    email: function (v) {
      if (!v) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v)) return 'Enter a valid email, e.g. name@example.com.';
      return '';
    },
    phone: function (v, required) {
      if (!v) return required ? 'Please enter your phone number.' : '';
      var digits = v.replace(/[\s\-()]/g, '');
      if (!/^(\+27|0)[1-9]\d{8}$/.test(digits)) return 'Enter a South African number, e.g. 082 555 0123 or +27 82 555 0123.';
      return '';
    },
    date: function (v) {
      if (!v) return 'Please choose a preferred date.';
      var d = new Date(v + 'T00:00:00'), today = new Date(); today.setHours(0, 0, 0, 0);
      var max = new Date(today); max.setMonth(max.getMonth() + 3);
      if (isNaN(d)) return 'That date is not valid.';
      if (d < today) return 'Please pick today or a future date.';
      if (d > max) return 'Bookings open up to 3 months ahead.';
      if (d.getDay() === window.CG_RULES.closedDay) return 'We are closed on Sundays. Please pick another day.';
      return '';
    },
    select: function (v) { return v ? '' : 'Please choose an option.'; },
    text: function (v, min, max) {
      if (!v || v.length < min) return 'Please write at least ' + min + ' characters.';
      if (v.length > max) return 'Please keep this under ' + max + ' characters.';
      return '';
    },
    optional: function (v, max) { return v.length > max ? 'Please keep this under ' + max + ' characters.' : ''; }
  };

  function field(input) { return input.closest('.field'); }

  function setState(input, message) {
    var box = field(input), err = box.querySelector('.error-msg');
    err.textContent = message;
    box.classList.toggle('invalid', !!message);
    box.classList.toggle('valid', !message && input.value.trim() !== '');
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  /* validators[fieldName](input) returns an error string */
  function attach(form, validators, onValid) {
    form.noValidate = true;  // use our friendly messages instead of the browser pop-ups
    var inputs = form.querySelectorAll('input:not(.hp), select, textarea');

    inputs.forEach(function (input) {
      var v = validators[input.name];
      if (!v) return;
      input.addEventListener('blur', function () { setState(input, v(input.value.trim())); });
      input.addEventListener('input', function () {
        if (field(input).classList.contains('invalid')) setState(input, v(input.value.trim()));
        var counter = field(input).querySelector('.char-count');
        if (counter) counter.textContent = input.value.length + ' / ' + input.maxLength;
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.querySelector('input.hp').value) return;   // honeypot: bots fill this, humans never see it
      var firstBad = null, allOk = true;
      inputs.forEach(function (input) {
        var v = validators[input.name];
        if (!v) return;
        var ok = setState(input, v(input.value.trim()));
        if (!ok && !firstBad) firstBad = input;
        allOk = allOk && ok;
      });
      if (!allOk) { firstBad.focus(); return; }
      onValid(form);
    });
  }

  /* ---------- AJAX: send data to the form's action URL without reloading ---------- */
  function ajaxSend(form, payload) {
    var btn = form.querySelector('button[type="submit"]');
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = '';
    var sp = document.createElement('span'); sp.className = 'spinner';
    btn.append(sp, 'Sending...');
    return fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error('Server responded with ' + res.status);
      return res.json();
    }).finally(function () { btn.disabled = false; btn.textContent = label; });
  }

  function showStatus(box, kind, title, lines) {
    box.className = 'form-status show ' + kind;
    box.textContent = '';
    var h = document.createElement('h3'); h.textContent = title; box.appendChild(h);
    lines.forEach(function (l) {
      if (typeof l === 'string') { var p = document.createElement('p'); p.textContent = l; box.appendChild(p); }
      else box.appendChild(l);
    });
    box.setAttribute('tabindex', '-1');
    box.focus();
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function money(n) { return 'R' + n.toLocaleString('en-ZA'); }

  /* ================= ENQUIRY / BOOKING FORM ================= */
  var enquiry = document.getElementById('enquiry-form');
  if (enquiry) {
    var services = window.CG_SERVICES, cap = window.CG_RULES.dailyCap;
    var select = enquiry.querySelector('#service');

    // Fill the select from the shared data, and keep the static fallback if data is missing
    select.textContent = '';
    var ph = document.createElement('option'); ph.value = ''; ph.textContent = 'Choose a service...'; select.appendChild(ph);
    services.forEach(function (s) {
      var o = document.createElement('option'); o.value = s.id; o.textContent = s.name + ' (from ' + money(s.price) + ')'; select.appendChild(o);
    });
    var pre = new URLSearchParams(location.search).get('service');   // arrived from a "Book" button
    if (pre && services.some(function (s) { return s.id === pre; })) select.value = pre;

    // Block past dates in the date picker
    var dateInput = enquiry.querySelector('#booking-date');
    var t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
    dateInput.min = t.toISOString().slice(0, 10);

    // Simulated daily bookings so the demo can show "fully booked" days.
    // (A real site would ask a database. This is a stable pseudo-random number from the date.)
    function bookedOn(dateStr) {
      var h = 0; for (var i = 0; i < dateStr.length; i++) h = (h * 31 + dateStr.charCodeAt(i)) % 97;
      return h % 7;   // 0 - 6
    }

    attach(enquiry, {
      fullname: function (v) { return rules.name(v); },
      email: function (v) { return rules.email(v); },
      phone: function (v) { return rules.phone(v, true); },
      service: function (v) { return rules.select(v); },
      'booking-date': function (v) { return rules.date(v); },
      status: function (v) { return rules.select(v); },
      notes: function (v) { return rules.optional(v, 300); }
    }, function (form) {
      var f = new FormData(form);
      var svc = services.filter(function (s) { return s.id === f.get('service'); })[0];
      var date = f.get('booking-date');
      var booked = bookedOn(date), left = Math.max(0, cap - booked);
      var wantsWaitlist = f.get('status') === 'waitlist';
      var deposit = Math.round(svc.price * 0.3);
      var payload = { type: 'enquiry', name: f.get('fullname'), email: f.get('email'), phone: f.get('phone'),
                      service: svc.name, date: date, request: f.get('status'), notes: f.get('notes') };
      var box = document.getElementById('form-status');

      ajaxSend(form, payload).then(function () {
        var prettyDate = new Date(date + 'T00:00:00').toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        var first = f.get('fullname').split(' ')[0];
        var list = document.createElement('ul');
        [['Service', svc.name], ['Date', prettyDate], ['Estimated cost', 'from ' + money(svc.price)],
         ['Deposit to secure your slot', money(deposit) + ' (30%)'], ['Duration', svc.duration]].forEach(function (row) {
          var li = document.createElement('li'); var b = document.createElement('strong'); b.textContent = row[0] + ': ';
          li.append(b, row[1]); list.appendChild(li);
        });
        if (left > 0 && !wantsWaitlist) {
          showStatus(box, 'success', 'Yay, ' + first + '! Your slot is available ✨',
            ['Good news: there ' + (left === 1 ? 'is 1 slot' : 'are ' + left + ' slots') + ' left on that day.', list,
             'We will confirm by email at ' + f.get('email') + ' within 24 hours.']);
        } else if (left > 0 && wantsWaitlist) {
          showStatus(box, 'info', 'Good news, ' + first + ': that day is not full!',
            ['You asked for the waitlist, but ' + left + ' standard slot(s) are still open on that day, so you may not need it.', list,
             'Choose "Standard Appointment Request" to lock it in.']);
        } else {
          showStatus(box, 'info', 'That day is fully booked, ' + first + ' 💕',
            ['All ' + cap + ' daily slots are taken, so we have added you to the waiting list for that date.', list,
             'If someone cancels, we will email you straight away. You could also try another date.']);
        }
        enquiry.reset();
        enquiry.querySelectorAll('.field').forEach(function (x) { x.classList.remove('valid', 'invalid'); });
      }).catch(function () {
        showStatus(box, 'info', 'Oops, we could not send that 😢',
          ['Please check your internet connection and try again, or call us on +27 11 555 0199.']);
      });
    });
  }

  /* ================= CONTACT FORM ================= */
  var contact = document.getElementById('contact-form');
  if (contact) {
    attach(contact, {
      cname: function (v) { return rules.name(v); },
      cemail: function (v) { return rules.email(v); },
      cphone: function (v) { return rules.phone(v, false); },
      topic: function (v) { return rules.select(v); },
      message: function (v) { return rules.text(v, 10, 500); }
    }, function (form) {
      var f = new FormData(form);
      var topicText = form.querySelector('#topic option:checked').textContent;
      var box = document.getElementById('form-status');
      var payload = { type: 'contact', name: f.get('cname'), email: f.get('cemail'), phone: f.get('cphone'),
                      topic: topicText, message: f.get('message') };

      ajaxSend(form, payload).then(function () {
        // Compile everything into an email the visitor can send to RECIPIENT_EMAIL
        var subject = '[' + topicText + '] Message from ' + f.get('cname');
        var body = 'Hi Crown & Glory team,\n\n' + f.get('message') + '\n\n---\nName: ' + f.get('cname') +
                   '\nEmail: ' + f.get('cemail') + '\nPhone: ' + (f.get('cphone') || 'not provided') + '\nTopic: ' + topicText;
        var link = document.createElement('a');
        link.className = 'btn'; link.textContent = 'Open in my email app ✉️';
        link.href = 'mailto:' + RECIPIENT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        var wrap = document.createElement('p'); wrap.appendChild(link);
        var pre = document.createElement('p'); pre.className = 'email-preview';
        pre.textContent = 'To: ' + RECIPIENT_EMAIL + '\nSubject: ' + subject + '\n\n' + body;
        showStatus(box, 'success', 'Thank you, ' + f.get('cname').split(' ')[0] + '! Your message is ready 💌',
          ['We have received your details. Your email has been compiled below. Press the button to send it to ' + RECIPIENT_EMAIL + '.', wrap, pre]);
        contact.reset();
        contact.querySelectorAll('.field').forEach(function (x) { x.classList.remove('valid', 'invalid'); });
      }).catch(function () {
        showStatus(box, 'info', 'Oops, we could not send that 😢', ['Please try again in a moment.']);
      });
    });
  }
})();
