// profile.js
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAml8nJ8UOh9wrIhI6f-3K6-tOaPYLz_c4",
  authDomain: "admiterepoli-715cb.firebaseapp.com",
  projectId: "admiterepoli-715cb",
  storageBucket: "admiterepoli-715cb.firebasestorage.app",
  messagingSenderId: "91434186818",
  appId: "1:91434186818:web:1617d5a2d53b2fea2a95db",
  measurementId: "G-CQJCR937EB"
};

// Refolosim app-ul Firebase dacă a fost deja inițializat de firebase-auth.js
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, 'admiterepoli');

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = './';
    return;
  }
  // Dacă userul vine înapoi de pe Gumroad, așteptăm 3s să proceseze webhookul, apoi reîncărcăm
  const params = new URLSearchParams(window.location.search);
  if (params.has('upgraded')) {
    history.replaceState(null, '', window.location.pathname);
    setTimeout(() => initProfilePage(user), 3000);
  } else {
    initProfilePage(user);
  }
});

async function initProfilePage(user) {
  const emailHeader = document.getElementById('profile-email-header');
  if (emailHeader) emailHeader.textContent = user.email;

  const isEmailProvider = user.providerData.some(p => p.providerId === 'password');
  if (isEmailProvider && !user.emailVerified) {
    renderVerifyBanner(user);
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    const userData = snap.exists() ? snap.data() : {};
    renderAccountSection(user, userData);
    renderPlanSection(user, userData);
    await renderResultsSection(user);
  } catch (e) {
    console.error('[Profile] Eroare inițializare profil:', e);
  }
}

function renderVerifyBanner(user) {
  const card = document.getElementById('profile-account-card');
  if (!card) return;

  const banner = document.createElement('div');
  banner.className = 'profile-verify-banner';
  banner.innerHTML = `
    <p>Emailul tău nu a fost verificat. Verifică inbox-ul sau spam-ul.</p>
    <button class="profile-verify-resend" id="btn-resend-verify">Retrimite emailul</button>
  `;
  card.insertBefore(banner, card.firstChild);

  document.getElementById('btn-resend-verify').addEventListener('click', async function () {
    const btn = this;
    btn.disabled = true;
    btn.textContent = 'Se trimite...';
    try {
      await sendEmailVerification(user);
      btn.textContent = 'Trimis!';
    } catch (e) {
      btn.textContent = 'Eroare — încearcă din nou';
      btn.disabled = false;
    }
  });
}

function renderAccountSection(user, userData) {
  // Email
  const emailDisplay = document.getElementById('profile-email-display');
  if (emailDisplay) emailDisplay.textContent = user.email;

  // Nume afișat
  const nameInput = document.getElementById('profile-name-input');
  if (nameInput && userData.displayName) nameInput.value = userData.displayName;

  // Buton salvare nume
  const btnSaveName = document.getElementById('btn-save-name');
  const nameFeedback = document.getElementById('name-feedback');
  if (btnSaveName) {
    btnSaveName.addEventListener('click', async () => {
      if (!nameInput || !nameFeedback) return;
      const name = nameInput.value.trim();
      if (!name) {
        nameFeedback.textContent = 'Introdu un nume valid.';
        nameFeedback.className = 'profile-feedback error';
        return;
      }
      btnSaveName.disabled = true;
      try {
        const userRef = doc(db, 'users', user.uid);
<<<<<<< HEAD
        await setDoc(userRef, { displayName: name }, { merge: true });
=======
        await Promise.all([
          updateDoc(userRef, { displayName: name }),
          updateProfile(user, { displayName: name })
        ]);
>>>>>>> cface739bbd249c8d7c936b5afda9492d10a79ad
        nameFeedback.textContent = 'Nume salvat cu succes!';
        nameFeedback.className = 'profile-feedback success';

        // Actualizează inițialele în navbar fără reload
        const initials = name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const navTrigger = document.getElementById('nav-auth-trigger');
        if (navTrigger) navTrigger.textContent = initials;
      } catch (e) {
        nameFeedback.textContent = 'Eroare la salvare. Încearcă din nou.';
        nameFeedback.className = 'profile-feedback error';
      } finally {
        btnSaveName.disabled = false;
      }
    });
  }

  // Secțiunea parolă
  const passwordSection = document.getElementById('profile-password-section');
  if (!passwordSection) return;

  const isGoogle = user.providerData.some(p => p.providerId === 'google.com');
  if (isGoogle) {
    passwordSection.innerHTML = `
      <label class="profile-label">Parolă</label>
      <p class="profile-value profile-muted">Contul tău este conectat prin Google. Parola este gestionată de Google.</p>
    `;
  } else {
    passwordSection.innerHTML = `
      <label class="profile-label">Parolă</label>
      <button class="profile-btn-secondary" id="btn-reset-password">Trimite email de resetare parolă</button>
      <p class="profile-feedback" id="password-feedback"></p>
    `;
    document.getElementById('btn-reset-password').addEventListener('click', async () => {
      const btn = document.getElementById('btn-reset-password');
      const feedback = document.getElementById('password-feedback');
      btn.disabled = true;
      try {
        await sendPasswordResetEmail(auth, user.email);
        feedback.textContent = `Email trimis la ${user.email}. Verifică-ți inbox-ul.`;
        feedback.className = 'profile-feedback success';
      } catch (e) {
        feedback.textContent = 'Eroare la trimiterea emailului. Încearcă din nou.';
        feedback.className = 'profile-feedback error';
      } finally {
        btn.disabled = false;
      }
    });
  }
}

