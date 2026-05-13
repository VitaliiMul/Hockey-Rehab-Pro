/* ============================================================
   Hockey Rehab Pro — script.js
   ============================================================ */

/* --- Nav: transparent → solid on scroll ------------------- */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

if (window.scrollY > 50) nav.classList.add('scrolled');

/* --- Mobile menu ------------------------------------------ */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const mobileClose = document.getElementById('mobileMenuClose');

function openMenu() {
  mobileMenu.classList.add('is-open');
  menuOverlay.classList.add('is-open');
  hamburger.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.remove('is-open');
  menuOverlay.classList.remove('is-open');
  hamburger.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMenu);
mobileClose.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);

mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeMenu();
    closeChatbot();
  }
});

/* --- Smooth scroll for in-page anchor links --------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* --- Dynamic copyright year ------------------------------- */
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* --- Scroll-reveal animations (IntersectionObserver) ------ */
const revealStyle = document.createElement('style');
revealStyle.textContent = '.is-revealed { opacity: 1 !important; transform: none !important; }';
document.head.appendChild(revealStyle);

const revealEls = document.querySelectorAll(
  '.service-card, .step, .program__feature, .testimonial-card, .pricing-card, .about__grid, .youtube-cta__inner, .trust-bar__item, .faq__item'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transitionDelay = `${(i % 3) * 0.08}s`;
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  revealObserver.observe(el);
});

/* --- FAQ accordion ---------------------------------------- */
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', function () {
    const item = this.closest('.faq__item');
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq__item.is-open').forEach(openItem => {
      openItem.classList.remove('is-open');
      openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('is-open');
      this.setAttribute('aria-expanded', 'true');
    }
  });
});

/* --- Newsletter form: client-side validation -------------- */
const newsletterForm     = document.getElementById('newsletterForm');
const newsletterFeedback = document.getElementById('newsletterFeedback');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const nameInput  = this.querySelector('[name="name"]');
    const emailInput = this.querySelector('[name="email"]');
    const name  = nameInput.value.trim();
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name) { showFeedback('Please enter your name.', 'error'); nameInput.focus(); return; }
    if (!email || !emailRegex.test(email)) { showFeedback('Please enter a valid email address.', 'error'); emailInput.focus(); return; }
    /* TODO: wire to Mailchimp / ConvertKit endpoint */
    showFeedback("You're in! Check your inbox for the ACL Checklist.", 'success');
    newsletterForm.reset();
  });
}

function showFeedback(message, type) {
  if (!newsletterFeedback) return;
  newsletterFeedback.textContent = message;
  newsletterFeedback.style.color = type === 'error' ? '#e53935' : '#009cda';
  newsletterFeedback.style.fontWeight = '600';
}

/* ============================================================
   CHATBOT WIDGET
   ============================================================ */
