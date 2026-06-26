/* survey-shell.jsx
   Nav, progress bar, intro, contact, completion, and error screens
   for the Agent Zoe 2026 Benchmark Survey.
   Depends on: landing-ui.jsx (Wordmark exported to window)
   Exports: SurveyNav, SurveyProgress, SurveyIntro, SurveyContact,
            SurveyComplete, SurveyError, submitSurvey, getUtmParams, getDeviceType */

const { useState } = React;

/* ─── Nav ─────────────────────────────────────────────────────── */

function SurveyNav() {
  return (
    <nav className="survey-nav" aria-label="Site">
      <Wordmark as="a" />
      <a href="/" className="survey-exit" aria-label="Exit survey">
        Exit survey
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </a>
    </nav>
  );
}

/* ─── Progress hairline ───────────────────────────────────────── */

function SurveyProgress({ progress = 0 }) {
  return (
    <div className="survey-progress"
      role="progressbar" aria-valuemin={0} aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="Survey progress">
      <div className="survey-progress__bar"
        style={{ transform: `scaleX(${Math.min(1, Math.max(0, progress))})` }} />
    </div>
  );
}

/* ─── Intro screen ────────────────────────────────────────────── */

function SurveyIntro({ onStart, onResume, hasSaved }) {
  return (
    <div className="survey-intro">
      <h1 className="survey-intro__title">Help us learn about you and your firm.</h1>
      <p className="survey-intro__body">
        We're conducting research with tax and accounting professionals to better understand the operational realities behind running a firm.{'\n\n'}
        No sales pitch. No product demo. Just a few questions about your workflows, tools, and the challenges that consume more time and attention than they should.
      </p>
      <div className="survey-intro__actions">
        <button className="survey-primary-btn" onClick={onStart} type="button">
          Take the Survey
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M2.5 7h9M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {hasSaved && (
          <button className="survey-resume-btn" onClick={onResume} type="button">
            Continue where you left off →
          </button>
        )}
        <p className="survey-intro__meta">~4 minutes · 10 questions</p>
      </div>
    </div>
  );
}

/* ─── Contact / submission screen ────────────────────────────── */

function SurveyContact({ onSubmit }) {
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [firm,       setFirm]       = useState('');
  const [url,        setUrl]        = useState('');
  const [phone,      setPhone]      = useState('');
  const [busy,       setBusy]       = useState(false);
  const [emailError, setEmailError] = useState('');

  const submit = async (skipDetails) => {
    if (!skipDetails && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email, or leave it blank.');
      return;
    }
    setEmailError('');
    setBusy(true);
    await onSubmit(skipDetails ? {} : { name, email, firm_name: firm, firm_url: url, phone });
  };

  return (
    <div className="survey-contact">
      <p className="survey-eyebrow">
        <span className="survey-eyebrow__tick" aria-hidden="true" />
        One last thing
      </p>
      <h2 className="survey-contact__title">Leave your details.</h2>
      <p className="survey-contact__body">
        If you'd like us to follow up or stay in touch, leave your contact
        information below. There's no obligation — your responses are
        recorded either way.
      </p>
      <div className="survey-contact__form">
        <div className="survey-field-row">
          <input className="survey-field" type="text" placeholder="Your name"  value={name}  onChange={(e) => setName(e.target.value)}  disabled={busy} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
            <input className={'survey-field' + (emailError ? ' is-error' : '')} type="text" placeholder="Work email" value={email} onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }} disabled={busy} />
            {emailError && <p style={{ margin: 0, fontSize: 12, color: '#b8743f' }}>{emailError}</p>}
          </div>
        </div>
        <div className="survey-field-row">
          <input className="survey-field" type="text"  placeholder="Firm name"          value={firm}  onChange={(e) => setFirm(e.target.value)}  disabled={busy} />
          <input className="survey-field" type="url"   placeholder="Website (optional)" value={url}   onChange={(e) => setUrl(e.target.value)}   disabled={busy} />
        </div>
        <input className="survey-field" type="tel" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={busy} />
        <div className="survey-contact__actions">
          <button className="survey-primary-btn" type="button"
            onClick={() => submit(false)} disabled={busy}>
            {busy ? 'Submitting…' : (
              <>Send
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M2.5 7h9M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
          <button className="survey-anon-btn" type="button"
            onClick={() => submit(true)} disabled={busy}>
            Submit without details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Completion screen ───────────────────────────────────────── */

function SurveyComplete() {
  return (
    <div className="survey-complete">
      <span className="survey-complete__mark" aria-hidden="true" />
      <h2 className="survey-complete__title">Thank you.</h2>
      <p className="survey-complete__message">
        Your responses have been recorded. If you shared your contact details,
        someone from our team will be in touch.
      </p>
      <a className="survey-complete__link" href="/">
        Return to Agent Zoe →
      </a>
    </div>
  );
}

/* ─── Error screen ────────────────────────────────────────────── */

function SurveyError({ onRetry }) {
  return (
    <div className="survey-error">
      <span className="survey-error__mark" aria-hidden="true">!</span>
      <h2 className="survey-error__title">Submission failed.</h2>
      <p className="survey-error__message">
        Your answers are saved locally. Check your connection and try again —
        your responses won't be lost.
      </p>
      <div className="survey-error__actions">
        <button className="survey-primary-btn" type="button" onClick={onRetry}>
          Try again
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M2.5 7h9M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="survey-error__meta">
          Or email your responses to{' '}
          <a href="mailto:humza@schema52.com" className="survey-error__mailto">humza@schema52.com</a>
        </p>
      </div>
    </div>
  );
}

/* ─── Submission helpers ──────────────────────────────────────── */

function getUtmParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source:   p.get('utm_source')   || '',
    utm_medium:   p.get('utm_medium')   || '',
    utm_campaign: p.get('utm_campaign') || '',
    utm_content:  p.get('utm_content')  || '',
    utm_term:     p.get('utm_term')     || '',
  };
}

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return 'mobile';
  if (/Tablet|iPad/i.test(ua))  return 'tablet';
  return 'desktop';
}

/**
 * POST survey data to the Apps Script endpoint via no-cors + URLSearchParams.
 * no-cors is required because Apps Script doesn't respond to CORS preflight.
 * URLSearchParams is a "simple" content type — no preflight, no response read.
 * Any thrown error (network failure, 8s timeout) is re-thrown for the caller.
 */
async function submitSurvey(payload) {
  const endpoint = (window.SURVEY_CONFIG || {}).endpoint || '';

  if (!endpoint || endpoint.includes('YOUR_DEPLOYMENT_ID')) {
    console.warn('[Survey] No endpoint configured — submission skipped (dev mode).');
    return;
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    params.append(key, value == null ? '' : String(value));
  }

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), 8000);
  try {
    await fetch(endpoint, {
      method: 'POST',
      mode:   'no-cors',
      body:   params,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

Object.assign(window, {
  SurveyNav, SurveyProgress, SurveyIntro, SurveyContact,
  SurveyComplete, SurveyError, submitSurvey, getUtmParams, getDeviceType,
});