function renderPlanSection(user, userData) {
  const container = document.getElementById('profile-plan-content');
  if (!container) return;

  const isPaid = userData.status === 'paid';
  const planName = isPaid ? 'Student Plus' : 'Standard';

  const standardBenefits = [
    'Acces la toate subiectele și rezolvările',
    'Simulări gratuite cu autocorectare',
    'Rezultate salvate în profil'
  ];
  const plusBenefits = [
    'Tot ce include Standard',
    'Acces la toate resursele premium',
    'Suport prioritar'
  ];

  const cancelSection = isPaid ? `
    <div class="profile-cancel-section">
      <p class="profile-label">Anulare abonament</p>
      <p class="profile-muted">
        Folosește linkul <strong style="color:var(--text)">"Manage subscription"</strong> din emailul de confirmare primit la cumpărare.
        Pentru refund în primele 14 zile, scrie-ne la <a class="profile-cancel-link" href="mailto:admiterepoli@gmail.com">admiterepoli@gmail.com</a>.
      </p>
    </div>
  ` : '';

  const upgradeSection = isPaid ? '' : `
    <div class="plan-toggle-wrap" style="margin-top:1rem">
      <div class="plan-toggle" id="profile-billing-toggle">
        <button class="plan-toggle-btn active" data-billing="monthly">Lunar · 75 RON</button>
        <button class="plan-toggle-btn" data-billing="quarterly">3 Luni · 180 RON</button>
        <div class="plan-toggle-slider"></div>
      </div>
    </div>
    <button class="profile-btn-upgrade" id="btn-upgrade-plan">Upgrade la Student Plus</button>
  `;

  container.innerHTML = `
    <div class="profile-plan-current">
      Planul tău actual: <strong>${planName}</strong>
      ${isPaid ? '<span class="profile-plan-badge">Activ</span>' : ''}
    </div>
    <div class="profile-plan-compare">
      <div class="profile-plan-col ${!isPaid ? 'plan-col-active' : ''}">
        <div class="profile-plan-col-name">Standard</div>
        <div class="profile-plan-col-price">Gratuit</div>
        <ul class="profile-plan-benefits">
          ${standardBenefits.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
      <div class="profile-plan-col ${isPaid ? 'plan-col-active' : ''}">
        <div class="profile-plan-col-name">Student Plus</div>
        <div class="profile-plan-col-price" id="profile-plus-price">75 RON / lună</div>
        <ul class="profile-plan-benefits">
          ${plusBenefits.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    </div>
    ${upgradeSection}
    ${cancelSection}
  `;


  if (!isPaid) {
    let billing = 'monthly';

    const gumroadUrls = {
      monthly:   `https://admiterepoli.gumroad.com/l/student-plus-lunar?wanted=true&email=${encodeURIComponent(user.email)}`,
      quarterly: `https://admiterepoli.gumroad.com/l/student-plus?wanted=true&email=${encodeURIComponent(user.email)}`
    };

    const priceLabels = {
      monthly:   '75 RON / lună',
      quarterly: '180 RON / 3 luni'
    };

    document.querySelectorAll('#profile-billing-toggle .plan-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.billing === billing) return;
        document.querySelectorAll('#profile-billing-toggle .plan-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        billing = btn.dataset.billing;

        const slider = document.querySelector('#profile-billing-toggle .plan-toggle-slider');
        slider.style.transform = billing === 'quarterly' ? 'translateX(100%)' : 'translateX(0)';

        document.getElementById('profile-plus-price').textContent = priceLabels[billing];
      });
    });

    document.getElementById('btn-upgrade-plan').addEventListener('click', () => {
      window.open(gumroadUrls[billing], '_blank', 'noopener,noreferrer');
    });
  }
}