(function () {
  const LOGO = './Screenshot%202026-05-06%20193714.png';

  const prompts = [
    {
      label: 'In-Person Clinic',
      response: 'Hockey Rehab Pro has an in-person rehab clinic in Calgary, AB. Sessions are 1-on-1 with Vitalii using advanced rehabilitation equipment and technology — completely personalized to your injury and timeline. It\'s the most direct path back to the ice.',
      link: { text: 'Book a session →', url: './contact.html' }
    },
    {
      label: 'What is HIRP?',
      response: 'HIRP (Hockey Injury Recovery Program) is Vitalii\'s structured online ACL recovery program built for hockey players. It\'s a 9–12+ month roadmap with objective testing and clear return-to-ice criteria — train from anywhere.',
      link: { text: 'Learn about HIRP →', url: './program.html' }
    },
    {
      label: 'How much does it cost?',
      response: 'The in-person Calgary clinic pricing is customized — contact us to book and get details. The online HIRP program is $24/month with no contracts, cancel anytime. There\'s also a completely free Education Hub.',
      link: { text: 'See full pricing →', url: './pricing.html' }
    },
    {
      label: 'How do I get started?',
      response: 'If you\'re in Calgary, book an in-person clinic session. If you\'re anywhere else, join HIRP online for $24/month or start with the free hub at no cost.',
      link: { text: 'Book clinic or get started →', url: './contact.html' }
    },
    {
      label: 'How long is recovery?',
      response: 'HIRP covers a 9–12+ month ACL recovery roadmap. Each phase has objective benchmarks — you advance when you pass the tests, not just when time passes.',
      link: { text: 'How it works →', url: './services.html' }
    },
    {
      label: 'Who is Vitalii?',
      response: 'Vitalii is a former professional hockey player based in Calgary who built Hockey Rehab Pro after experiencing how the standard rehab system fails hockey athletes. He runs an in-person clinic and the online HIRP program.',
      link: { text: 'About Vitalii →', url: './about.html' }
    },
    {
      label: 'Free ACL Checklist',
      response: 'Download the free Hockey ACL Recovery Checklist — a phase-by-phase guide to knowing exactly where you are and what comes next on your road back to the ice.',
      link: { text: 'Get the checklist →', url: './contact.html' }
    }
  ];

  /* Inject chatbot HTML */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="chatbot" id="chatbot">
      <button class="chatbot__toggle" id="chatbotToggle" aria-label="Open chat assistant">
        <i class="fa-solid fa-comments" aria-hidden="true"></i>
        <span class="chatbot__badge" id="chatbotBadge">1</span>
      </button>
      <div class="chatbot__window" id="chatbotWindow" aria-hidden="true" role="dialog" aria-label="Hockey Rehab Pro assistant">
        <div class="chatbot__header">
          <div class="chatbot__header-left">
            <span class="logo-clip chatbot__msg-avatar" style="width:36px;height:36px;">
              <img src="${LOGO}" alt="Hockey Rehab Pro" width="36" height="36">
            </span>
            <div>
              <p class="chatbot__name">Hockey Rehab Pro</p>
              <p class="chatbot__status"><span class="chatbot__dot"></span> Here to help</p>
            </div>
          </div>
          <button class="chatbot__close-btn" id="chatbotClose" aria-label="Close chat">&times;</button>
        </div>
        <div class="chatbot__body" id="chatbotBody">
          <div class="chatbot__messages" id="chatbotMessages"></div>
          <div class="chatbot__quickreplies" id="chatbotQuickReplies"></div>
        </div>
      </div>
    </div>
  `);

  const toggleBtn  = document.getElementById('chatbotToggle');
  const chatWindow = document.getElementById('chatbotWindow');
  const badge      = document.getElementById('chatbotBadge');
  const closeBtn   = document.getElementById('chatbotClose');
  const messagesEl = document.getElementById('chatbotMessages');
  const qrEl       = document.getElementById('chatbotQuickReplies');
  let chatOpen     = false;
  let initialized  = false;

  function addBotMsg(text, link) {
    const div = document.createElement('div');
    div.className = 'chatbot__msg';
    div.innerHTML = `
      <span class="logo-clip chatbot__msg-avatar" style="width:30px;height:30px;flex-shrink:0;">
        <img src="${LOGO}" alt="" aria-hidden="true" width="30" height="30">
      </span>
      <div class="chatbot__msg-bubble">
        ${text}
        ${link ? `<br><br><a href="${link.url}"${link.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${link.text}</a>` : ''}
      </div>
    `;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addUserMsg(text) {
    const div = document.createElement('div');
    div.className = 'chatbot__msg chatbot__msg--user';
    div.innerHTML = `<div class="chatbot__msg-bubble">${text}</div>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showQuickReplies() {
    qrEl.innerHTML = '';
    prompts.forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'chatbot__qr-btn';
      btn.textContent = p.label;
      btn.addEventListener('click', () => {
        addUserMsg(p.label);
        qrEl.innerHTML = '';
        setTimeout(() => {
          addBotMsg(p.response, p.link);
          setTimeout(showQuickReplies, 500);
        }, 300);
      });
      qrEl.appendChild(btn);
    });
  }

  function openChatbot() {
    chatOpen = true;
    chatWindow.classList.add('is-open');
    chatWindow.setAttribute('aria-hidden', 'false');
    badge.style.display = 'none';
    if (!initialized) {
      initialized = true;
      addBotMsg("Hi! 👋 I'm here to help you navigate Hockey Rehab Pro. What would you like to know?");
      setTimeout(showQuickReplies, 250);
    }
  }

  window.closeChatbot = function () {
    chatOpen = false;
    chatWindow.classList.remove('is-open');
    chatWindow.setAttribute('aria-hidden', 'true');
  };

  toggleBtn.addEventListener('click', () => chatOpen ? closeChatbot() : openChatbot());
  closeBtn.addEventListener('click', closeChatbot);
})();
