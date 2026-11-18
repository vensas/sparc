// Copy the install commands. The button holds the texts in the language of the page.
document.querySelectorAll('[data-copy]').forEach(function (button) {
  var label = button.textContent;
  button.addEventListener('click', function () {
    navigator.clipboard.writeText(button.dataset.copy).then(function () {
      button.textContent = button.dataset.copied;
      setTimeout(function () { button.textContent = label; }, 1600);
    }, function () { button.textContent = button.dataset.failed; });
  });
});

// Step through the loop: the active frame is gold, the next frame is outlined.
// No animation when the visitor prefers reduced motion.
(function () {
  var loop = document.querySelector('[data-loop]');
  if (!loop || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var items = loop.querySelectorAll('li');
  var i = 0, timer = null;
  function show() {
    items.forEach(function (li, n) {
      li.classList.toggle('is-active', n === i);
      li.classList.toggle('is-next', n === (i + 1) % items.length);
    });
  }
  function start() { if (!timer) { show(); timer = setInterval(function () { i = (i + 1) % items.length; show(); }, 1800); } }
  function stop() { clearInterval(timer); timer = null; }
  new IntersectionObserver(function (e) { e[0].isIntersecting ? start() : stop(); }, { threshold: 0.4 }).observe(loop);
  loop.addEventListener('mouseenter', stop);
  loop.addEventListener('focusin', stop);
  loop.addEventListener('mouseleave', start);
})();
