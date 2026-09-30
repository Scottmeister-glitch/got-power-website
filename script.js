(() => {
  const menu = document.querySelector('.menu'), nav = document.querySelector('nav');
  if (menu && nav) {
    menu.onclick = () => nav.classList.toggle('open');
    nav.querySelectorAll('a').forEach(a => a.onclick = () => nav.classList.remove('open'));
  }
  const debug = new URLSearchParams(location.search).get('ga_debug') === '1';
  function track(name, parameters) {
    if (typeof window.gtag === 'function') window.gtag('event', name, {
      send_to: 'G-457JX3YZSF', ...(debug ? {debug_mode: true} : {}), ...parameters
    });
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="tel:"]');
    if (!link || event.defaultPrevented) return;
    const href = link.getAttribute('href');
    const section = ['.topbar', 'header', '.hero', '#contact', 'footer', '.mobile']
      .find(selector => link.closest(selector)) || 'other';
    const normal = event.button === 0 && !event.ctrlKey && !event.metaKey
      && !event.shiftKey && !event.altKey && !link.target;
    let timer, opened = false;
    const open = () => {
      if (opened) return;
      opened = true;
      clearTimeout(timer);
      window.location.href = href;
    };
    if (normal) {
      event.preventDefault();
      // Independent fallback so blocked analytics never blocks calling.
      timer = setTimeout(open, 500);
    }
    try {
      track('phone_click', {link_location: section.replace(/[.#]/g, ''), transport_type: 'beacon',
        ...(normal ? {event_callback: open, event_timeout: 500} : {})});
    } catch (_) { if (normal) open(); }
  });
  const form = document.querySelector('#form');
  const key = 'got-power-pending-submission';
  if (form) form.addEventListener('submit', () => {
    // Keep the normal POST, activation and CAPTCHA. Never preventDefault/AJAX.
    const next = form.querySelector('[name="_next"]');
    next.value = new URL('thanks.html', location.href).href;
    try {
      sessionStorage.removeItem(key);
      if (form.querySelector('[name="_honey"]').value) return;
      const token = crypto.randomUUID();
      sessionStorage.setItem(key, JSON.stringify({token, time: Date.now()}));
      const url = new URL(next.value);
      if (debug) url.searchParams.set('ga_debug', '1');
      url.hash = token;
      next.value = url.href;
    } catch (_) { /* Still submit if storage is unavailable. */ }
  });
  if (document.body.dataset.page === 'contact-thanks') {
    const token = location.hash.slice(1);
    history.replaceState(null, '', location.pathname + location.search);
    try {
      const pending = JSON.parse(sessionStorage.getItem(key) || 'null');
      if (!pending || pending.token !== token || Date.now() < pending.time
        || Date.now() - pending.time > 3600000) return;
      sessionStorage.removeItem(key);
      track('generate_lead', {form_id: 'contact', submission_method: 'formsubmit_redirect'});
    } catch (_) { /* Analytics must not affect confirmation. */ }
  }
})();