async function renderResultsSection(user) {
  const container = document.getElementById('profile-results-content');
  if (!container) return;

  try {
    const resultsRef = collection(db, 'users', user.uid, 'simulationResults');
    const snap = await getDocs(resultsRef);

    if (snap.empty) {
      container.innerHTML = `
        <p class="profile-empty">Nu ai completat nicio simulare încă.</p>
        <a href="./simulari" class="profile-btn-primary profile-btn-inline">Mergi la Simulări</a>
      `;
      return;
    }

<<<<<<< HEAD
=======
    // Sortăm descrescător după completedAt client-side (evităm nevoia de index Firestore)
>>>>>>> cface739bbd249c8d7c936b5afda9492d10a79ad
    const sortedDocs = snap.docs.slice().sort((a, b) => {
      const ta = a.data().completedAt?.toMillis?.() ?? 0;
      const tb = b.data().completedAt?.toMillis?.() ?? 0;
      return tb - ta;
    });

<<<<<<< HEAD
    const cards = sortedDocs.map(d => {
=======
    const PAGE_SIZE = 5;
    const allCards = sortedDocs.map(d => {
>>>>>>> cface739bbd249c8d7c936b5afda9492d10a79ad
      const r = d.data();
      const date = r.completedAt?.toDate
        ? r.completedAt.toDate().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—';
      const infoPct = (r.scoreInfo / 10) * 100;
      const matePct = (r.scoreMate / 10) * 100;
      const badge = getBadge(r.scoreTotal);

      return `
        <div class="profile-result-card">
          <div class="profile-result-header">
            <div>
              <div class="profile-result-title">${r.title || r.simulationId}</div>
              <div class="profile-result-date">${date}</div>
            </div>
            <span class="profile-result-badge ${badge.cls}">${badge.text}</span>
          </div>
          <div class="profile-result-score">${r.scoreTotal} / 20</div>
          <div class="profile-result-sections">
            <div class="profile-result-section">
              <div class="profile-result-section-label">
                <span>Informatică</span><span>${r.scoreInfo} / 10</span>
              </div>
              <div class="profile-result-bar">
                <div class="profile-result-bar-fill bar-info" style="width:${infoPct}%"></div>
              </div>
            </div>
            <div class="profile-result-section">
              <div class="profile-result-section-label">
                <span>Matematică</span><span>${r.scoreMate} / 10</span>
              </div>
              <div class="profile-result-bar">
                <div class="profile-result-bar-fill bar-mate" style="width:${matePct}%"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    const renderCards = (count) => {
      const visible = allCards.slice(0, count).join('');
      const remaining = allCards.length - count;
      const showMoreBtn = remaining > 0
        ? `<button class="profile-btn-secondary profile-show-more" id="btn-show-more">Arată mai multe (${remaining})</button>`
        : '';
      container.innerHTML = visible + showMoreBtn;
      if (remaining > 0) {
        document.getElementById('btn-show-more').addEventListener('click', () => {
          renderCards(count + PAGE_SIZE);
        });
      }
    };

    renderCards(PAGE_SIZE);
  } catch (e) {
    console.error('[Profile] Eroare încărcare rezultate:', e);
    container.innerHTML = `<p class="profile-empty">Eroare la încărcarea rezultatelor.</p>`;
  }
}

function getBadge(score) {
  if (score >= 16) return { text: 'Excelent', cls: 'badge-excellent' };
  if (score >= 11) return { text: 'Bine', cls: 'badge-good' };
  if (score >= 6)  return { text: 'Suficient', cls: 'badge-ok' };
  return { text: 'Insuficient', cls: 'badge-fail' };
}
