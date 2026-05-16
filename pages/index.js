// pages/index.js
import { useState, useEffect, useRef } from 'react'
import { calcPerson, isMaster, formatLZ } from '../lib/numerology'

const EMPTY_PERSON = { firstName: '', lastName: '', day: '', month: '', year: '', timeKnown: true, hour: '', minute: '', place: '' }
const EMPTY_ANCESTOR = { firstName: '', lastName: '', day: '', month: '', year: '', birthCountry: '', aliveAtBirth: null }

const LOADING_TEXTS = [
  'Lebenszahlen werden ermittelt...',
  'Astrologische Verbindungen werden gewoben...',
  'Seelenlandschaft entfaltet sich...',
  'Persönliche Jahresenergien fliessen ein...',
  'Ahnenlinie wird erspürt...',
  'Dein Code nimmt Form an...',
]

function PersonForm({ person, onChange, badge, label, step }) {
  return (
    <div className="screen">
      <button className="btn-back" onClick={() => history.go(-1)}>← Zurück</button>
      <div className="eyebrow">Schritt {step}</div>
      <div className="person-header">
        <div className={`person-badge ${badge}`}>{badge === 'badge-1' ? '1' : '2'}</div>
        <div className="person-label">{label}</div>
      </div>
      <p className="field-note" style={{ marginBottom: 18 }}>Bitte den Taufnamen verwenden — er trägt die ursprüngliche Frequenz.</p>

      <div className="field">
        <label className="field-label">Vorname/n</label>
        <input type="text" placeholder="z. B. Maria Elena" value={person.firstName} onChange={e => onChange('firstName', e.target.value)} />
      </div>
      <div className="field">
        <label className="field-label">Nachname</label>
        <input type="text" placeholder="Familienname" value={person.lastName} onChange={e => onChange('lastName', e.target.value)} />
      </div>
      <div className="field">
        <label className="field-label">Geburtsdatum</label>
        <div className="date-row">
          <div className="field">
            <input type="number" placeholder="TT" min="1" max="31" value={person.day} onChange={e => onChange('day', e.target.value)} style={{ textAlign: 'center' }} />
            <div className="date-hint">Tag</div>
          </div>
          <div className="field">
            <input type="number" placeholder="MM" min="1" max="12" value={person.month} onChange={e => onChange('month', e.target.value)} style={{ textAlign: 'center' }} />
            <div className="date-hint">Monat</div>
          </div>
          <div className="field">
            <input type="number" placeholder="JJJJ" min="1900" max="2025" value={person.year} onChange={e => onChange('year', e.target.value)} style={{ textAlign: 'center' }} />
            <div className="date-hint">Jahr</div>
          </div>
        </div>
      </div>
      <div className="field">
        <label className="field-label">Geburtszeit</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <input type="number" placeholder="HH" min="0" max="23" value={person.hour} onChange={e => onChange('hour', e.target.value)} disabled={!person.timeKnown} style={{ textAlign: 'center', opacity: person.timeKnown ? 1 : 0.3 }} />
            <div className="date-hint">Stunde</div>
          </div>
          <div>
            <input type="number" placeholder="MM" min="0" max="59" value={person.minute} onChange={e => onChange('minute', e.target.value)} disabled={!person.timeKnown} style={{ textAlign: 'center', opacity: person.timeKnown ? 1 : 0.3 }} />
            <div className="date-hint">Minute</div>
          </div>
        </div>
        <div className="time-toggle">
          <input type="checkbox" id={`unk-${badge}`} checked={!person.timeKnown} onChange={e => onChange('timeKnown', !e.target.checked)} />
          <label htmlFor={`unk-${badge}`}>Geburtszeit unbekannt</label>
        </div>
      </div>
      <div className="field">
        <label className="field-label">Geburtsort</label>
        <input type="text" placeholder="z. B. Zürich, Schweiz" value={person.place} onChange={e => onChange('place', e.target.value)} />
      </div>
    </div>
  )
}

