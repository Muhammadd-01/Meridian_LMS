/**
 * Simulated authentication. Credentials are compared in the browser against demo
 * records — there is no password hashing, no server and no real security here.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value = '') {
  return EMAIL_RE.test(value.trim())
}

export function validateCredentials({ email, password }) {
  const errors = {}
  if (!email?.trim()) errors.email = 'Email is required.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Password is required.'
  return errors
}

export function passwordIssues(password = '') {
  const issues = []
  if (password.length < 8) issues.push('at least 8 characters')
  if (!/[A-Z]/.test(password)) issues.push('an uppercase letter')
  if (!/[0-9]/.test(password)) issues.push('a number')
  return issues
}

export function authenticate(users, { email, password }) {
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  if (!user || !user.demoPassword || user.demoPassword !== password) {
    return { ok: false, error: 'That email and password combination doesn’t match a demo account. Try the quick-fill buttons below.' }
  }
  if (user.status === 'suspended') {
    return { ok: false, error: 'This demo account has been suspended by an administrator.' }
  }
  return { ok: true, user }
}

export function homeForRole(role) {
  return role === 'admin' ? '/admin/dashboard' : '/learn/dashboard'
}
