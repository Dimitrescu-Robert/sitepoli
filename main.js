class SimpleDropdown {
  constructor() {
      this.activeDropdown = null;
      this.init();
  }

  init() {
      // Event listeners pentru textele Set (clickabile)
      const setTexts = document.querySelectorAll('.subiecte-box, .subiecte-box-info');
      setTexts.forEach(text => {
          text.addEventListener('click', (e) => this.toggleDropdown(e));
      });

      // Închide dropdown cu Escape
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
              this.closeAllDropdowns();
          }
      });

      // Închide dropdown când faci click în afara lui
      document.addEventListener('click', (e) => {
          if (!e.target.closest('.set-container') && !e.target.classList.contains('subiecte-box, .subiecte-box-info')){
              this.closeAllDropdowns();
          }
      });
  }

  toggleDropdown(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const text = e.currentTarget;
      const setYear = text.getAttribute('data-set');
      const dropdown = document.getElementById(`dropdown-${setYear}`);

      // Închide alte dropdown-uri deschise
      if (this.activeDropdown && this.activeDropdown !== dropdown) {
          this.closeDropdown(this.activeDropdown);
      }

      // Toggle dropdown-ul curent
     if (dropdown.classList.contains('show')) {
          this.closeDropdown(dropdown);
      } else {
          this.openDropdown(dropdown, text);
      }
  }

  openDropdown(dropdown, text) {
      dropdown.classList.add('show');
      text.classList.add('active');
      this.activeDropdown = dropdown;
      
      console.log('Deschis dropdown pentru:', dropdown.id);
  }

  closeDropdown(dropdown) {
      const text = document.querySelector(`[data-set="${dropdown.id.split('-')[1]}"]`);
      
      dropdown.classList.remove('show');
      if (text) {
          text.classList.remove('active');
      }
      
      if (this.activeDropdown === dropdown) {
          this.activeDropdown = null;
      }
  }

  closeAllDropdowns() {
      const allDropdowns = document.querySelectorAll('.dropdown-section');
      allDropdowns.forEach(dropdown => {
          this.closeDropdown(dropdown);
      });
  }
}

/* ── Typewriter hero ── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const h1 = document.querySelector('[data-typewriter]');
  if (!h1) return;

  const fullText = h1.getAttribute('data-typewriter');
  const cursor  = h1.querySelector('.tw-cursor');

  // Scoate cursorul temporar ca să tipărim înaintea lui
  if (cursor) h1.insertBefore(document.createTextNode(''), cursor);

  let textNode = h1.childNodes[0];
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
    textNode = document.createTextNode('');
    h1.insertBefore(textNode, cursor || null);
  }

  let i = 0;

  // Viteze variabile: mai rapid pe litere comune, pauze la spații/punctuație
  function nextDelay(ch) {
    if (ch === ' ')  return 80  + Math.random() * 60;
    if (ch === '-')  return 150 + Math.random() * 80;
    if (/[A-Z]/.test(ch)) return 90 + Math.random() * 50; // majuscule — mic efort
    return 55 + Math.random() * 45;
  }

  function type() {
    if (i >= fullText.length) return;
    textNode.textContent += fullText[i];
    i++;
    if (i < fullText.length) setTimeout(type, nextDelay(fullText[i]));
  }

  // Pornește după 350ms
  setTimeout(type, 350);
})();

/* ── Scroll shrink pentru nav island ── */
(function() {
    const header = document.querySelector('header');
    if (!header) return;
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                header.classList.toggle('scrolled', window.scrollY > 40);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

// Info card accordion (informatii.html)
function initInfoCards() {
    document.querySelectorAll('.info-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't toggle if clicking a link inside
            if (e.target.closest('a')) return;
            const isActive = card.classList.contains('active');
            // Close all others
            document.querySelectorAll('.info-card.active').forEach(c => c.classList.remove('active'));
            if (!isActive) card.classList.add('active');
        });
    });
}

// Inițializează când se încarcă pagina
document.addEventListener('DOMContentLoaded', function() {
    new SimpleDropdown();
    initInfoCards();

    // Smooth scroll pentru butonul "Povestea noastră"
    const poetveaBtn = document.querySelector('a[href="#despre-noi"]');
    if (poetveaBtn) {
        poetveaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById('despre-noi');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
});

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-elements");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll("nav li a").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));
}

// Contact Form

const form = document.getElementById('contact-form');

