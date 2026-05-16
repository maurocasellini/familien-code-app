// lib/buildPrompt.js
import { calcPerson, dateCode, isMaster } from './numerology'

function fmtPerson(p, num, n) {
  const time = p.timeKnown && p.hour ? `${p.hour}:${p.minute || '00'} Uhr` : 'unbekannt'
  const lzStr = `${n.lz}${isMaster(n.lz) ? ' (Meisterzahl!)' : ''}`
  return `PERSON ${num}: ${p.firstName} ${p.lastName}
- Geburtsdatum: ${p.day}.${p.month}.${p.year}, ${time}, ${p.place}
- Sonne: ${n.sun || 'unbekannt'}
- Lebenszahl: ${lzStr}
- Seelendrang: ${n.soul} | Persönlichkeit: ${n.pers} | Ausdruck: ${n.expr}
- Persönl. Jahr 2025: ${n.py25} / 2026: ${n.py26}
  (Hinweis: Das persönliche Jahr wechselt am Geburtstag, nicht am 1. Januar. Erkläre dies in der Analyse.)`
}

function fmtAncestor(a, role) {
  if (!a || !a.firstName) return null
  const parts = [`${role}: ${a.firstName}${a.lastName ? ' ' + a.lastName : ''}`]
  if (a.birthCountry) parts.push(`Herkunftsland: ${a.birthCountry}`)
  if (a.day && a.month && a.year) {
    const { lifeNumber } = require('./numerology')
    const lz = lifeNumber(a.day, a.month, a.year)
    parts.push(`Geburtsdatum: ${a.day}.${a.month}.${a.year} → Lebenszahl: ${lz}${isMaster(lz) ? ' (Meisterzahl!)' : ''}`)
  }
  if (a.aliveAtBirth === false) parts.push('War beim Geburtszeitpunkt nicht mehr am Leben (systemisch relevant)')
  return parts.join('\n  ')
}

export function buildPrompt(state) {
  const { constellation, focus, person1, person2, meetDate, weddingDate, children, ancestry } = state
  const n1 = calcPerson(person1)
  
  let prompt = `Du bist eine erfahrene Astrologin und Numerologin. Erstelle eine vollständige, tiefe und persönliche Analyse auf Deutsch. Sprich direkt mit "du" an. Schreibe in fliessenden Absätzen mit klaren Überschriften (## Titel). Keine Bullet-Listen. Jeder Satz soll präzise, warm und persönlich sein — kein generisches KI-Sprech, keine Floskeln.

KONSTELLATION: ${constellation}
FOKUS: ${focus}

${fmtPerson(person1, 1, n1)}`

  if (constellation === 'pair' || constellation === 'family') {
    const n2 = calcPerson(person2)
    if (n2) prompt += `\n\n${fmtPerson(person2, 2, n2)}`
    
    if (meetDate.known && meetDate.day) {
      const mc = dateCode(meetDate.day, meetDate.month, meetDate.year)
      prompt += `\n\nKENNENLERNEN: ${meetDate.day}.${meetDate.month}.${meetDate.year} → Code: ${mc}`
    }
    if (weddingDate.known && weddingDate.day) {
      const wc = dateCode(weddingDate.day, weddingDate.month, weddingDate.year)
      prompt += `\nHOCHZEIT/ZUSAMMENZUG: ${weddingDate.day}.${weddingDate.month}.${weddingDate.year} → Code: ${wc}`
    }
  }

  if (children && children.length > 0) {
    prompt += '\n\nKINDER:'
    children.forEach((k, i) => {
      if (!k.firstName) return
      const nk = calcPerson(k)
      if (!nk) return
      const time = k.timeKnown && k.hour ? `${k.hour}:${k.minute || '00'} Uhr` : 'Zeit unbekannt'
      prompt += `\nKind ${i+1}: ${k.firstName} ${k.lastName} — ${k.day}.${k.month}.${k.year}, ${time}, ${k.place}
  Sonne: ${nk.sun} | LZ: ${nk.lz}${isMaster(nk.lz) ? ' (Meisterzahl)' : ''} | Seele: ${nk.soul} | Pers: ${nk.pers} | Ausdruck: ${nk.expr} | PJ 2025: ${nk.py25} / 2026: ${nk.py26}`
    })
  }

  // ANCESTRY
  const hasAncestry = ancestry && (
    ancestry.mother?.firstName || ancestry.father?.firstName ||
    ancestry.maternalGrandmother?.firstName || ancestry.maternalGrandfather?.firstName ||
    ancestry.paternalGrandmother?.firstName || ancestry.paternalGrandfather?.firstName ||
    ancestry.themes
  )

  if (hasAncestry) {
    prompt += '\n\nAHNENLINIE:'
    const motherStr = fmtAncestor(ancestry.mother, 'Mutter')
    const fatherStr = fmtAncestor(ancestry.father, 'Vater')
    const mgmStr = fmtAncestor(ancestry.maternalGrandmother, 'Grossmutter mütterlicherseits')
    const mgfStr = fmtAncestor(ancestry.maternalGrandfather, 'Grossvater mütterlicherseits')
    const pgmStr = fmtAncestor(ancestry.paternalGrandmother, 'Grossmutter väterlicherseits')
    const pgfStr = fmtAncestor(ancestry.paternalGrandfather, 'Grossvater väterlicherseits')
    
    ;[motherStr, fatherStr, mgmStr, mgfStr, pgmStr, pgfStr].filter(Boolean).forEach(s => {
      prompt += `\n${s}`
    })
    
    if (ancestry.themes) {
      prompt += `\nWiederkehrende Familienthemen: ${ancestry.themes}`
    }
  }

  // SECTIONS
  prompt += '\n\nERSTELLE FOLGENDE SEKTIONEN:\n'
  prompt += '## Der zentrale Code\n'
  prompt += '## Persönlicher Lebensweg\n'
  prompt += '## Namen-Energie\n'
  
  if (constellation === 'pair' || constellation === 'family') {
    prompt += '## Beziehungsdynamik\n'
    prompt += '## Astrologische Kernverbindungen\n'
  }
  if (constellation === 'family' || constellation === 'single-parent') {
    prompt += '## Die Kinder\n'
  }
  if (constellation === 'family') {
    prompt += '## Das Familiensystem\n'
  }
  if (hasAncestry) {
    prompt += '## Die Ahnenlinie — was aus deiner Familie mitschwingt\n'
  }
  
  prompt += '## Herausforderung & Schlüssel\n'
  prompt += '## Jahresenergien 2025 & 2026\n'
  prompt += '## Die Essenz\n'
  
  prompt += `
WICHTIG:
- Das persönliche Jahr wechselt am Geburtstag, nicht am 1. Januar. Erkläre das kurz bei den Jahresenergien.
- Bei der Ahnenlinie: Zeige wiederkehrende Lebenszahlen über Generationen, fehlende Energien und was das Kind kompensieren oder weiterführen soll.
- Schreibe tief, präzise, persönlich. Keine generischen Phrasen. Die Analyse soll sich anfühlen wie von einer erfahrenen Beraterin geschrieben.`

  return prompt
}
