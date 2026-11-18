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

// Copy the install commands of the shown agent. The button holds the texts in the language of the page.
document.querySelectorAll('[data-copy-agent]').forEach(function (button) {
  var label = button.textContent;
  button.addEventListener('click', function () {
    var shown = document.querySelector('.agent-cmd:not([hidden])');
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
