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