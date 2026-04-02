// firebase-auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

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
const db = getFirestore(app, 'admiterepoli');

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/* ── HTML injectat în DOM ─────────────────────────────────────── */

function injectModal() {
  const overlay = document.createElement('div');
  overlay.id = 'auth-modal-overlay';
  overlay.innerHTML = `
    <div class="auth-modal-card">
      <button class="auth-modal-close" id="auth-close-btn" aria-label="Închide">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <!-- Step 1: Auth (Login / Register) -->
      <div class="auth-step active" id="auth-step-auth">
        <div class="auth-toggle-wrap">
          <div class="auth-toggle" id="auth-toggle">
            <button class="auth-toggle-btn active" data-tab="login">Autentificare</button>
            <button class="auth-toggle-btn" data-tab="register">Înregistrare</button>
            <div class="auth-toggle-slider"></div>
          </div>
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
          <div class="auth-divider"><span>sau</span></div>
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
          <div class="auth-divider"><span>sau</span></div>
          <button class="auth-btn-google" id="btn-register-google">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
            Continuă cu Google
          </button>
        </div>
      </div>

      <!-- Step 2: Plan Selection -->
      <div class="auth-step" id="auth-step-plan">
        <h2 class="plan-title">Alege planul tău</h2>
        <p class="plan-subtitle">Selectează planul care ți se potrivește</p>

        <div class="plan-toggle-wrap">
          <div class="plan-toggle" id="plan-toggle">
            <button class="plan-toggle-btn active" data-billing="monthly">Lunar</button>
            <button class="plan-toggle-btn" data-billing="quarterly">3 Luni</button>
            <div class="plan-toggle-slider"></div>
          </div>
        </div>

        <div class="plan-cards" id="plan-cards">
          <div class="plan-highlight-box" id="plan-highlight-box"></div>

          <div class="plan-card selected" data-plan="standard">
            <div class="plan-card-header">
              <div class="plan-radio"><div class="plan-radio-dot"></div></div>
              <div class="plan-card-info">
                <span class="plan-name">Standard</span>
                <span class="plan-desc">Acces la resursele de bază</span>
              </div>
            </div>
            <div class="plan-price">
              <span class="plan-amount" data-monthly="0" data-quarterly="0">0</span>
              <span class="plan-currency">RON</span>
              <span class="plan-period" data-monthly="/lună" data-quarterly="/3 luni">/lună</span>
            </div>
          </div>

          <div class="plan-card" data-plan="student-plus">
            <div class="plan-card-header">
              <div class="plan-radio"><div class="plan-radio-dot"></div></div>
              <div class="plan-card-info">
                <span class="plan-name">Student Plus</span>
                <span class="plan-badge">Popular</span>
                <span class="plan-desc">Acces complet la toate resursele</span>
              </div>
            </div>
            <div class="plan-price">
              <span class="plan-amount" data-monthly="75" data-quarterly="180">75</span>
              <span class="plan-currency">RON</span>
              <span class="plan-period" data-monthly="/lună" data-quarterly="/3 luni">/lună</span>
            </div>
          </div>
        </div>

        <button class="auth-btn-primary" id="btn-select-plan">Începe acum</button>
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
    <button class="nav-auth-pill" id="nav-auth-trigger">Înregistrează-te</button>
    <div class="auth-user-dropdown" id="auth-user-dropdown">
      <div class="auth-email" id="auth-user-email"></div>
      <a href="./profil" class="auth-dropdown-link" id="btn-profile">Profilul meu</a>
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

function injectMobileAuthItem() {
  const navElements = document.querySelector('.nav-elements');
  if (!navElements) return;
  const li = document.createElement('li');
  li.id = 'nav-auth-mobile-li';
  li.innerHTML = `
    <button class="nav-auth-mobile-btn" id="nav-auth-mobile-btn">Înregistrează-te</button>
    <div class="nav-auth-mobile-user" id="nav-auth-mobile-user">
      <span class="nav-auth-mobile-email" id="nav-auth-mobile-email"></span>
      <a href="./profil" class="nav-auth-mobile-profile">Profilul meu</a>
      <button class="nav-auth-mobile-logout" id="btn-logout-mobile">Deconectare</button>
    </div>
  `;
  navElements.appendChild(li);
}


function openGumroadCheckout(url) {
  window.open(url, '_blank', 'noopener');
}

function closeHamburger() {
  document.querySelector('.hamburger')?.classList.remove('active');
  document.querySelector('.nav-elements')?.classList.remove('active');
}

/* ── Helpers UI ──────────────────────────────────────────────── */

function showError(panelId, message) {
  const el = document.getElementById(`auth-error-${panelId}`);
  if (!el) return;
  el.textContent = message;
  el.style.color = '';
  el.style.borderColor = '';
  el.classList.add('visible');
}

function showSuccess(panelId, message) {
  const el = document.getElementById(`auth-error-${panelId}`);
  if (!el) return;
  el.textContent = message;
  el.style.color = 'var(--accent3, #4db6ac)';
  el.style.borderColor = 'var(--accent3, #4db6ac)';
  el.classList.add('visible');
}

function clearError(panelId) {
  const el = document.getElementById(`auth-error-${panelId}`);
  if (!el) return;
  el.classList.remove('visible');
  el.style.color = '';
  el.style.borderColor = '';
}

function openModal() {
  const newsletterPopup = document.getElementById('newsletter-popup');
  if (newsletterPopup && newsletterPopup.classList.contains('active')) {
    newsletterPopup.classList.remove('active');
    setTimeout(() => { newsletterPopup.style.display = 'none'; }, 300);
  }
  showStep('auth');
  document.getElementById('auth-modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('auth-modal-overlay').classList.remove('open');
  clearError('login');
  clearError('register');
}

function showStep(step) {
  document.querySelectorAll('.auth-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`auth-step-${step}`).classList.add('active');
  if (step === 'plan') {
    requestAnimationFrame(() => requestAnimationFrame(updatePlanHighlight));
  }
}

function friendlyError(code) {
  const map = {
    'auth/invalid-email':           'Adresă de email invalidă.',
    'auth/invalid-credential':      'Email sau parolă incorectă.',
    'auth/email-already-in-use':    'Există deja un cont cu acest email.',
    'auth/weak-password':           'Parola trebuie să aibă minim 6 caractere.',
    'auth/popup-closed-by-user':    'Fereastra Google a fost închisă.',
    'auth/popup-blocked':           'Popup-ul a fost blocat de browser. Activează popup-urile pentru acest site.',
    'auth/too-many-requests':       'Prea multe încercări. Încearcă mai târziu.',
    'auth/network-request-failed':  'Eroare de rețea. Verifică conexiunea la internet.',
    'auth/unauthorized-domain':     'Domeniul curent nu este autorizat. Adaugă-l în Firebase Console → Authentication → Settings → Authorized domains.',
    'auth/operation-not-allowed':   'Autentificarea cu Google nu este activată. Activează-o în Firebase Console → Authentication → Sign-in method.',
    'auth/cancelled-popup-request': 'Cerere anulată. Încearcă din nou.',
    'auth/account-exists-with-different-credential': 'Există deja un cont cu acest email, conectat printr-o altă metodă.',
    'auth/user-disabled':           'Acest cont a fost dezactivat.',
    'auth/user-not-found':          'Nu există niciun cont cu acest email.',
    'auth/wrong-password':          'Parolă incorectă.',
    'auth/internal-error':          'Eroare internă Firebase. Încearcă din nou.',
  };
  return map[code] || `A apărut o eroare (${code || 'necunoscută'}). Încearcă din nou.`;
}

/* ── Sincronizare utilizator cu Firestore ───────────────────── */

async function syncUserToFirestore(user, plan, billing) {
  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        status: 'free',
        selectedPlan: plan || 'standard',
        selectedBilling: billing || 'monthly',
        createdAt: new Date()
      });
      console.log('[Auth] Firestore: document creat pentru', user.uid);
    } else {
      console.log('[Auth] Firestore: document deja existent pentru', user.uid);
    }
  } catch (e) {
    console.error('[Auth] Firestore sync error:', e.code, e.message, e);
    throw e;
  }
}

/* ── Salvare rezultat simulare în Firestore ──────────────────── */

async function saveSimulationResult(simulationId, data) {
  const user = auth.currentUser;
  if (!user) return; // utilizator neautentificat — silent fail
  try {
    const resultRef = doc(db, 'users', user.uid, 'simulationResults', simulationId);
    await setDoc(resultRef, {
      simulationId,
      title: data.title,
      scoreTotal: data.scoreTotal,
      scoreInfo: data.scoreInfo,
      scoreMate: data.scoreMate,
      completedAt: serverTimestamp(),
      timeElapsed: data.timeElapsed
    }, { merge: true });
    console.log('[Profile] Rezultat salvat pentru', simulationId);
  } catch (e) {
    console.error('[Profile] Eroare salvare rezultat:', e);
  }
}

window.saveSimulationResult = saveSimulationResult;

/* ── Google Sign-In (popup pe desktop, redirect pe mobile) ───── */

async function googleSignIn() {
  if (isMobile()) {
    await signInWithRedirect(auth, googleProvider);
    return;
  }
  const result = await signInWithPopup(auth, googleProvider);
  const isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? true;
  if (isNewUser) {
    showStep('plan');
  } else {
    closeModal();
  }
}

/* ── Plan picker helpers ────────────────────────────────────── */

let currentBilling = 'monthly';

function updatePlanHighlight() {
  const cards = document.getElementById('plan-cards');
  const selected = cards?.querySelector('.plan-card.selected');
  const box = document.getElementById('plan-highlight-box');
  if (!selected || !box || !cards) return;

  const cardsRect = cards.getBoundingClientRect();
  const cardRect = selected.getBoundingClientRect();
  box.style.transform = `translateY(${cardRect.top - cardsRect.top}px)`;
  box.style.height = `${cardRect.height}px`;
}

function updatePlanPrices() {
  document.querySelectorAll('.plan-amount').forEach(el => {
    const value = el.getAttribute(`data-${currentBilling}`);
    animateNumber(el, parseInt(el.textContent), parseInt(value));
  });
  document.querySelectorAll('.plan-period').forEach(el => {
    el.textContent = el.getAttribute(`data-${currentBilling}`);
  });
}

function animateNumber(el, from, to) {
  if (from === to) return;
  const duration = 400;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ── Actualizează navbar după schimbarea stării auth ─────────── */

function updateNavButton(user) {
  const trigger = document.getElementById('nav-auth-trigger');
  const dropdown = document.getElementById('auth-user-dropdown');
  const emailEl = document.getElementById('auth-user-email');
  if (trigger) {
    if (user) {
      const displayName = (user.displayName || '').trim();
      const initials = displayName
        ? displayName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : (user.email || '?')[0].toUpperCase();
      trigger.textContent = initials;
      trigger.classList.add('auth-logged-in');
      if (emailEl) emailEl.textContent = user.email;
    } else {
      trigger.textContent = 'Înregistrează-te';
      trigger.classList.remove('auth-logged-in');
      if (dropdown) dropdown.classList.remove('open');
    }
  }

  const mobileBtn = document.getElementById('nav-auth-mobile-btn');
  const mobileUser = document.getElementById('nav-auth-mobile-user');
  const mobileEmail = document.getElementById('nav-auth-mobile-email');
  if (mobileBtn) mobileBtn.style.display = user ? 'none' : '';
  if (mobileUser) mobileUser.style.display = user ? 'flex' : 'none';
  if (mobileEmail) mobileEmail.textContent = user ? (user.displayName || user.email) : '';
}

/* ── Inițializare ────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  injectNavButton();
  injectMobileAuthItem();
  injectModal();

  const overlay = document.getElementById('auth-modal-overlay');
  const trigger = document.getElementById('nav-auth-trigger');
  const dropdown = document.getElementById('auth-user-dropdown');
  const wrapper = document.getElementById('nav-auth-wrapper');

  if (!trigger || !overlay) return;

  // Redirect result (mobile Google sign-in)
  getRedirectResult(auth).then(result => {
    if (result && result.user) {
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? true;
      if (isNewUser) {
        openModal();
        showStep('plan');
      }
    }
  }).catch(e => {
    if (e.code && e.code !== 'auth/popup-closed-by-user') {
      openModal();
      showError('login', friendlyError(e.code));
    }
  });

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

  /* ── Auth toggle (Login / Register) cu slider animat ────────── */
  document.querySelectorAll('.auth-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      clearError('login');
      clearError('register');
      document.querySelectorAll('.auth-toggle-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`auth-panel-${btn.dataset.tab}`).classList.add('active');

      const toggle = document.getElementById('auth-toggle');
      const slider = toggle.querySelector('.auth-toggle-slider');
      const idx = btn.dataset.tab === 'register' ? 1 : 0;
      slider.style.transform = `translateX(${idx * 100}%)`;
    });
  });

  /* ── Plan billing toggle (Lunar / 3 Luni) ──────────────────── */
  document.querySelectorAll('.plan-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      document.querySelectorAll('.plan-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBilling = btn.dataset.billing;

      const toggle = document.getElementById('plan-toggle');
      const slider = toggle.querySelector('.plan-toggle-slider');
      const idx = btn.dataset.billing === 'quarterly' ? 1 : 0;
      slider.style.transform = `translateX(${idx * 100}%)`;

      updatePlanPrices();
    });
  });

  /* ── Plan card selection ───────────────────────────────────── */
  document.querySelectorAll('.plan-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      updatePlanHighlight();
    });
  });

  // Enter pe câmpurile de login/register
  ['login-email', 'login-password'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('btn-login-email').click();
    });
  });
  ['register-email', 'register-password'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('btn-register-email').click();
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
      await googleSignIn();
    } catch (e) {
      console.error('[Auth] Google login error:', e.code, e.message);
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
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(user);
      showStep('plan');
    } catch (e) {
      showError('register', friendlyError(e.code));
    } finally {
      btn.disabled = false;
    }
  });

  // Register Google (același flux ca login)
  document.getElementById('btn-register-google').addEventListener('click', async () => {
    clearError('register');
    const btn = document.getElementById('btn-register-google');
    btn.disabled = true;
    try {
      await googleSignIn();
    } catch (e) {
      console.error('[Auth] Google register error:', e.code, e.message);
      if (e.code !== 'auth/popup-closed-by-user') {
        showError('register', friendlyError(e.code));
      }
    } finally {
      btn.disabled = false;
    }
  });

  /* ── Plan selection confirm ────────────────────────────────── */
  document.getElementById('btn-select-plan').addEventListener('click', async () => {
    const selected = document.querySelector('.plan-card.selected');
    const plan = selected ? selected.dataset.plan : 'standard';
    const billing = currentBilling;
    const btn = document.getElementById('btn-select-plan');
    btn.disabled = true;

    const user = auth.currentUser;
    if (user) {
      try {
        await syncUserToFirestore(user, plan, billing);
      } catch (e) {
        console.error('[Auth] Nu s-a putut salva în Firestore:', e.code, e.message);
      }
    } else {
      console.warn('[Auth] auth.currentUser este null la selectarea planului');
    }

    btn.disabled = false;
    closeModal();

    if (plan === 'student-plus' && user) {
      const gumroadUrls = {
        monthly:   `https://admiterepoli.gumroad.com/l/student-plus-lunar?wanted=true&email=${encodeURIComponent(user.email)}`,
        quarterly: `https://admiterepoli.gumroad.com/l/student-plus?wanted=true&email=${encodeURIComponent(user.email)}`
      };
      openGumroadCheckout(gumroadUrls[billing] || gumroadUrls.monthly);
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

  // Mobile menu — Contul meu
  document.getElementById('nav-auth-mobile-btn')?.addEventListener('click', () => {
    closeHamburger();
    openModal();
  });

  // Mobile menu — Deconectare
  document.getElementById('btn-logout-mobile')?.addEventListener('click', async () => {
    closeHamburger();
    try {
      await signOut(auth);
    } catch (e) {
      console.error('[Auth] signOut error:', e);
    }
  });

  // Listener stare auth
  onAuthStateChanged(auth, updateNavButton);
});
