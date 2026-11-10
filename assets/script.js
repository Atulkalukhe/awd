const config = {
  whatsappNumber: '918378938665',
  formEndpoint: 'https://formsubmit.co/ajax/kalukheatul@gmail.com',
  paymentLink: '' // Add the official Payoneer payment-request URL here when available.
};

document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      menuButton.setAttribute('aria-label', expanded ? 'Open navigation menu' : 'Close navigation menu');
      menuButton.innerHTML = expanded ? '&#9776;' : '&times;';
      navLinks.classList.toggle('open', !expanded);
      document.body.classList.toggle('menu-open', !expanded);
    });
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
      menuButton.innerHTML = '&#9776;';
    }));
  }

  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const form = document.querySelector('#inquiry-form');
      if (!form || !form.checkValidity()) return;
      const data = new FormData(form);
      const message = `Hello Aarya Web Developers, I'd like an inquiry.\n\nName: ${data.get('name')}\nBusiness: ${data.get('business')}\nService: ${data.get('service')}\nBudget: ${data.get('budget')}\nDetails: ${data.get('details')}`;
      event.currentTarget.href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
    });
  });

  const form = document.querySelector('#inquiry-form');
  if (form) {
    const params = new URLSearchParams(window.location.search);
    const selectedService = params.get('service');
    const selectedPackage = params.get('package');
    if (selectedService) {
      const serviceInput = form.elements.service;
      const matchingOption = [...serviceInput.options].find((option) => option.text === selectedService || option.text.includes(selectedService));
      if (matchingOption) serviceInput.value = matchingOption.value;
    }
    if (selectedPackage) {
      form.elements.details.value = `I am interested in the ${selectedPackage} package.\n\n`;
      form.elements.budget.value = selectedPackage === '1 Poster' ? 'Starting at $10' : 'Need a quote';
    }
    const status = form.querySelector('.form-status');
    const submit = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (form.elements.website.value) return;
      submit.disabled = true;
      submit.textContent = 'Sending inquiry…';
      status.className = 'form-status';
      status.textContent = '';
      try {
        const response = await fetch(config.formEndpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Submission failed');
        form.reset();
        status.className = 'form-status success';
        status.textContent = 'Thanks — your inquiry was sent. We’ll reply by email shortly.';
      } catch (error) {
        status.className = 'form-status error';
        status.textContent = 'We could not send your inquiry right now. Please email kalukheatul@gmail.com or contact us on WhatsApp.';
      } finally {
        submit.disabled = false;
        submit.textContent = 'Send My Inquiry';
      }
    });
  }

  const filters = document.querySelectorAll('[data-filter]');
  const projects = document.querySelectorAll('[data-category]');
  filters.forEach((filter) => filter.addEventListener('click', () => {
    filters.forEach((button) => { button.classList.remove('active'); button.setAttribute('aria-pressed', 'false'); });
    filter.classList.add('active'); filter.setAttribute('aria-pressed', 'true');
    const type = filter.dataset.filter;
    projects.forEach((project) => { project.hidden = type !== 'all' && project.dataset.category !== type; });
  }));

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
});
