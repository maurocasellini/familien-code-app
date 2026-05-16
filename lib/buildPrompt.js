// lib/buildPrompt.js
import { calcPerson, dateCode, isMaster } from './numerology'

function fmtPerson(p, num, n) {
  const time = p.timeKnown && p.hour ? p.hour+':'+( p.minute||'00')+' Uhr' : 'unbekannt'
  return 'PERSON '+num+': '+p.firstName+' '+p.lastName+'\n- Geburtsdatum: '+p.day+'.'+p.month+'.'+p.year+', '+time+', '+p.place+'\n- Sonne: '+(n.sun||'unbekannt')+'\n- Lebenszahl: '+n.lz+(isMaster(n.lz)?' (Meisterzahl!)':'')+'\n- Seelendrang: '+n.soul+' | Persönlichkeit: '+n.pers+' | Ausdruck: '+n.expr+'\n- PJ 2025: '+n.py25+' / PJ 2026: '+n.py26+'\n  (Das pers. Jahr wechselt am Geburtstag, nicht am 1. Januar.)'
}

function fmtAncestor(a, role) {
  if (!a || !a.firstName) return null
  const parts = [role+': '+a.firstName+(a.lastName?' '+a.lastName:'')]
  if (a.birthCountry) parts.push('Herkunftsland: '+a.birthCountry)
  if (a.day && a.month && a.year) {
    const { lifeNumber } = require('./numerology')
    const lz = lifeNumber(a.day, a.month, a.year)
    parts.push('Geburtsdatum: '+a.day+'.'+a.month+'.'+a.year+' → LZ: '+lz+(isMaster(lz)?' (Meisterzahl)':''))
  }
  if (a.aliveAtBirth === false) parts.push('War beim Geburtszeitpunkt nicht mehr am Leben (systemisch relevant)')
  return parts.join('\n  ')
}

export function buildPrompt(state) {
  const { constellation, focus, person1, person2, meetDate, weddingDate, children, ancestry } = state
  const n1 = calcPerson(person1)
  let prompt = 'Du bist eine erfahrene Astrologin und Numerologin. Erstelle eine vollständige, tiefe, persönliche Analyse auf Deutsch. Sprich direkt mit du an. Überschriften mit ##. Keine Bullet-Listen. Warm, präzise, persönlich — kein generisches KI-Sprech.\n\nKONSTELLATION: '+constellation+'\nFOKUS: '+focus+'\n\n'+fmtPerson(person1, 1, n1)
  if (constellation==='pair'||constellation==='family') {
    const n2 = calcPerson(person2)
    if (n2) prompt += '\n\n'+fmtPerson(person2, 2, n2)
    if (meetDate.known && meetDate.day) prompt += '\n\nKENNENLERNEN: '+meetDate.day+'.'+meetDate.month+'.'+meetDate.year+' → Code: '+dateCode(meetDate.day,meetDate.month,meetDate.year)
    if (weddingDate.known && weddingDate.day) prompt += '\nHOCHZEIT: '+weddingDate.day+'.'+weddingDate.month+'.'+weddingDate.year+' → Code: '+dateCode(weddingDate.day,weddingDate.month,weddingDate.year)
  }
  if (children && children.length>0) {
    prompt += '\n\nKINDER:'
    children.forEach((k,i) => {
      if (!k.firstName) return
      const nk = calcPerson(k)
      if (!nk) return
      const t = k.timeKnown&&k.hour ? k.hour+':'+(k.minute||'00')+' Uhr' : 'Zeit unbekannt'
      prompt += '\nKind '+(i+1)+': '+k.firstName+' '+k.lastName+' — '+k.day+'.'+k.month+'.'+k.year+', '+t+', '+k.place+'\n  Sonne: '+nk.sun+' | LZ: '+nk.lz+(isMaster(nk.lz)?' (Meisterzahl)':'')+' | Seele: '+nk.soul+' | Pers: '+nk.pers+' | Ausdruck: '+nk.expr+' | PJ25: '+nk.py25+'/PJ26: '+nk.py26
    })
  }
  const hasAncestry = ancestry && (ancestry.mother?.firstName||ancestry.father?.firstName||ancestry.maternalGrandmother?.firstName||ancestry.paternalGrandmother?.firstName||ancestry.themes)
  if (hasAncestry) {
    prompt += '\n\nAHNENLINIE:'
    const lines = [fmtAncestor(ancestry.mother,'Mutter'),fmtAncestor(ancestry.father,'Vater'),fmtAncestor(ancestry.maternalGrandmother,'Grossmutter mütterlicherseits'),fmtAncestor(ancestry.maternalGrandfather,'Grossvater mütterlicherseits'),fmtAncestor(ancestry.paternalGrandmother,'Grossmutter väterlicherseits'),fmtAncestor(ancestry.paternalGrandfather,'Grossvater väterlicherseits')]
    lines.filter(Boolean).forEach(l => { prompt += '\n'+l })
    if (ancestry.themes) prompt += '\nFamilienthemen: '+ancestry.themes
  }
  prompt += '\n\nSEKTIONEN:\n## Der zentrale Code\n## Persönlicher Lebensweg\n## Namen-Energie'
  if (constellation==='pair'||constellation==='family') prompt += '\n## Beziehungsdynamik\n## Astrologische Kernverbindungen'
  if (constellation==='family'||constellation==='single-parent') prompt += '\n## Die Kinder'
  if (constellation==='family') prompt += '\n## Das Familiensystem'
  if (hasAncestry) prompt += '\n## Die Ahnenlinie'
  prompt += '\n## Herausforderung & Schlüssel\n## Jahresenergien 2025 & 2026\n## Die Essenz'
  prompt += '\n\nWICHTIG: Das pers. Jahr wechselt am Geburtstag. Erkläre das kurz. Schreibe tief, präzise, persönlich.'
  return prompt
}