
class SimpleDropdown {
                constructor() {
                    this.activeDropdown = null;
                    this.init();
                }

                init() {
                    // Event listeners pentru textele Set (clickabile)
                    const setTexts = document.querySelectorAll('.subiecte-box');
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
                        if (!e.target.closest('.set-container') && !e.target.classList.contains('subiecte-box')){
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
    });

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-elements");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

document.querySelectorAll("nav li a").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Contact Form

const form = document.getElementById('contact-form');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(form);
  const accessKey = "88b1faa6-673f-4b31-8afd-caba70f04452";
  const recipients = [
    "robertdimitrescu@gmail.com",
    "alexlacatus@gmail.com"
  ];

  Swal.fire({
    title: 'Se trimite mesajul...',
    timer: 1000,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  const sendPromises = recipients.map(email => {
    const fd = new FormData(form);
    fd.append("to", email);
    fd.append("access_key", accessKey);
    const json = JSON.stringify(Object.fromEntries(fd));

    return fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    }).then(res => res.json());
  });

  Promise.all(sendPromises)
    .then(results => {
      Swal.fire({
        title: 'Succes!',
        text: 'Mesaj trimis cu succes către toți destinatarii!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#555879'
      });
    })
    .catch(error => {
      console.log(error);
      Swal.fire({
        title: 'Oops!',
        text: 'A apărut o eroare la trimiterea mesajului!',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#555879'
      });
    })
    .finally(() => {
      form.reset();
    });
});