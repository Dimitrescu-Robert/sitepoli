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