function AncestorField({ ancestor, onChange, label, isOptional = true }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="ancestry-block" style={{ marginBottom: 10 }}>
      <div className="ancestry-toggle" onClick={() => setOpen(!open)}>
        <div>
          <div className="ancestry-title">{label} {isOptional && <span className="optional-badge">optional</span>}</div>
          {!open && <div className="ancestry-sub">{ancestor.firstName ? `${ancestor.firstName} ${ancestor.lastName || ''}`.trim() : 'Tippe hier um Angaben zu machen'}</div>}
        </div>
        <div className={`ancestry-toggle-arrow ${open ? 'open' : ''}`}>▾</div>
      </div>
      {open && (
        <div style={{ marginTop: 14 }}>
          <div className="field">
            <label className="field-label">Taufname</label>
            <input type="text" placeholder="Vorname" value={ancestor.firstName} onChange={e => onChange('firstName', e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Nachname / Geburtsname</label>
            <input type="text" placeholder="Familienname" value={ancestor.lastName} onChange={e => onChange('lastName', e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Herkunftsland</label>
            <input type="text" placeholder="z. B. Portugal, Schweiz" value={ancestor.birthCountry} onChange={e => onChange('birthCountry', e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Geburtsdatum (falls bekannt)</label>
            <div className="date-row">
              <div className="field">
                <input type="number" placeholder="TT" value={ancestor.day} onChange={e => onChange('day', e.target.value)} style={{ textAlign: 'center' }} />
                <div className="date-hint">Tag</div>
              </div>
              <div className="field">
                <input type="number" placeholder="MM" value={ancestor.month} onChange={e => onChange('month', e.target.value)} style={{ textAlign: 'center' }} />
                <div className="date-hint">Monat</div>
              </div>
              <div className="field">
                <input type="number" placeholder="JJJJ" value={ancestor.year} onChange={e => onChange('year', e.target.value)} style={{ textAlign: 'center' }} />
                <div className="date-hint">Jahr</div>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="field-label">War beim Geburtszeitpunkt der Hauptperson noch am Leben?</label>
            <div style={{ display: 'flex', gap: 16, paddingTop: 8 }}>
              {[['ja', true], ['nein', false], ['unbekannt', null]].map(([lbl, val]) => (
                <label key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--muted)', cursor: 'pointer' }}>
                  <input type="radio" name={`alive-${label}`} checked={ancestor.aliveAtBirth === val} onChange={() => onChange('aliveAtBirth', val)} style={{ accentColor: 'var(--gold)' }} />
                  {lbl}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function renderMarkdown(text) {
  if (!text) return ''
  const sections = text.split(/^## /m).filter(Boolean)
  return sections.map(sec => {
    const lines = sec.split('\n')
    const heading = lines[0].trim()
    const body = lines.slice(1).join('\n').trim()
    const formatted = body
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .split(/\n\n+/)
      .filter(p => p.trim())
      .map(p => `<p>${p.replace(/\n/g, ' ')}</p>`)
      .join('')
    return `<div class="r-section"><h2>${heading}</h2>${formatted}</div>`
  }).join('')
}

export default function Home() {
  const [screen, setScreen] = useState('splash')
  const [constellation, setConstellation] = useState(null)
  const [person1, setPerson1] = useState({ ...EMPTY_PERSON })
  const [person2, setPerson2] = useState({ ...EMPTY_PERSON })
  const [meetDate, setMeetDate] = useState({ known: true, day: '', month: '', year: '' })
  const [weddingDate, setWeddingDate] = useState({ known: true, day: '', month: '', year: '' })
  const [children, setChildren] = useState([])
  const [ancestry, setAncestry] = useState({
    include: false,
    mother: { ...EMPTY_ANCESTOR },
    father: { ...EMPTY_ANCESTOR },
    maternalGrandmother: { ...EMPTY_ANCESTOR },
    maternalGrandfather: { ...EMPTY_ANCESTOR },
    paternalGrandmother: { ...EMPTY_ANCESTOR },
    paternalGrandfather: { ...EMPTY_ANCESTOR },
    themes: '',
  })
  const [focus, setFocus] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loadingText, setLoadingText] = useState(LOADING_TEXTS[0])
  const [downloading, setDownloading] = useState(false)
  const loadingRef = useRef(null)

  // Loading text rotation
  useEffect(() => {
    if (screen === 'loading') {
      let idx = 0
      loadingRef.current = setInterval(() => {
        idx = (idx + 1) % LOADING_TEXTS.length
        setLoadingText(LOADING_TEXTS[idx])
      }, 3000)
    }
    return () => clearInterval(loadingRef.current)
  }, [screen])

  // Progress calculation
  const getFlow = () => {
    const base = ['splash', 'constellation', 'person1']
    if (constellation === 'pair' || constellation === 'family') base.push('person2', 'keydates')
    if (constellation === 'family' || constellation === 'single-parent') base.push('children')
    base.push('ancestry', 'focus', 'loading', 'result')
    return base
  }
  const flow = getFlow()
  const flowIdx = flow.indexOf(screen)
  const progressPct = Math.round((flowIdx / (flow.length - 1)) * 100)

  const goNext = () => {
    const f = getFlow()
    const i = f.indexOf(screen)
    if (i < f.length - 1) {
      const next = f[i + 1]
      if (next === 'loading') {
        setScreen('loading')
        runAnalysis()
      } else {
        setScreen(next)
      }
    }
  }
  const goBack = () => {
    const f = getFlow()
    const i = f.indexOf(screen)
    if (i > 0) setScreen(f[i - 1])
  }

  const validPerson = p => p.firstName && p.lastName && p.day && p.month && p.year && p.place

  const runAnalysis = async () => {
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ constellation, focus, person1, person2, meetDate, weddingDate, children, ancestry }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'API Fehler')
      setResult(data.result)
    } catch (e) {
      setError(e.message)
    }
    setScreen('result')
  }

  const downloadDocx = async () => {
    setDownloading(true)
    try {
      const res = await fetch('/api/generate-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result, person1, person2, constellation, children }),
      })
      if (!res.ok) throw new Error('DOCX Generierung fehlgeschlagen')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = person1.firstName ? `familien-code-${person1.firstName.toLowerCase()}.docx` : 'familien-code.docx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('Fehler beim Download: ' + e.message)
    }
    setDownloading(false)
  }

  const restart = () => {
    setScreen('splash'); setConstellation(null); setPerson1({ ...EMPTY_PERSON }); setPerson2({ ...EMPTY_PERSON })
    setMeetDate({ known: true, day: '', month: '', year: '' }); setWeddingDate({ known: true, day: '', month: '', year: '' })
    setChildren([]); setFocus(null); setResult(null); setError(null)
    setAncestry({ include: false, mother: { ...EMPTY_ANCESTOR }, father: { ...EMPTY_ANCESTOR }, maternalGrandmother: { ...EMPTY_ANCESTOR }, maternalGrandfather: { ...EMPTY_ANCESTOR }, paternalGrandmother: { ...EMPTY_ANCESTOR }, paternalGrandfather: { ...EMPTY_ANCESTOR }, themes: '' })
  }

  const updateAncestor = (key, field, val) => setAncestry(a => ({ ...a, [key]: { ...a[key], [field]: val } }))

  const names = constellation === 'solo'
    ? person1.firstName
    : `${person1.firstName}${person2.firstName ? ` & ${person2.firstName}` : ''}`

  // ── SCREENS ──
  if (screen === 'splash') return (
    <div className="app">
      <div className="progress-bar"><div className="progress-fill" style={{ width: '0%' }} /></div>
      <div className="screen" style={{ justifyContent: 'space-between', minHeight: '100vh' }}>
        <div>
          <div className="eyebrow" style={{ textAlign: 'center', marginTop: 16 }}>von Susana · herzbewegung</div>
          <div className="splash-symbol">✦</div>
          <div className="display" style={{ textAlign: 'center', fontSize: 40 }}>Familien<em>-Code</em></div>
          <div className="subtitle" style={{ textAlign: 'center', marginTop: 6 }}>Deine Seelenlandschaft<br />in Zahlen und Zeichen</div>
          <div className="ornament">· · · · ·</div>
          <p style={{ fontSize: 15, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.75, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
            Dein Name trägt eine Frequenz.<br />Dein Geburtsdatum trägt einen Code.<br />Zusammen erzählen sie deine Geschichte.
          </p>
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={goNext}>Analyse starten</button>
        </div>
        <div className="splash-brand">herzbewegung.ch · susana</div>
      </div>
    </div>
  )

  if (screen === 'constellation') return (
    <div className="app">
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
      <div className="screen">
        <button className="btn-back" onClick={goBack}>← Zurück</button>
        <div className="eyebrow">Schritt 1</div>
        <div className="sec-title">Für wen soll die Analyse sein?</div>
        <div className="sec-sub">Wähle deine Konstellation — alles andere passt sich an.</div>
        <div className="const-grid">
          {[
            { id: 'solo', sym: '✦', label: 'Nur für mich' },
            { id: 'pair', sym: '✦ ✦', label: 'Ich & mein/e Partner:in' },
            { id: 'family', sym: '✦ ✦ ✦', label: 'Unsere Familie' },
            { id: 'single-parent', sym: '✦ ✦', label: 'Ich & meine Kinder' },
          ].map(o => (
            <div key={o.id} className={`const-card ${constellation === o.id ? 'selected' : ''}`} onClick={() => { setConstellation(o.id); if (o.id === 'solo' || o.id === 'pair') setChildren([]) }}>
              <div className="const-sym">{o.sym}</div>
              <div className="const-label">{o.label}</div>
            </div>
          ))}
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={goNext} disabled={!constellation}>Weiter</button>
        </div>
      </div>
    </div>
  )

  if (screen === 'person1') return (
    <div className="app">
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
      <PersonForm person={person1} onChange={(f, v) => setPerson1(p => ({ ...p, [f]: v }))} badge="badge-1" label={constellation === 'solo' ? 'Über dich' : 'Person 1'} step={2} />
      <div style={{ padding: '0 28px 48px' }}>
        <button className="btn btn-primary" onClick={goNext} disabled={!validPerson(person1)}>Weiter</button>
      </div>
    </div>
  )

  if (screen === 'person2') return (
    <div className="app">
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
      <PersonForm person={person2} onChange={(f, v) => setPerson2(p => ({ ...p, [f]: v }))} badge="badge-2" label="Partner:in" step={3} />
      <div style={{ padding: '0 28px 48px' }}>
        <button className="btn btn-primary" onClick={goNext} disabled={!validPerson(person2)}>Weiter</button>
        <button className="btn btn-back" onClick={goBack} style={{ display: 'block', marginTop: 8 }}>← Zurück</button>
      </div>
    </div>
  )

  if (screen === 'keydates') {
    const DateFields = ({ obj, setObj }) => (
      <div className="date-row">
        {[['day', 'TT', 'Tag'], ['month', 'MM', 'Monat'], ['year', 'JJJJ', 'Jahr']].map(([f, ph, lbl]) => (
          <div className="field" key={f}>
            <input type="number" placeholder={ph} value={obj[f]} onChange={e => setObj(o => ({ ...o, [f]: e.target.value }))} disabled={!obj.known} style={{ textAlign: 'center', opacity: obj.known ? 1 : 0.3 }} />
            <div className="date-hint">{lbl}</div>
          </div>
        ))}
      </div>
    )
    return (
      <div className="app">
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
        <div className="screen">
          <button className="btn-back" onClick={goBack}>← Zurück</button>
          <div className="eyebrow">Schritt 4</div>
          <div className="sec-title">Eure Schlüsseldaten</div>
          <div className="sec-sub">Optional — aber jedes Datum trägt einen Code.</div>
          <div className="keydate-block">
            <div className="keydate-label">Kennenlernen</div>
            <div className="keydate-title">Wann habt ihr euch getroffen?</div>
            <DateFields obj={meetDate} setObj={setMeetDate} />
            <div className="unk-toggle"><input type="checkbox" id="m-unk" checked={!meetDate.known} onChange={e => setMeetDate(d => ({ ...d, known: !e.target.checked }))} /><label htmlFor="m-unk">Überspringen</label></div>
          </div>
          <div className="keydate-block">
            <div className="keydate-label">Hochzeit oder Zusammenzug</div>
            <div className="keydate-title">Euer gemeinsamer Beginn</div>
            <DateFields obj={weddingDate} setObj={setWeddingDate} />
            <div className="unk-toggle"><input type="checkbox" id="w-unk" checked={!weddingDate.known} onChange={e => setWeddingDate(d => ({ ...d, known: !e.target.checked }))} /><label htmlFor="w-unk">Überspringen</label></div>
          </div>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={goNext}>Weiter</button>
            <button className="btn btn-ghost" onClick={goNext}>Alles überspringen</button>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'children') return (
    <div className="app">
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
      <div className="screen">
        <button className="btn-back" onClick={goBack}>← Zurück</button>
        <div className="eyebrow">Kinder</div>
        <div className="sec-title">Eure Kinder</div>
        <div className="sec-sub">Jedes Kind trägt seine eigene Frequenz ins System.</div>
        <div className="scroll-wrap" style={{ maxHeight: '55vh' }}>
          {children.map((kid, i) => (
            <div className="child-block" key={i}>
              <div className="child-num">Kind {i + 1}</div>
              <button className="btn-remove" onClick={() => setChildren(c => c.filter((_, ci) => ci !== i))}>×</button>
              {[['firstName', 'Vorname/n', 'Taufname'], ['lastName', 'Nachname', 'Familienname'], ['place', 'Geburtsort', 'Stadt, Land']].map(([f, lbl, ph]) => (
                <div className="field" key={f}>
                  <label className="field-label">{lbl}</label>
                  <input type="text" placeholder={ph} value={kid[f]} onChange={e => setChildren(c => c.map((k, ci) => ci === i ? { ...k, [f]: e.target.value } : k))} />
                </div>
              ))}
              <div className="date-row" style={{ marginBottom: 14 }}>
                {[['day', 'TT', 'Tag'], ['month', 'MM', 'Monat'], ['year', 'JJJJ', 'Jahr']].map(([f, ph, lbl]) => (
                  <div className="field" key={f}>
                    <input type="number" placeholder={ph} value={kid[f]} onChange={e => setChildren(c => c.map((k, ci) => ci === i ? { ...k, [f]: e.target.value } : k))} style={{ textAlign: 'center' }} />
                    <div className="date-hint">{lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[['hour', 'HH', 'Stunde'], ['minute', 'MM', 'Minute']].map(([f, ph, lbl]) => (
                  <div key={f}>
                    <input type="number" placeholder={ph} value={kid[f]} onChange={e => setChildren(c => c.map((k, ci) => ci === i ? { ...k, [f]: e.target.value } : k))} disabled={!kid.timeKnown} style={{ textAlign: 'center', width: '100%', border: 'none', borderBottom: '1.5px solid var(--rule)', background: 'transparent', padding: '9px 0', fontFamily: "'Cormorant Garamond', serif", fontSize: 18, opacity: kid.timeKnown ? 1 : 0.3 }} />
                    <div className="date-hint">{lbl}</div>
                  </div>
                ))}
              </div>
              <div className="time-toggle" style={{ marginTop: 8 }}>
                <input type="checkbox" checked={!kid.timeKnown} onChange={e => setChildren(c => c.map((k, ci) => ci === i ? { ...k, timeKnown: !e.target.checked } : k))} />
                <label>Zeit unbekannt</label>
              </div>
            </div>
          ))}
          {children.length < 5 && <button className="btn-add" onClick={() => setChildren(c => [...c, { ...EMPTY_PERSON }])}>+ Weiteres Kind</button>}
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={goNext}>{children.length === 0 ? 'Ohne Kinder weiter' : 'Weiter'}</button>
        </div>
      </div>
    </div>
  )

  if (screen === 'ancestry') return (
    <div className="app">
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
      <div className="screen">
        <button className="btn-back" onClick={goBack}>← Zurück</button>
        <div className="eyebrow">Optional</div>
        <div className="sec-title">Die Ahnenlinie</div>
        <div className="sec-sub">Was aus deiner Familie mitschwingt — unbewusst, über Generationen. Alle Felder sind freiwillig.</div>

        <div className="card" style={{ marginBottom: 16, cursor: 'pointer', background: ancestry.include ? 'var(--gold-pp)' : 'var(--white)', borderColor: ancestry.include ? 'var(--gold)' : 'var(--rule)' }} onClick={() => setAncestry(a => ({ ...a, include: !a.include }))}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: ancestry.include ? 'var(--gold)' : 'var(--gold-p)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {ancestry.include && <span style={{ color: 'white', fontSize: 14, lineHeight: 1 }}>✓</span>}
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18 }}>Ahnenlinie einbeziehen</div>
              <div style={{ fontSize: 12, color: 'var(--silver)', marginTop: 2 }}>Eltern, Grosseltern, Familienthemen</div>
            </div>
          </div>
        </div>

        {ancestry.include && (
          <div className="scroll-wrap" style={{ maxHeight: '55vh' }}>
            <div className="ornament" style={{ margin: '8px 0 12px' }}>— Eltern —</div>
            <AncestorField ancestor={ancestry.mother} onChange={(f, v) => updateAncestor('mother', f, v)} label="Mutter" />
            <AncestorField ancestor={ancestry.father} onChange={(f, v) => updateAncestor('father', f, v)} label="Vater" />

            <div className="ornament" style={{ margin: '12px 0' }}>— Grosseltern —</div>
            <AncestorField ancestor={ancestry.maternalGrandmother} onChange={(f, v) => updateAncestor('maternalGrandmother', f, v)} label="Grossmutter mütterlicherseits" />
            <AncestorField ancestor={ancestry.maternalGrandfather} onChange={(f, v) => updateAncestor('maternalGrandfather', f, v)} label="Grossvater mütterlicherseits" />
            <AncestorField ancestor={ancestry.paternalGrandmother} onChange={(f, v) => updateAncestor('paternalGrandmother', f, v)} label="Grossmutter väterlicherseits" />
            <AncestorField ancestor={ancestry.paternalGrandfather} onChange={(f, v) => updateAncestor('paternalGrandfather', f, v)} label="Grossvater väterlicherseits" />

            <div className="ornament" style={{ margin: '12px 0' }}>— Themen —</div>
            <div className="field">
              <label className="field-label">Wiederkehrende Familienthemen <span className="optional-badge">optional</span></label>
              <textarea placeholder="z. B. frühe Verluste, starke Frauen, Migration, spirituelle Berufe, Krankheit..." value={ancestry.themes} onChange={e => setAncestry(a => ({ ...a, themes: e.target.value }))} />
              <div className="field-note">Diese Angabe hilft, generationsübergreifende Muster zu erkennen.</div>
            </div>
          </div>
        )}

        <div className="btn-row">
          <button className="btn btn-primary" onClick={goNext}>Weiter</button>
          {!ancestry.include && <button className="btn btn-ghost" onClick={goNext}>Ohne Ahnenlinie weiter</button>}
        </div>
      </div>
    </div>
  )

  if (screen === 'focus') return (
    <div className="app">
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
      <div className="screen">
        <button className="btn-back" onClick={goBack}>← Zurück</button>
        <div className="eyebrow">Fast fertig</div>
        <div className="sec-title">Was interessiert dich am meisten?</div>
        <div className="sec-sub">Der Fokus bestimmt die Tiefe der Analyse.</div>
        <div className="focus-list">
          {[
            { id: 'gesamtbild', sym: '✦', label: 'Das grosse Gesamtbild' },
            { id: 'beziehung', sym: '♡', label: 'Beziehungsdynamik & Partnerschaft' },
            { id: 'lebensweg', sym: '◈', label: 'Mein persönlicher Lebensweg' },
            { id: 'kinder', sym: '◦', label: 'Die Kinder & ihre Energie' },
            { id: 'ahnen', sym: '∞', label: 'Ahnenlinie & Familienthemen' },
            { id: 'zukunft', sym: '◉', label: 'Zukunft & Jahresprognosen' },
          ].map(o => (
            <div key={o.id} className={`focus-card ${focus === o.id ? 'selected' : ''}`} onClick={() => setFocus(o.id)}>
              <div className="focus-sym">{o.sym}</div>
              <div className="focus-label">{o.label}</div>
            </div>
          ))}
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={goNext} disabled={!focus}>Analyse starten</button>
        </div>
      </div>
    </div>
  )

  if (screen === 'loading') return (
    <div className="app">
      <div className="progress-bar"><div className="progress-fill" style={{ width: '90%' }} /></div>
      <div className="screen" style={{ justifyContent: 'center' }}>
        <div className="loading-wrap">
          <div className="loading-sym">✦</div>
          <div className="loading-title">Dein Code<br />wird berechnet</div>
          <div className="loading-sub">{loadingText}</div>
          <div className="loading-dots">
            <div className="dot" /><div className="dot" /><div className="dot" />
          </div>
          <div style={{ fontSize: 12, color: 'var(--silver)', fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif" }}>Das dauert 20–40 Sekunden.</div>
        </div>
      </div>
    </div>
  )

  if (screen === 'result') return (
    <div className="app">
      <div className="progress-bar"><div className="progress-fill" style={{ width: '100%' }} /></div>
      <div className="screen" style={{ paddingTop: 32 }}>
        <div className="result-header">
          <div className="result-names">{names}</div>
          <div className="result-title">Dein Familien-Code</div>
        </div>
        <div className="ornament">✦</div>

        {error && <div className="error-msg">{error}</div>}

        <div className="scroll-wrap" style={{ maxHeight: '60vh' }}>
          {result && <div className="result-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }} />}
        </div>

        <div className="result-actions">
          <button className="btn btn-rose" onClick={downloadDocx} disabled={!result || downloading}>
            {downloading ? 'Wird erstellt...' : '↓ Als Word-Dokument (editierbar)'}
          </button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            Drucken / Als PDF speichern
          </button>
          <button className="btn" onClick={restart}>Neue Analyse starten</button>
        </div>
        <div className="splash-brand" style={{ paddingTop: 6 }}>herzbewegung.ch · susana</div>
      </div>
    </div>
  )

  return null
}
