/* survey-questions.jsx
   Question definitions and per-type answer UI components for the
   Agent Zoe 2026 Tax Firm Operations Benchmark Survey.
   Exports: SURVEY_SECTIONS, SURVEY_QUESTIONS, QuestionBody */

/* ─── Section & Question Data ─────────────────────────────────── */

const SURVEY_SECTIONS = [
  { id: 'profile',    label: 'Firm Profile'       },
  { id: 'operations', label: 'Operational Reality' },
  { id: 'tools',      label: 'Current Tools'       },
  { id: 'forward',    label: 'Forward Look'         },
];

const SURVEY_QUESTIONS = [
  /* 01 */ {
    id: 'firm_size', section: 'profile', type: 'single',
    text: 'How large is your firm?',
    options: ['Solo', '2–10 people', '11–25 people', '26–50 people', '50+ people'],
  },
  /* 02 */ {
    id: 'returns_filed', section: 'profile', type: 'single',
    text: 'How many returns does your firm file each year?',
    hint: 'Helps us understand capacity and opportunity cost.',
    options: ['Fewer than 100', '100–500', '500–1,000', '1,000+'],
  },
  /* 03 */ {
    id: 'client_mix', section: 'profile', type: 'multi',
    text: 'What is your primary client mix?',
    hint: 'Select all that apply.',
    options: ['Individual / W-2', 'Small business', 'Partnerships', 'Corporate', 'Other'],
  },
  /* 04 */ {
    id: 'time_loss', section: 'operations', type: 'multi',
    text: 'Where does your team lose the most time?',
    hint: 'Select all that apply.',
    context: 'We\'re mapping where operational drag is most common — what actually consumes time that could be spent on higher-value work.',
    columns: 2,
    options: [
      'Client follow-up', 'Document collection',
      'Intake & questionnaires', 'Client communication',
      'Scheduling', 'Workflow visibility',
      'Internal coordination', 'Status updates',
      'Review & filing', 'Other',
    ],
  },
  /* 05 */ {
    id: 'pain_rating', section: 'operations', type: 'rating',
    text: 'Rate the friction your firm experiences today.',
    hint: '1 = Little to no friction  ·  5 = Significant friction',
    rows: [
      'Client communication',
      'Document collection',
      'Client responsiveness',
      'Workflow visibility',
    ],
  },
  /* 06 */ {
    id: 'magic_wand', section: 'operations', type: 'single',
    text: 'If you could fix one thing about your client workflow right now, what would it be?',
    options: [
      'Chasing clients for responses',
      'Collecting documents faster',
      'Faster client turnaround',
      'Clearer workflow visibility',
      'Reducing admin overhead',
      'Other',
    ],
  },
  /* 07 */ {
    id: 'tools_used', section: 'tools', type: 'multi',
    text: 'Which practice management tools does your firm currently use?',
    hint: 'Select all that apply.',
    context: 'Helps us understand your current technology ecosystem and where the gaps tend to be.',
    columns: 2,
    options: [
      'TaxDome', 'Canopy', 'Karbon', 'Liscio',
      'Financial Cents', 'SafeSend', 'CCH',
      'Thomson Reuters', 'Other', 'None',
    ],
  },
  /* 08 */ {
    id: 'tool_nps', section: 'tools', type: 'single',
    text: 'Would you recommend your current practice management tools to another firm?',
    options: ['Definitely yes', 'Probably yes', 'Probably not', 'Definitely not'],
  },
  /* 09 */ {
    id: 'tool_frustrations', section: 'tools', type: 'multi',
    text: 'What frustrates you most about your current tools?',
    hint: 'Select up to three.',
    context: 'We\'re looking for patterns in what current tools consistently fail to deliver.',
    maxSelect: 3,
    options: [
      'Too much manual follow-up',
      "Clients don't use the portal",
      'Too many disconnected systems',
      'Poor workflow visibility',
      'Weak automation',
      'Poor client experience',
      'Too expensive',
    ],
  },
  /* 10 */ {
    id: 'ai_openness', section: 'forward', type: 'scale',
    text: 'How open is your firm to exploring AI-assisted client communication and coordination?',
    options: [
      'Not at all',
      'Somewhat open',
      'Interested',
      'Very interested',
      'Actively evaluating',
    ],
  },
];

/* ─── Shared Indicator (radio / checkbox) ─────────────────────── */

