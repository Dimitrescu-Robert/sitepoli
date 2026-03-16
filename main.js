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

// Inițializează când se încarcă pagina
document.addEventListener('DOMContentLoaded', function() {
    new SimpleDropdown();

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

/* Upgraded Newsletter Popup Logic */
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('newsletter-popup');
    if (!popup) return;

    // Track Popup Open
    function showPopup() {
        let lastShown = null;
        try {
            lastShown = localStorage.getItem('newsletter_last_shown');
        } catch (e) {
            console.warn('[Newsletter] LocalStorage access failed:', e);
        }

        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        const lastShownTime = lastShown ? parseInt(lastShown, 10) : 0;

        // Show if never shown, if value is invalid, or if 7 days have passed
        //if (!lastShown || isNaN(lastShownTime) || (now - lastShownTime > oneDay)) {
        if (1) {
            setTimeout(function() {
                popup.style.display = 'flex';
                // Trigger animation
                setTimeout(() => popup.classList.add('active'), 10);
                console.log('[Analytics] Newsletter Popup Opened');
            }, 12000); // 12 seconds delay (requested 10-15s)
        }
    }

    showPopup();

    const closeBtn = popup.querySelector('.close-btn');
    
    function dismissPopup(actionType) {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300); // Wait for fade out
        
        try {
            localStorage.setItem('newsletter_last_shown', new Date().getTime().toString());
        } catch (e) {
            console.warn('[Newsletter] Failed to save dismissal:', e);
        }
        console.log(`[Analytics] Newsletter Popup Dismissed (${actionType})`);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => dismissPopup('Close Button'));
    }

    // Handle "Nu acum" link if it exists
    const dismissLink = popup.querySelector('.dismiss-link');
    if (dismissLink) {
        dismissLink.addEventListener('click', (e) => {
            e.preventDefault();
            dismissPopup('Dismiss Link');
        });
    }

    // Close on click outside
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            dismissPopup('Outside Click');
        }
    });

    // --- BUCATA NOUĂ ÎNCEPE AICI ---
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Oprim browserul să schimbe pagina/tabul
            
            const submitBtn = newsletterForm.querySelector('.glass-btn');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Se trimite...";
            submitBtn.disabled = true;

            // Luăm adresa de email din formular
            const formData = new FormData(newsletterForm);

            // O trimitem către Brevo în fundal, absolut invizibil
            fetch(newsletterForm.action, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Secretul care face trimiterea silențioasă
            }).then(() => {
                // Afișăm succesul
                const content = popup.querySelector('.newsletter-content');
                content.innerHTML = `
                    <button class="close-btn" aria-label="Close">&times;</button>
                    <div style="padding: 1rem 0;">
                        <h3 class="glass-headline" style="color: #0f172a !important;">Ești în echipă! 🎓</h3>
                        <p class="glass-body">Verifică inbox-ul pentru primul email.</p>
                    </div>
                `;

                const newCloseBtn = content.querySelector('.close-btn');
                if (newCloseBtn) {
                    newCloseBtn.addEventListener('click', () => dismissPopup('Success State'));
                }
                
                setTimeout(() => {
                    dismissPopup('Auto Success');
                }, 4000);

            }).catch(error => {
                console.error('Eroare:', error);
                submitBtn.innerText = "Eroare. Mai încearcă.";
                submitBtn.disabled = false;
            });
        });
    }
    // --- BUCATA NOUĂ SE TERMINĂ AICI ---

    // Countdown logic
// Set your target date here!
const targetDate = new Date("Mar 21, 2026 10:00:00").getTime();
const btn = document.getElementById("glass-countdown-btn");
const timerText = document.getElementById("countdown-timer");

const updateCountdown = setInterval(() => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  // If the countdown is finished
  if (distance <= 0) {
    clearInterval(updateCountdown);
    
    // Swap the classes to unlock the button
    btn.classList.remove("locked");
    btn.classList.add("active");
    
  } else {
    // Math to calculate time remaining
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Formats numbers to always have two digits (e.g., "09" instead of "9")
    const d = String(days).padStart(2, '0');
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');

    // Display the result
    timerText.innerText = `${d}z ${h}h ${m}m ${s}s`;
  }
}, 1000);

}); // Ultima linie din fișier (închiderea de la DOMContentLoaded)
