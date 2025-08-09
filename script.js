/* script.js
   - initialises EmailJS with the public key you provided
   - sets up proximity-triggered reactions for background shapes
   - handles form submission via emailjs.sendForm(service, template, form)
*/

/* ========== EmailJS init (your public key) ========== */
(function(){
  if (window.emailjs) {
    emailjs.init("CRuFdyVtrwqhV65Eq"); // << your public key
  } else {
    console.warn("EmailJS script not loaded. Check network or CDN.");
  }
})();

/* ========== Shapes proximity interaction ========== */
(() => {
  const shapes = Array.from(document.querySelectorAll('.shape'));
  if (!shapes.length) return;

  // Make shapes respond to cursor proximity.
  // On desktop we use mousemove. On touch devices, respond to touchmove if desired.
  let raf = null;

  function handlePointer(x, y) {
    shapes.forEach(shape => {
      // get center of shape
      const r = shape.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = Number(shape.dataset.threshold) || 140;

      // if cursor is close enough -> add 'react' class and apply directional nudge
      if (dist < threshold) {
        if (!shape.classList.contains('react')) {
          shape.classList.add('react');
          // remove after animation completes (safety)
          clearTimeout(shape._removeTimer);
          shape._removeTimer = setTimeout(() => shape.classList.remove('react'), 700);
        }

        // nudge in direction away from cursor for a subtle 2D effect
        const strength = (1 - dist / threshold) * 18; // px
        // avoid divide by zero
        const nx = dist === 0 ? 0 : (dx / dist) * strength;
        const ny = dist === 0 ? 0 : (dy / dist) * strength;

        // apply a transform combining the nudge and a tiny scale
        shape.style.transform = `translate(${nx}px, ${ny}px) scale(${1 + strength / 220}) rotate(${(nx / 6).toFixed(2)}deg)`;
      } else {
        // if far away, reset transform & class
        shape.classList.remove('react');
        shape.style.transform = '';
        clearTimeout(shape._removeTimer);
      }
    });
  }

  function mouseHandler(e) {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => handlePointer(e.clientX, e.clientY));
  }

  function touchHandler(e) {
    const t = e.touches[0];
    if (!t) return;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => handlePointer(t.clientX, t.clientY));
  }

  window.addEventListener('mousemove', mouseHandler, {passive:true});
  window.addEventListener('touchmove', touchHandler, {passive:true});
})();

/* ========== EmailJS form submit ========== */
(() => {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('status');

  if (!form) return;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    statusEl.textContent = '';

    // sendForm takes (serviceID, templateID, formElement)
    emailjs.sendForm('service_7ov4npt', 'template_y7bqugn', form)
      .then((resp) => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        statusEl.style.color = 'green';
        statusEl.textContent = 'Message sent — thank you!';
        form.reset();
      }, (err) => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        statusEl.style.color = 'crimson';
        statusEl.textContent = 'Failed to send — please try again.';
        console.error('EmailJS error', err);
      });
  });
})();
