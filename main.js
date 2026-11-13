/* Hilde Tax Services - shared interactions */
(function () {
  // Clickjacking guard: GitHub Pages can't send X-Frame-Options, so break out if another site frames us.
  // Hide first: browsers often block the redirect silently, and a hidden page can't be used to trick clicks.
  if (window.top !== window.self) {
    document.documentElement.style.display = 'none';
    try { window.top.location.replace(window.location.href); } catch (e) { /* blocked; page stays hidden */ }
    return;
  }

  // Mobile nav toggle
  var toggle = document.querySelector('.menu-toggle');
  var header = document.querySelector('.site-header');
  var nav = document.querySelector('.nav');
  if (toggle && header) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    // Close the menu after tapping a nav link
    if (nav) {
      nav.addEventListener('click', function (ev) {
        if (ev.target.closest('a')) {
          header.classList.remove('nav-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Open menu');
        }
      });
    }
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 0.08 + 's';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Services page: card-deck shuffle. When the list scrolls into view, the .svc-row cards appear stacked
  // as a deck near the top of the list, riffle left and right, then deal out one at a time, in random
  // order, to their own places. Skipped for reduced motion and when the page opens on a #svc-* anchor
  // (the visitor wants that card right away).
  var svcList = document.querySelector('.svc-list');
  var svcRows = svcList ? Array.prototype.slice.call(svcList.querySelectorAll('.svc-row')) : [];
  if (svcRows.length > 1 && 'IntersectionObserver' in window && svcList.animate && !location.hash &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    svcList.classList.remove('reveal');
    svcList.classList.add('is-deck');
    var dealCards = function () {
      var box = svcList.getBoundingClientRect();
      var deckX = box.left + box.width / 2;
      var deckY = box.top + Math.min(box.height / 2, 220);
      var order = svcRows.map(function (_, i) { return i; });
      for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = order[i]; order[i] = order[j]; order[j] = t; }
      var SHUFFLE = 900, DEAL = 650, GAP = 110, done = 0;
      svcList.classList.remove('is-deck');
      order.forEach(function (rowIndex, k) {
        var row = svcRows[rowIndex];
        var r = row.getBoundingClientRect();
        var dx = deckX - (r.left + r.width / 2), dy = deckY - (r.top + r.height / 2) - k * 3;
        var tilt = (Math.random() * 8 - 4).toFixed(1), side = k % 2 ? 1 : -1;
        var deck = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + tilt + 'deg) scale(.9)';
        row.style.position = 'relative';
        row.style.zIndex = String(20 + order.length - k); // the first card dealt is on top of the deck
        // 1) gather into the deck and riffle: alternate cards slide out to the sides and back
        var a1 = row.animate([
          { transform: deck, opacity: 0 },
          { transform: deck, opacity: 1, offset: .2 },
          { transform: 'translate(' + (dx + side * Math.min(150, box.width / 4)) + 'px,' + dy + 'px) rotate(' + (side * 9) + 'deg) scale(.9)', offset: .5 },
          { transform: deck, offset: .8 },
          { transform: deck, opacity: 1 }
        ], { duration: SHUFFLE, easing: 'cubic-bezier(.45,.05,.25,1)', fill: 'both' });
        // 2) deal: fly from the deck to its own place with a little spring, one card after another
        var a2 = row.animate([
          { transform: deck, boxShadow: '0 30px 50px -20px rgba(20,65,91,.45)' },
          { transform: 'none', boxShadow: '0 5px 0 rgba(92,151,24,.10), 0 12px 22px rgba(20,65,91,.08)' }
        ], { duration: DEAL, delay: SHUFFLE + k * GAP, easing: 'cubic-bezier(.3,1.25,.5,1)', fill: 'forwards' }); // no backwards fill: it would hide the riffle
        a2.onfinish = function () {
          a1.cancel(); a2.cancel();
          row.style.position = ''; row.style.zIndex = '';
          if (++done === order.length) svcList.classList.add('is-dealt');
        };
      });
    };
    var deckIO = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      deckIO.disconnect();
      dealCards();
    }, { threshold: 0.12 });
    deckIO.observe(svcList);
  }

  // Utility bar: "Next deadline" = the first upcoming date in tax-reminders-data.js
  var nextEl = document.querySelector('.util-next');
  if (nextEl && window.TAX_REMINDERS) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var next = window.TAX_REMINDERS.dates
      .map(function (d) { var p = d.date.split('-'); return { d: d, t: new Date(+p[0], +p[1] - 1, +p[2]) }; })
      .filter(function (x) { return x.t >= today; })
      .sort(function (a, b) { return a.t - b.t; })[0];
    if (next) {
      var mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][next.t.getMonth()];
      nextEl.innerHTML = '<span class="util-next__label">Next deadline</span> ' +
        '<a href="tax-reminders">' + (next.d.approximate ? 'Around ' : '') + mon + ' ' + next.t.getDate() + ': ' +
        next.d.title.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }) + '</a>';
      nextEl.hidden = false;
    }
  }

  // Mobile tab bar: a frosted-glass pill that replaces the hamburger menu on phones and tablets (CSS shows it at 900px
  // and below). It sits right under the header and sticks to the top of the screen while scrolling.
  // The current page's tab is highlighted. Reminders isn't a tab: the utility bar above the header already links it.
  // Links use clean URLs (/home, /services ...); normalize "", "index" and any ".html" ending to match them.
  var page = location.pathname.split('/').pop().toLowerCase().replace(/\.html$/, '');
  if (!page || page === 'index') page = 'home';
  var tabIcon = function (paths) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  };
  var tabs = [
    { href: 'home', label: 'Home', icon: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>' },
    { href: 'services', label: 'Services', icon: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>' },
    { href: 'about', label: 'About', icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>' },
    { href: 'tax-intake', label: 'Start Taxes', icon: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/>' },
    { href: 'contact', label: 'Contact', icon: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>' }
  ];
  var tabBar = document.createElement('nav');
  tabBar.className = 'tab-bar';
  tabBar.setAttribute('aria-label', 'Quick navigation');
  tabBar.innerHTML = tabs.map(function (t) {
    var here = page === t.href;
    return '<a class="tab-bar__item' + (here ? ' is-active' : '') + '" href="' + t.href + '"' + (here ? ' aria-current="page"' : '') + '>' +
      '<span class="tab-bar__icon">' + tabIcon(t.icon) + '</span>' +
      '<span class="tab-bar__label">' + t.label + '</span></a>';
  }).join('');
  if (header) header.insertAdjacentElement('afterend', tabBar);
  else document.body.appendChild(tabBar);
  document.documentElement.classList.add('has-tab-bar');

  // Glass lens: the selected pill is one element that slides between tabs. On tap it swells into a
  // clear glass bubble with a rainbow rim (bulging past the bar), glides to the new tab, settles back
  // into the green pill, and then the page changes.
  var lens = document.createElement('span');
  lens.className = 'tab-bar__lens';
  lens.setAttribute('aria-hidden', 'true');
  tabBar.insertBefore(lens, tabBar.firstChild);
  tabBar.classList.add('has-lens');
  var tabItems = Array.prototype.slice.call(tabBar.querySelectorAll('.tab-bar__item'));
  var currentTab = tabBar.querySelector('.tab-bar__item.is-active');
  var placeLens = function (el, instant) {
    if (!el || !el.offsetWidth) return;
    if (instant) lens.style.transition = 'none';
    lens.style.width = el.offsetWidth + 'px';
    lens.style.setProperty('--x', el.offsetLeft + 'px');
    if (instant) { void lens.offsetWidth; lens.style.transition = ''; }
  };
  var resetLens = function () {
    tabBar.classList.remove('is-moving');
    tabItems.forEach(function (a) { a.classList.toggle('is-active', a === currentTab); a.classList.remove('is-lensing'); });
    lens.classList.toggle('is-shown', !!currentTab);
    placeLens(currentTab, true);
  };
  resetLens();
  window.addEventListener('resize', function () { placeLens(tabBar.querySelector('.tab-bar__item.is-active'), true); });
  window.addEventListener('pageshow', function (ev) { if (ev.persisted) resetLens(); }); // back/forward cache
  tabItems.forEach(function (a) {
    a.addEventListener('click', function (ev) {
      if (a === currentTab || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !a.offsetWidth) return;
      ev.preventDefault();
      if (!lens.classList.contains('is-shown')) { placeLens(a, true); lens.classList.add('is-shown'); }
      tabItems.forEach(function (b) { b.classList.toggle('is-active', b === a); b.classList.remove('is-lensing'); });
      a.classList.add('is-lensing');
      tabBar.classList.add('is-moving');
      placeLens(a);
      window.setTimeout(function () { tabBar.classList.remove('is-moving'); a.classList.remove('is-lensing'); }, 420);
      window.setTimeout(function () { window.location.href = a.href; }, 560);
    });
  });

  // Floating buttons (ported from the school site): Share bottom-left, Contact us + Back to top bottom-right.
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Back to top: appears after scrolling past the first screen
  var topBtn = document.createElement('button');
  topBtn.type = 'button';
  topBtn.className = 'back-to-top';
  topBtn.setAttribute('aria-label', 'Back to top');
  topBtn.innerHTML =
    '<span class="back-to-top__ring" aria-hidden="true">' +
      '<svg class="back-to-top__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="6" y1="4" x2="18" y2="4"/><polyline points="7 12 12 7 17 12"/><line x1="12" y1="7" x2="12" y2="20"/></svg>' +
    '</span>' +
    '<span class="fab-tip" aria-hidden="true">Back to top</span>';
  document.body.appendChild(topBtn);
  var topTicking = false;
  var updateTop = function () {
    topBtn.classList.toggle('is-visible', window.scrollY > 480);
    topTicking = false;
  };
  window.addEventListener('scroll', function () {
    if (!topTicking) { window.requestAnimationFrame(updateTop); topTicking = true; }
  }, { passive: true });
  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
  updateTop();

  // Contact us: opens the quote modal below (it carries data-quote like the other quote buttons)
  var chatBtn = document.createElement('button');
  chatBtn.type = 'button';
  chatBtn.className = 'chat-fab';
  chatBtn.setAttribute('aria-label', 'Contact us');
  chatBtn.setAttribute('data-quote', '');
  chatBtn.innerHTML =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
    '<span class="fab-tip" aria-hidden="true">Contact us</span>';
  document.body.appendChild(chatBtn);

  // Share: a column of share targets that pops up above the button
  var shareUrl = window.location.href;
  var shareTitle = encodeURIComponent(document.title || 'Hilde Tax Services');
  var u = encodeURIComponent(shareUrl);
  var shareOptions = [
    { key: 'facebook', label: 'Share on Facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=' + u,
      svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' },
    { key: 'whatsapp', label: 'Share on WhatsApp', href: 'https://api.whatsapp.com/send?text=' + shareTitle + '%20' + u,
      svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1s-.5-.2-.7.2c-.2.3-.8 1-1 1.2-.2.2-.4.2-.7 0-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5C9.8 9 9.2 7.6 9 7c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.6 0 1.5 1.1 3 1.3 3.2.2.2 2.2 3.3 5.3 4.6 2.5 1 3 .8 3.6.8.5 0 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4M12.1 2A10 10 0 0 0 2.1 12c0 1.7.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2A10 10 0 0 0 22 11.8 10 10 0 0 0 12.1 2"/></svg>' },
    { key: 'twitter', label: 'Share on X (Twitter)', href: 'https://twitter.com/intent/tweet?url=' + u + '&text=' + shareTitle,
      svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
    { key: 'email', label: 'Share via Email', href: 'mailto:?subject=' + shareTitle + '&body=' + shareTitle + '%0A%0A' + u,
      svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { key: 'copy', label: 'Copy link', href: '#', isCopy: true,
      svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' }
  ];
  var fab = document.createElement('div');
  fab.className = 'share-fab';
  fab.innerHTML =
    '<div class="share-fab__menu" role="menu" aria-label="Share this page">' +
      shareOptions.map(function (o) {
        return '<a class="share-fab__option" data-share="' + o.key + '" role="menuitem" href="' + o.href + '" aria-label="' + o.label + '"' +
          (o.isCopy ? '' : ' target="_blank" rel="noopener noreferrer"') + ' tabindex="-1">' + o.svg + '</a>';
      }).join('') +
    '</div>' +
    '<button class="share-fab__btn" type="button" aria-label="Share this page" aria-expanded="false">' +
      '<svg class="share-fab__svg share-fab__svg--share" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 18C4 10 9 5 19 4"/><polyline points="13 2 19 4 17 10"/></svg>' +
      '<svg class="share-fab__svg share-fab__svg--close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    '</button>' +
    '<span class="share-fab__label" aria-hidden="true">Share</span>';
  document.body.appendChild(fab);

  var shareBtn = fab.querySelector('.share-fab__btn');
  var shareLinks = fab.querySelectorAll('.share-fab__option');
  var setShareOpen = function (open) {
    fab.classList.toggle('is-open', open);
    shareBtn.setAttribute('aria-expanded', String(open));
    // Hidden options stay out of the tab order
    shareLinks.forEach(function (a) { a.tabIndex = open ? 0 : -1; });
  };
  shareBtn.addEventListener('click', function () { setShareOpen(!fab.classList.contains('is-open')); });
  document.addEventListener('click', function (ev) { if (!fab.contains(ev.target)) setShareOpen(false); });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') setShareOpen(false); });
  shareLinks.forEach(function (a) {
    if (a.dataset.share !== 'copy') a.addEventListener('click', function () { window.setTimeout(function () { setShareOpen(false); }, 200); });
  });
  var copyBtn = fab.querySelector('[data-share="copy"]');
  copyBtn.addEventListener('click', function (ev) {
    ev.preventDefault();
    var done = function () {
      copyBtn.classList.add('share-fab__option--copied');
      copyBtn.setAttribute('aria-label', 'Link copied');
      window.setTimeout(function () {
        copyBtn.classList.remove('share-fab__option--copied');
        copyBtn.setAttribute('aria-label', 'Copy link');
      }, 1500);
    };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      done();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(shareUrl).then(done, fallback);
    else fallback();
  });

  // Over the dark footer, the SHARE caption turns light. Only the bottom strip of the screen (where the button sits) counts.
  var footer = document.querySelector('.site-footer');
  if (footer && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      fab.classList.toggle('share-fab--on-dark', entries[0].isIntersecting);
    }, { rootMargin: '-78% 0px 0px 0px' }).observe(footer);
  }

  // Quote modal: every [data-quote] button opens "Request your free quote" in a dialog.
  // Without JS (or <dialog> support) the buttons stay plain links to contact.
  // The form posts as Netlify form "appointment", which is registered by the static copy on contact.
  var quoteTriggers = document.querySelectorAll('[data-quote]');
  var quoteForm = null;
  if (quoteTriggers.length && typeof HTMLDialogElement === 'function') {
    var options = ['Individual tax preparation', 'Business tax preparation', 'Tax audit / IRS assistance',
      'Tax resolution / IRS issues', 'Amended return', 'ITIN / identity verification', 'Prior-year returns',
      'Bookkeeping', 'Refund advance question', 'Something else'];
    var dialog = document.createElement('dialog');
    dialog.className = 'quote-modal';
    dialog.setAttribute('aria-labelledby', 'quote-title');
    dialog.innerHTML =
      '<button type="button" class="quote-close" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<h2 id="quote-title">Request your <span>free quote</span></h2>' +
      '<p class="quote-intro">Fill out the form and we&rsquo;ll contact you to confirm your appointment. No obligation.</p>' +
      '<form class="quote-form" name="appointment" action="thank-you" method="POST" data-endpoint="netlify">' +
        '<input type="hidden" name="form-name" value="appointment">' +
        '<p hidden><label>Leave this empty: <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>' +
        '<div class="form-row">' +
          '<div class="field"><label for="q-name">Full name</label><input type="text" id="q-name" name="name" required autocomplete="name" placeholder="Jane Doe"></div>' +
          '<div class="field"><label for="q-phone">Phone</label><input type="tel" id="q-phone" name="phone" required autocomplete="tel" placeholder="682-555-0123"></div>' +
        '</div>' +
        '<div class="field"><label for="q-email">Email</label><input type="email" id="q-email" name="email" autocomplete="email" placeholder="you@email.com"></div>' +
        '<div class="field"><label for="q-service">What do you need help with?</label><select id="q-service" name="service">' +
          options.map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="q-message">Tell us a little about your situation</label><textarea id="q-message" name="message" placeholder="A few details help us prepare for your free quote..."></textarea></div>' +
        '<button type="submit" class="btn btn-primary quote-submit">Request Free Quote</button>' +
        '<p class="form-note">We keep your information confidential. By submitting, you agree to be contacted about your request.</p>' +
      '</form>';
    document.body.appendChild(dialog);
    quoteForm = dialog.querySelector('form');

    var lastTrigger = null;
    quoteTriggers.forEach(function (btn) {
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        lastTrigger = btn;
        if (header) header.classList.remove('nav-open');
        dialog.showModal();
        document.documentElement.classList.add('modal-open');
        dialog.querySelector('#q-name').focus();
      });
    });
    dialog.querySelector('.quote-close').addEventListener('click', function () { dialog.close(); });
    // Click on the dimmed backdrop (outside the panel) closes it
    dialog.addEventListener('click', function (ev) {
      var r = dialog.getBoundingClientRect();
      if (ev.target === dialog && (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom)) dialog.close();
    });
    dialog.addEventListener('close', function () {
      document.documentElement.classList.remove('modal-open');
      if (lastTrigger) lastTrigger.focus();
    });
  }

  // Old browsers without <dialog>: the Contact us button goes to the contact page instead
  if (!quoteForm) chatBtn.addEventListener('click', function () { window.location.href = 'contact#appointment'; });

  // Quote forms (contact page + modal): progressive enhancement.
  // Falls back to a pre-filled email if no backend endpoint is configured.
  [document.getElementById('appointment-form'), quoteForm].forEach(function (form) {
    if (!form) return;
    form.addEventListener('submit', function (ev) {
      var endpoint = form.getAttribute('data-endpoint') || '';
      // If no real endpoint is wired up yet, build a mailto and let the browser take over.
      // Netlify Forms only exists on Netlify,
      // so every other host (local previews, GitHub Pages, the custom domain) uses the email fallback.
      var onNetlify = /\.netlify\.app$/.test(location.hostname);
      if (!endpoint || endpoint.indexOf('YOUR_FORM_ID') !== -1 || (endpoint === 'netlify' && !onNetlify)) {
        ev.preventDefault();
        var val = function (n) {
          var el = form.elements[n];
          return el ? String(el.value).trim() : '';
        };
        // Encode the whole subject and body so characters like & # ? in a message can't cut it short or add mail fields.
        var subject = encodeURIComponent('Appointment request - ' + (val('name') || 'New client'));
        var body = encodeURIComponent(
          'Name: ' + val('name') + '\r\n' +
          'Phone: ' + val('phone') + '\r\n' +
          'Email: ' + val('email') + '\r\n' +
          'Service: ' + val('service') + '\r\n\r\n' +
          'Message:\r\n' + val('message'));
        window.location.href = 'mailto:BernardMbotchak@hildetaxservice.com?subject=' + subject + '&body=' + body;
      }
      // Otherwise, the form posts to the configured endpoint normally.
    });
  });

  // Team photos not added yet: hide the broken image so the name placeholder underneath shows
  document.querySelectorAll('.hilde-team-photo img').forEach(function (img) {
    var miss = function () { img.parentElement.classList.add('is-missing'); };
    if (img.complete && !img.naturalWidth) miss();
    else img.addEventListener('error', miss);
  });

  // Current year in footer
  var yr = document.querySelectorAll('.js-year');
  yr.forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
