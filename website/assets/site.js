// The agent switch: a tab list, the arrow keys move the selection. Without JavaScript, the tab list stays
// hidden and both command blocks show with their names.
document.documentElement.classList.add('js');
(function () {
  var list = document.querySelector('[data-agents]');
  if (!list) return;
  var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
  // The panels get their tab roles only here, so that a page without JavaScript has no tab panels without tabs.
  tabs.forEach(function (tab) {
    var panel = document.getElementById(tab.getAttribute('aria-controls'));
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
  });
  list.hidden = false;
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, n) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (step) { e.preventDefault(); select(tabs[(n + step + tabs.length) % tabs.length], true); }
    });
  });
  select(tabs[0]);
})();

// The color scheme switch: pressed means dark. Without a selection, the system preference applies. A click
// sets data-theme on the root for this page only: the site stores nothing. Without JavaScript, its list item stays hidden.
(function () {
  var button = document.querySelector('[data-theme-switch]');
  if (!button) return;
  var root = document.documentElement;
  var system = matchMedia('(prefers-color-scheme: dark)');
  function dark() { return root.dataset.theme ? root.dataset.theme === 'dark' : system.matches; }
  function show() { button.setAttribute('aria-pressed', dark()); }
  button.addEventListener('click', function () { root.dataset.theme = dark() ? 'light' : 'dark'; show(); });
  system.addEventListener('change', show);
  button.parentNode.hidden = false;
  show();
})();

// Matomo counts visits only with the consent of the visitor. Before consent, nothing of Matomo loads and the site
// sets no cookie. The choice is kept for 365 days. Raise VERSION when what the site counts changes, so that each
// visitor is asked again. Consent is given for each page (setConsentGiven), so Matomo sets no consent cookie of
// its own. Do Not Track and Global Privacy Control hide the banner. Only the public host sends data.
var analytics = (function () {
  var MATOMO = {
    host: 'sparc.apps.vensas.de',
    site: '9',
    tracker: 'https://vensas.matomo.cloud/matomo.php',
    script: 'https://cdn.matomo.cloud/vensas.matomo.cloud/matomo.js',
  };
  var KEY = 'sparc-consent', VERSION = 1, MAX_AGE = 365 * 24 * 60 * 60 * 1000;
  var banner = document.querySelector('[data-consent]');
  var active = false;
  if (!banner) return { event: function () {} };

  function stored() {
    try {
      var entry = JSON.parse(localStorage.getItem(KEY));
      var age = Date.now() - entry.at;
      if (entry.v === VERSION && (entry.choice === 'granted' || entry.choice === 'denied') && age >= 0 && age <= MAX_AGE) return entry.choice;
    } catch (e) { /* no entry, or no storage */ }
    return null;
  }
  function store(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: VERSION, choice: choice, at: Date.now() })); } catch (e) { /* the choice applies to this page only */ }
  }
  function start() {
    if (active || location.hostname !== MATOMO.host) return;
    active = true;
    var queue = window._paq = window._paq || [];
    queue.push(['requireConsent'], ['setConsentGiven'], ['setTrackerUrl', MATOMO.tracker], ['setSiteId', MATOMO.site],
      ['setDomains', [MATOMO.host]], ['disableBrowserFeatureDetection'], ['trackPageView']);
    var script = document.createElement('script');
    script.async = true;
    script.src = MATOMO.script;
    document.head.appendChild(script);
  }
  // Before matomo.js runs, _paq is the array of this script: empty it. After it ran, block it with requireConsent
  // (forgetConsentGiven and optUserOut would set a cookie) and reload the page, so that matomo.js unloads.
  function stop() {
    var queue = window._paq;
    if (Array.isArray(queue)) queue.length = 0;
    else if (queue) queue.push(['requireConsent']);
    var expired = '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (!/^(_pk_|mtm_)/.test(name)) return;
      document.cookie = name + expired;
      document.cookie = name + expired + '; domain=' + location.hostname;
    });
    if (active) location.reload();
    active = false;
  }
  function decide(choice) {
    store(choice);
    banner.hidden = true;
    if (choice === 'granted') start(); else stop();
  }
  var choices = banner.querySelectorAll('[data-consent-choice]');
  [].forEach.call(choices, function (button) {
    button.addEventListener('click', function () { decide(button.dataset.consentChoice); });
  });
  [].forEach.call(document.querySelectorAll('[data-consent-open]'), function (button) {
    button.parentNode.hidden = false;
    button.addEventListener('click', function () { banner.hidden = false; choices[0].focus(); });
  });
  var choice = stored();
  if (choice === 'granted') start();
  else if (!choice && navigator.doNotTrack !== '1' && navigator.globalPrivacyControl !== true) banner.hidden = false;
  return {
    event: function (category, action, name) { if (active) window._paq.push(['trackEvent', category, action, name]); },
  };
})();

// Copy the install commands of the shown agent, and count the copy with consent. The button holds the texts in the
// language of the page.
document.querySelectorAll('[data-copy-agent]').forEach(function (button) {
  var label = button.textContent;
  button.addEventListener('click', function () {
    var shown = document.querySelector('.agent-cmd:not([hidden])');
    analytics.event('Install', 'Copy', shown.id.replace('cmd-', ''));
    navigator.clipboard.writeText(shown.dataset.copy).then(function () {
      button.textContent = button.dataset.copied;
      setTimeout(function () { button.textContent = label; }, 1600);
    }, function () { button.textContent = button.dataset.failed; });
  });
});

// The scroll position steps through the loop: the active frame gets the gold bar, the next frame is outlined.
// In a row of frames, the progress through the section picks the frame. In a column, the frame at the
// reading line. No marks when the visitor prefers reduced motion.
(function () {
  var loop = document.querySelector('[data-loop]');
  if (!loop || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var items = loop.querySelectorAll('li');
  var section = loop.closest('section');
  var queued = false;
  function active() {
    var view = window.innerHeight;
    var row = items[0].getBoundingClientRect().top === items[1].getBoundingClientRect().top;
    if (row) {
      var box = section.getBoundingClientRect();
      var progress = (view * 0.85 - box.top) / (box.height + view * 0.3);
      return Math.max(0, Math.min(items.length - 1, Math.floor(progress * items.length)));
    }
    var line = view * 0.4, best = 0, distance = Infinity;
    items.forEach(function (li, n) {
      var r = li.getBoundingClientRect();
      var d = Math.abs(r.top + r.height / 2 - line);
      if (d < distance) { distance = d; best = n; }
    });
    return best;
  }
  function show() {
    queued = false;
    var box = section.getBoundingClientRect();
    var visible = box.bottom > 0 && box.top < window.innerHeight;
    var i = visible ? active() : -1;
    items.forEach(function (li, n) {
      li.classList.toggle('is-active', n === i);
      li.classList.toggle('is-next', i >= 0 && n === (i + 1) % items.length);
    });
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(show); } }
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  show();
})();
