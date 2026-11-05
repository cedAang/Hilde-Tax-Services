/* Tax Reminders page: renders window.TAX_REMINDERS (tax-reminders-data.js) into the three sections */
(function () {
  var data = window.TAX_REMINDERS;
  if (!data) return;

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var WHO = { everyone: 'Everyone', 'self-employed': 'Self-employed', employers: 'Employers', businesses: 'Businesses', texas: 'Texas' };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };
  // Parse YYYY-MM-DD as a local date so it doesn't shift a day in US time zones
  var parse = function (s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  var longDate = function (d) { return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); };
  var source = function (s) {
    return s ? '<a class="rem-source" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">Source: ' + esc(s.label) + '</a>' : '';
  };

  var today = new Date(); today.setHours(0, 0, 0, 0);
  var updated = document.getElementById('rem-updated');
  if (updated) updated.textContent = longDate(parse(data.updated));

  // Upcoming dates, grouped by month, past ones dropped, with an audience filter
  var datesEl = document.getElementById('rem-dates');
  var filterEl = document.getElementById('rem-filter');
  var upcoming = data.dates.filter(function (d) { return parse(d.date) >= today; })
    .sort(function (a, b) { return parse(a.date) - parse(b.date); });

  var renderDates = function (who) {
    var list = upcoming.filter(function (d) { return who === 'all' || d.who.indexOf(who) !== -1 || d.who.indexOf('everyone') !== -1; });
    if (!list.length) { datesEl.innerHTML = '<p class="rem-empty">No upcoming dates for this group right now. Check back soon.</p>'; return; }
    var html = '', month = '';
    list.forEach(function (d) {
      var dt = parse(d.date), m = MONTHS[dt.getMonth()] + ' ' + dt.getFullYear();
      if (m !== month) { html += (month ? '</ol>' : '') + '<h3 class="rem-month">' + m + '</h3><ol class="rem-dates">'; month = m; }
      html +=
        '<li class="rem-date">' +
          '<span class="rem-day" aria-hidden="true"><small>' + MONTHS[dt.getMonth()].slice(0, 3) + '</small>' + dt.getDate() + '</span>' +
          '<div>' +
            '<p class="rem-when">' + (d.approximate ? 'Around ' : '') + longDate(dt) + '</p>' +
            '<h4>' + esc(d.title) + '</h4>' +
            '<p>' + esc(d.detail) + '</p>' +
            '<p class="rem-meta">' + d.who.map(function (w) { return '<span class="rem-chip rem-chip--' + w + '">' + WHO[w] + '</span>'; }).join('') + source(d.source) + '</p>' +
          '</div>' +
        '</li>';
    });
    datesEl.innerHTML = html + '</ol>';
  };

  if (datesEl) {
    if (filterEl) {
      var groups = ['all'].concat(Object.keys(WHO).filter(function (k) { return k !== 'everyone' && upcoming.some(function (d) { return d.who.indexOf(k) !== -1; }); }));
      filterEl.innerHTML = groups.map(function (g, i) {
        return '<button type="button" class="rem-filter__btn" aria-pressed="' + (i === 0) + '" data-who="' + g + '">' + (g === 'all' ? 'All dates' : WHO[g]) + '</button>';
      }).join('');
      filterEl.addEventListener('click', function (ev) {
        var btn = ev.target.closest('[data-who]');
        if (!btn) return;
        filterEl.querySelectorAll('[data-who]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        renderDates(btn.getAttribute('data-who'));
      });
    }
    renderDates('all');
  }

  // News, in the order given
  var newsEl = document.getElementById('rem-news');
  if (newsEl) {
    newsEl.innerHTML = data.news.map(function (n) {
      return '<article class="rem-news">' +
          '<p class="rem-news__top"><span class="rem-tag">' + esc(n.tag) + '</span><time datetime="' + n.date + '">' + longDate(parse(n.date)) + '</time></p>' +
          '<h3>' + esc(n.title) + '</h3>' +
          '<p>' + esc(n.summary) + '</p>' +
          source(n.source) +
        '</article>';
    }).join('');
  }

  // Law changes
  var changesEl = document.getElementById('rem-changes');
  if (changesEl) {
    changesEl.innerHTML = data.changes.map(function (c) {
      return '<article class="rem-change">' +
          '<p class="rem-figure">' + esc(c.figure) + '</p>' +
          '<h3>' + esc(c.title) + '</h3>' +
          '<p>' + esc(c.detail) + '</p>' +
          source(c.source) +
        '</article>';
    }).join('');
  }
})();