if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(form);
      const accessKey = "6eaadb1c-89a0-4ec2-8e96-acb65cf36873";

      const recipient = "admiterepoli@gmail.com";

      Swal.fire({
        title: 'Se trimite mesajul...',
        timer: 1000,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      formData.append("access_key", accessKey);
      formData.append("to", recipient);

      const json = JSON.stringify(Object.fromEntries(formData));

      fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: json
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            Swal.fire({
              title: 'Succes!',
              text: 'Mesaj trimis cu succes!',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#555879'
            });
          } else {
            Swal.fire({
              title: 'Oops!',
              text: data.message || 'A apărut o eroare la trimitere!',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#555879'
            });
          }
        })
        .catch(error => {
          console.log(error);
          Swal.fire({
            title: 'Oops!',
            text: 'A apărut o eroare la trimitere!',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#555879'
          });
        })
        .finally(() => {
          form.reset();
        });
    });
}

/* ── Newsletter / WhatsApp Popup ── */
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('newsletter-popup');
    if (!popup) return; // Pagina nu are popup, ieșim

    const STORAGE_KEY  = 'newsletter_last_shown';
    const COOLDOWN_MS  = 86400000; // 24 ore
    const SHOW_DELAY   = 12000; 

    // ── Ascunde popup-ul și salvează timestamp-ul curent în localStorage.
    //    Apelată indiferent de modul în care utilizatorul interacționează.
    function dismissPopup(actionType) {
        popup.classList.remove('active');
        // Așteptăm animația de fade-out înainte de display:none
        setTimeout(() => { popup.style.display = 'none'; }, 300);

        try {
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
        } catch (e) {
            console.warn('[Popup] Nu s-a putut salva în localStorage:', e);
        }
        console.log('[Popup] Închis via:', actionType);
    }

    // ── Afișează popup-ul dacă nu au trecut 24 de ore de la ultima interacțiune.
    function tryShowPopup() {
        let lastShownTime = 0;
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) lastShownTime = parseInt(stored, 10) || 0;
        } catch (e) {
            console.warn('[Popup] Nu s-a putut citi localStorage:', e);
        }

        const cooldownExpired = (Date.now() - lastShownTime) > COOLDOWN_MS;

        if (cooldownExpired) {
            setTimeout(function() {
                const authModal = document.getElementById('auth-modal-overlay');
                if (authModal && authModal.classList.contains('open')) return;
                popup.style.display = 'flex';
                // Micro-delay pentru a declanșa tranziția CSS
                setTimeout(() => popup.classList.add('active'), 10);
            }, SHOW_DELAY);
        }
    }

    tryShowPopup();

    // ── Butonul "X" ──────────────────────────────────────────────────────────
    const closeBtn = popup.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => dismissPopup('close-btn'));
    }

    // ── Link-ul "Nu, mulțumesc" ───────────────────────────────────────────────
    const dismissLink = popup.querySelector('.dismiss-link');
    if (dismissLink) {
        dismissLink.addEventListener('click', function(e) {
            e.preventDefault();
            dismissPopup('dismiss-link');
        });
    }

    // ── Link-ul WhatsApp – utilizatorul a acționat, resetăm timer-ul ─────────
    const whatsappLink = document.getElementById('whatsapp-link');
    if (whatsappLink) {
        whatsappLink.addEventListener('click', () => dismissPopup('whatsapp-link'));
        // Nota: nu prevenim navigarea (target="_blank") – browser-ul deschide
        // grupul WA în tab nou, iar popup-ul se închide în background.
    }

    // ── Click în afara popup-ului ─────────────────────────────────────────────
    window.addEventListener('click', function(e) {
        if (e.target === popup) dismissPopup('outside-click');
    });
});

// ── Countdown timer (pagina simulări) ────────────────────────────────────────
const targetDate = new Date("Mar 26, 2026 13:10:00").getTime();
const btn = document.getElementById("glass-countdown-btn");
const timerText = document.getElementById("countdown-timer");

if (btn && timerText) {
    const updateCountdown = setInterval(() => {
        const distance = targetDate - Date.now();

        if (distance <= 0) {
            clearInterval(updateCountdown);
            btn.classList.remove("locked");
            btn.classList.add("active");
        } else {
            const d = String(Math.floor(distance / 86400000)).padStart(2, '0');
            const h = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
            const m = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
            const s = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
            timerText.innerText = `${d}z ${h}h ${m}m ${s}s`;
        }
    }, 1000);
}
