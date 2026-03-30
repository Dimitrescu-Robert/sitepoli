// firebase-auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAml8nJ8UOh9wrIhI6f-3K6-tOaPYLz_c4",
  authDomain: "admiterepoli-715cb.firebaseapp.com",
  projectId: "admiterepoli-715cb",
  storageBucket: "admiterepoli-715cb.firebasestorage.app",
  messagingSenderId: "91434186818",
  appId: "1:91434186818:web:1617d5a2d53b2fea2a95db",
  measurementId: "G-CQJCR937EB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/* ── HTML injectat în DOM ─────────────────────────────────────── */

function injectModal() {
  const overlay = document.createElement('div');
  overlay.id = 'auth-modal-overlay';
  overlay.innerHTML = `
    <div class="auth-modal-card">
      <button class="auth-modal-close" id="auth-close-btn" aria-label="Închide">&times;</button>
      <div class="auth-tabs">
        <button class="auth-tab active" data-tab="login">Autentificare</button>
        <button class="auth-tab" data-tab="register">Înregistrare</button>
      </div>

      <!-- Tab Login -->
      <div class="auth-panel active" id="auth-panel-login">
        <div class="auth-error" id="auth-error-login"></div>
        <div class="auth-field">
          <label for="login-email">Email</label>
          <input type="email" id="login-email" placeholder="email@exemplu.com" autocomplete="email">
        </div>
        <div class="auth-field">
          <label for="login-password">Parolă</label>
          <input type="password" id="login-password" placeholder="••••••••" autocomplete="current-password">
        </div>
        <button class="auth-btn-primary" id="btn-login-email">Autentifică-te</button>
        <div class="auth-divider">sau</div>
        <button class="auth-btn-google" id="btn-login-google">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
          Continuă cu Google
        </button>
      </div>

      <!-- Tab Register -->
      <div class="auth-panel" id="auth-panel-register">
        <div class="auth-error" id="auth-error-register"></div>
        <div class="auth-field">
          <label for="register-email">Email</label>
          <input type="email" id="register-email" placeholder="email@exemplu.com" autocomplete="email">
        </div>
        <div class="auth-field">
          <label for="register-password">Parolă</label>
          <input type="password" id="register-password" placeholder="Minim 6 caractere" autocomplete="new-password">
        </div>
        <button class="auth-btn-primary" id="btn-register-email">Creează cont</button>
        <div class="auth-divider">sau</div>
        <button class="auth-btn-google" id="btn-register-google">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
          Continuă cu Google
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function injectNavButton() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'nav-auth-wrapper';
  wrapper.innerHTML = `
    <button class="nav-auth-pill" id="nav-auth-trigger">Contul meu</button>
    <div class="auth-user-dropdown" id="auth-user-dropdown">
      <div class="auth-email" id="auth-user-email"></div>
      <button id="btn-logout">Deconectare</button>
    </div>
  `;

  const hamburger = nav.querySelector('.hamburger');
  if (hamburger) {
    nav.insertBefore(wrapper, hamburger);
  } else {
    nav.appendChild(wrapper);
  }
}

/* ── Helpers UI ──────────────────────────────────────────────── */

function showError(panelId, message) {
  const el = document.getElementById(`auth-error-${panelId}`);
  if (!el) return;
  el.textContent = message;
  el.classList.add('visible');
}

function clearError(panelId) {
  const el = document.getElementById(`auth-error-${panelId}`);
  if (el) el.classList.remove('visible');
}

function openModal() {
  document.getElementById('auth-modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('auth-modal-overlay').classList.remove('open');
  clearError('login');
  clearError('register');
}

function friendlyError(code) {
  const map = {
    'auth/invalid-email': 'Adresă de email invalidă.',
    'auth/user-not-found': 'Nu există cont cu acest email.',
    'auth/wrong-password': 'Parolă incorectă.',
    'auth/email-already-in-use': 'Există deja un cont cu acest email.',
    'auth/weak-password': 'Parola trebuie să aibă minim 6 caractere.',
    'auth/popup-closed-by-user': 'Fereastra Google a fost închisă.',
    'auth/invalid-credential': 'Email sau parolă incorectă.',
    'auth/too-many-requests': 'Prea multe încercări. Încearcă mai târziu.',
  };
  return map[code] || 'A apărut o eroare. Încearcă din nou.';
}

/* ── Actualizează navbar după schimbarea stării auth ─────────── */

function updateNavButton(user) {
  const trigger = document.getElementById('nav-auth-trigger');
  const dropdown = document.getElementById('auth-user-dropdown');
  const emailEl = document.getElementById('auth-user-email');
  if (!trigger) return;

  if (user) {
    const displayName = (user.displayName || '').trim();
    const initials = displayName
      ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : (user.email || '?')[0].toUpperCase();
    trigger.textContent = initials;
    trigger.classList.add('auth-logged-in');
    if (emailEl) emailEl.textContent = user.email;
  } else {
    trigger.textContent = 'Contul meu';
    trigger.classList.remove('auth-logged-in');
    if (dropdown) dropdown.classList.remove('open');
  }
}

/* ── Inițializare ────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  injectNavButton();
  injectModal();

  const overlay = document.getElementById('auth-modal-overlay');
  const trigger = document.getElementById('nav-auth-trigger');
  const dropdown = document.getElementById('auth-user-dropdown');
  const wrapper = document.getElementById('nav-auth-wrapper');

  if (!trigger || !overlay) return;

  // Deschide modal sau dropdown
  trigger.addEventListener('click', () => {
    if (auth.currentUser) {
      dropdown.classList.toggle('open');
    } else {
      openModal();
    }
  });

  // Închide dropdown la click în afară
  document.addEventListener('click', (e) => {
    if (dropdown && wrapper && !wrapper.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // Închide modal
  document.getElementById('auth-close-btn').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  // Tab-uri
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`auth-panel-${tab.dataset.tab}`).classList.add('active');
    });
  });

  // Login email/parolă
  document.getElementById('btn-login-email').addEventListener('click', async () => {
    clearError('login');
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (!email || !password) { showError('login', 'Completează email-ul și parola.'); return; }
    const btn = document.getElementById('btn-login-email');
    btn.disabled = true;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      closeModal();
    } catch (e) {
      showError('login', friendlyError(e.code));
    } finally {
      btn.disabled = false;
    }
  });

  // Login Google
  document.getElementById('btn-login-google').addEventListener('click', async () => {
    clearError('login');
    const btn = document.getElementById('btn-login-google');
    btn.disabled = true;
    try {
      await signInWithPopup(auth, googleProvider);
      closeModal();
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') {
        showError('login', friendlyError(e.code));
      }
    } finally {
      btn.disabled = false;
    }
  });

  // Register email/parolă
  document.getElementById('btn-register-email').addEventListener('click', async () => {
    clearError('register');
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    if (!email || !password) { showError('register', 'Completează email-ul și parola.'); return; }
    const btn = document.getElementById('btn-register-email');
    btn.disabled = true;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      closeModal();
    } catch (e) {
      showError('register', friendlyError(e.code));
    } finally {
      btn.disabled = false;
    }
  });

  // Register Google (același popup)
  document.getElementById('btn-register-google').addEventListener('click', async () => {
    clearError('register');
    const btn = document.getElementById('btn-register-google');
    btn.disabled = true;
    try {
      await signInWithPopup(auth, googleProvider);
      closeModal();
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') {
        showError('register', friendlyError(e.code));
      }
    } finally {
      btn.disabled = false;
    }
  });

  // Logout
  document.getElementById('btn-logout').addEventListener('click', async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('[Auth] signOut error:', e);
    } finally {
      dropdown.classList.remove('open');
    }
  });

  // Listener stare auth
  onAuthStateChanged(auth, updateNavButton);
});