function OptIndicator({ multi, selected }) {
  return (
    <span className={'opt-ind' + (multi ? ' opt-ind--multi' : ' opt-ind--single') + (selected ? ' is-on' : '')} aria-hidden="true">
      {multi && selected && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none" style={{ display: 'block' }}>
          <path d="M1 3.5 3.5 6 8 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

/* ─── "Other" text input ──────────────────────────────────────── */

function OtherInput({ value = '', onChange }) {
  return (
    <div className="q-other-wrap">
      <input
        className="survey-field q-other-input"
        type="text"
        placeholder="Tell us more (optional)"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        autoFocus
      />
    </div>
  );
}

/* ─── Single-select ───────────────────────────────────────────── */

function SingleSelect({ q, value, onChange, otherText = '', onOtherChange }) {
  const hasOther = q.options.includes('Other');
  return (
    <div>
      <div className="q-options" role="radiogroup" aria-label={q.text}>
        {q.options.map((opt) => {
          const sel = value === opt;
          return (
            <button key={opt} role="radio" aria-checked={sel}
              className={'q-option' + (sel ? ' is-selected' : '')}
              onClick={() => onChange(opt)} type="button">
              <OptIndicator multi={false} selected={sel} />
              <span className="q-option__label">{opt}</span>
            </button>
          );
        })}
      </div>
      {hasOther && value === 'Other' && (
        <OtherInput value={otherText} onChange={onOtherChange} />
      )}
    </div>
  );
}

/* ─── Multi-select ────────────────────────────────────────────── */

function MultiSelect({ q, value = [], onChange, otherText = '', onOtherChange }) {
  const maxReached = !!(q.maxSelect && value.length >= q.maxSelect);
  const hasOther   = q.options.includes('Other');

  const toggle = (opt) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else if (!maxReached) {
      onChange([...value, opt]);
    }
  };

  return (
    <div>
      <div className={'q-options' + (q.columns === 2 ? ' q-options--grid' : '')} role="group" aria-label={q.text}>
        {q.options.map((opt) => {
          const sel      = value.includes(opt);
          const disabled = maxReached && !sel;
          return (
            <button key={opt} role="checkbox" aria-checked={sel}
              className={'q-option' + (sel ? ' is-selected' : '') + (disabled ? ' is-dim' : '')}
              onClick={() => toggle(opt)} type="button" disabled={disabled}>
              <OptIndicator multi={true} selected={sel} />
              <span className="q-option__label">{opt}</span>
            </button>
          );
        })}
      </div>
      {hasOther && value.includes('Other') && (
        <OtherInput value={otherText} onChange={onOtherChange} />
      )}
    </div>
  );
}

/* ─── Rating matrix (4 rows × 5 pips) ────────────────────────── */

function RatingMatrix({ q, value = {}, onChange }) {
  return (
    <div className="rating-matrix">
      <div className="rating-matrix__header" aria-hidden="true">
        <span className="rating-matrix__spacer" />
        <div className="rating-matrix__nums">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="rating-matrix__num">{n}</span>
          ))}
        </div>
      </div>
      {q.rows.map((row) => {
        const rated = value[row];
        return (
          <div className="rating-row" key={row} role="group" aria-label={row}>
            <span className="rating-row__label">{row}</span>
            <div className="rating-pips" aria-label="Rating 1–5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={'rating-pip' + (rated === n ? ' is-active' : (rated > n ? ' is-filled' : ''))}
                  onClick={() => onChange({ ...value, [row]: n })}
                  type="button"
                  aria-label={`${n} out of 5`}
                  aria-pressed={rated === n}
                />
              ))}
            </div>
          </div>
        );
      })}
      <div className="rating-matrix__legend">
        <span>Little to no friction</span>
        <span>Significant Friction</span>
      </div>
    </div>
  );
}

/* ─── Scale select (5-point labeled) ─────────────────────────── */

function ScaleSelect({ q, value, onChange }) {
  return (
    <div className="q-scale" role="radiogroup" aria-label={q.text}>
      {q.options.map((opt, i) => {
        const sel = value === opt;
        return (
          <button key={opt} role="radio" aria-checked={sel}
            className={'q-scale-item' + (sel ? ' is-selected' : '')}
            onClick={() => onChange(opt)} type="button">
            <span className="q-scale-item__num">{i + 1}</span>
            <span className="q-scale-item__label">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Dispatcher ──────────────────────────────────────────────── */

function QuestionBody({ q, value, onChange, otherText, onOtherChange }) {
  switch (q.type) {
    case 'single': return <SingleSelect  q={q} value={value} onChange={onChange} otherText={otherText} onOtherChange={onOtherChange} />;
    case 'multi':  return <MultiSelect   q={q} value={value} onChange={onChange} otherText={otherText} onOtherChange={onOtherChange} />;
    case 'rating': return <RatingMatrix  q={q} value={value} onChange={onChange} />;
    case 'scale':  return <ScaleSelect   q={q} value={value} onChange={onChange} />;
    default: return null;
  }
}

Object.assign(window, {
  SURVEY_SECTIONS, SURVEY_QUESTIONS,
  OptIndicator, OtherInput, SingleSelect, MultiSelect, RatingMatrix, ScaleSelect, QuestionBody,
});
