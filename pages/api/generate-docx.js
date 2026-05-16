// pages/api/generate-docx.js
import {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, BorderStyle, PageBreak,
  TableCell, TableRow, Table, WidthType,
  ShadingType, VerticalAlign
} from 'docx'

// Kein scharfes S
function ss(t) { return (t || '').replace(/\u00df/g, 'ss') }

const C = {
  rose: '8B4060', roseL: 'C4687E', roseP: 'FDF0F4',
  gold: '9A7020', goldL: 'C4962A', goldP: 'F0E4C0',
  ink: '1C1714', muted: '5A4A40', silver: '9A8A80',
  rule: 'E8DDC8', cream: 'FAF6EF', white: 'FFFFFF',
}

function isMaster(n) { return n === 11 || n === 22 || n === 33 }

function run(text, opts = {}) {
  return new TextRun({ text: ss(text || ''), font: 'Georgia', color: C.ink, size: 22, ...opts })
}

function emptyLine(after = 80) { return new Paragraph({ children: [], spacing: { after } }) }

function ornament(sym = '\u2736   \u2736   \u2736') {
  return new Paragraph({
    children: [run(sym, { color: C.goldL, size: 18 })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 240 },
  })
}

function secHeading(text) {
  return new Paragraph({
    children: [run(text, { bold: true, size: 36, color: C.rose })],
    spacing: { before: 560, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.goldP, space: 6 } },
  })
}

function subHeading(text) {
  return new Paragraph({
    children: [run(text, { bold: true, size: 26, color: C.gold })],
    spacing: { before: 320, after: 100 },
  })
}

function eyebrow(text) {
  return new Paragraph({
    children: [run(ss(text || '').toUpperCase(), { font: 'Lato', size: 16, color: C.silver, characterSpacing: 80 })],
    spacing: { before: 120, after: 40 },
  })
}

function inlineRuns(text, sz = 22) {
  const runs = []
  ss(text || '').split(/(\*\*.*?\*\*|\*.*?\*)/g).forEach(p => {
    if (p.startsWith('**') && p.endsWith('**'))
      runs.push(new TextRun({ text: p.slice(2,-2), font: 'Georgia', size: sz, bold: true, color: C.ink }))
    else if (p.startsWith('*') && p.endsWith('*'))
      runs.push(new TextRun({ text: p.slice(1,-1), font: 'Georgia', size: sz, italics: true, color: C.muted }))
    else if (p)
      runs.push(new TextRun({ text: p, font: 'Georgia', size: sz, color: C.muted }))
  })
  return runs
}

function bodyBlock(text) {
  const out = []
  ss(text || '').split(/\n\n+/).filter(b => b.trim()).forEach(block => {
    block.split('\n').filter(l => l.trim()).forEach(line => {
      out.push(new Paragraph({ children: inlineRuns(line), spacing: { after: 160, line: 320 } }))
    })
    out.push(emptyLine(80))
  })
  return out
}

function bigNum(num, label) {
  return [
    new Paragraph({
      children: [run(String(num), { size: 96, color: C.rose })],
      alignment: AlignmentType.CENTER, spacing: { before: 120, after: 40 },
    }),
    new Paragraph({
      children: [run(ss(label || '').toUpperCase(), { font: 'Lato', size: 16, color: C.silver, characterSpacing: 60 })],
      alignment: AlignmentType.CENTER, spacing: { after: 200 },
    }),
  ]
}

function infoCard(eb, title, body, shade = C.goldP) {
  const border = { left: { style: BorderStyle.SINGLE, size: 12, color: C.goldL } }
  const shading = { type: ShadingType.SOLID, fill: shade }
  const ind = { left: 200, right: 200 }
  return [
    new Paragraph({ children: [run(ss(eb).toUpperCase(), { font: 'Lato', size: 16, color: C.silver, characterSpacing: 60 })], shading, border: { ...border, top: { style: BorderStyle.SINGLE, size: 4, color: C.goldL } }, indent: ind, spacing: { after: 0 } }),
    new Paragraph({ children: [run(title, { size: 28, bold: true })], shading, border, indent: ind, spacing: { after: 0 } }),
    new Paragraph({ children: inlineRuns(body, 20), shading, border: { ...border, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.goldL } }, indent: ind, spacing: { before: 40, after: 200 } }),
  ]
}

function personCard(label, name, details, lz, soul, pers, expr, pinnacle, py25, py26) {
  const rows = [
    ['Lebenszahl', lz ? String(lz) + (isMaster(+lz) ? ' \u2736 Meisterzahl' : '') : '\u2014'],
    ['Seelendrang', String(soul || '\u2014')],
    ['Persoenlichkeit', String(pers || '\u2014')],
    ['Ausdruck', String(expr || '\u2014')],
    ['Pinnacle jetzt', String(pinnacle || '\u2014')],
    ['Pers. Jahr 2025', String(py25 || '\u2014')],
    ['Pers. Jahr 2026', String(py26 || '\u2014')],
  ]
  return [
    eyebrow(label),
    new Paragraph({ children: [run(name, { size: 32, bold: true })], spacing: { after: 60 } }),
    new Paragraph({ children: [run(details, { size: 18, italics: true, color: C.muted })], spacing: { after: 120 } }),
    ...rows.map(([k, v]) => new Paragraph({
      children: [run(k + ':  ', { font: 'Lato', size: 18, color: C.silver }), run(v, { size: 20, color: C.rose, bold: true })],
      spacing: { after: 60 },
    })),
    emptyLine(200),
  ]
}

function jahresTab(headers, rows) {
  const colW = Math.floor(9000 / (headers.length + 1))
  function tcell(text, isHead, shade) {
    return new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: ss(String(text || '')), font: isHead ? 'Lato' : 'Georgia', size: isHead ? 16 : 20, bold: isHead, color: isHead ? C.silver : C.ink })],
        alignment: AlignmentType.CENTER,
      })],
      shading: { type: ShadingType.SOLID, fill: shade },
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
    })
  }
  return new Table({
    rows: [
      new TableRow({ children: [tcell('Jahr', true, C.goldP), ...headers.map(h => tcell(h, true, C.goldP))], tableHeader: true }),
      ...rows.map((r, i) => new TableRow({ children: r.map(v => tcell(v, false, i % 2 === 0 ? C.cream : C.white)) })),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
  })
}

function pinnacleCard(person, nr, zeitraum, zahl, desc, challenge) {
  return [
    new Paragraph({
      children: [
        run(nr + '. Pinnacle', { font: 'Lato', size: 16, color: C.silver, characterSpacing: 60 }),
        run('   ' + ss(zeitraum) + '   ', { font: 'Lato', size: 16, color: C.muted }),
        run(ss(person).toUpperCase(), { font: 'Lato', size: 14, color: C.silver, characterSpacing: 40 }),
      ],
      spacing: { before: 240, after: 40 },
    }),
    new Paragraph({
      children: [run(String(zahl), { size: 56, color: C.rose }), run('  '), ...inlineRuns(desc, 22)],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [run('CHALLENGE: ', { font: 'Lato', size: 16, color: C.silver, bold: true }), ...inlineRuns(challenge, 20)],
      shading: { type: ShadingType.SOLID, fill: C.roseP },
      spacing: { after: 180 },
      indent: { left: 160, right: 160 },
      border: { left: { style: BorderStyle.SINGLE, size: 8, color: C.roseL } },
    }),
  ]
}

function hsBlock(h, s) {
  return [
    new Paragraph({ children: [run('HERAUSFORDERUNG', { font: 'Lato', size: 18, color: C.silver, bold: true, characterSpacing: 60 })], spacing: { before: 240, after: 80 } }),
    new Paragraph({ children: inlineRuns(h), shading: { type: ShadingType.SOLID, fill: C.roseP }, spacing: { after: 240 }, indent: { left: 200 }, border: { left: { style: BorderStyle.SINGLE, size: 12, color: C.roseL } } }),
    new Paragraph({ children: [run('SCHLUESSEL', { font: 'Lato', size: 18, color: C.silver, bold: true, characterSpacing: 60 })], spacing: { before: 120, after: 80 } }),
    new Paragraph({ children: inlineRuns(s), shading: { type: ShadingType.SOLID, fill: C.goldP }, spacing: { after: 240 }, indent: { left: 200 }, border: { left: { style: BorderStyle.SINGLE, size: 12, color: C.goldL } } }),
  ]
}

function namenCard(name, rolle, soul, soulL, pers, persL, expr, exprL, desc) {
  return [
    eyebrow(rolle),
    new Paragraph({ children: [run(name, { size: 28, bold: true })], spacing: { after: 80 } }),
    new Paragraph({
      children: [run(String(soul), { size: 64, color: C.rose }), run('  ' + String(pers), { size: 64, color: C.gold }), run('  ' + String(expr), { size: 64, color: C.muted })],
      spacing: { after: 40 },
    }),
    new Paragraph({ children: [run('SEELENDRANG   PERSOENLICHKEIT   AUSDRUCK', { font: 'Lato', size: 14, color: C.silver, characterSpacing: 40 })], spacing: { after: 80 } }),
    new Paragraph({
      children: [run(ss(soulL) + '   \u00b7   ', { size: 18, italics: true, color: C.rose }), run(ss(persL) + '   \u00b7   ', { size: 18, italics: true, color: C.gold }), run(ss(exprL), { size: 18, italics: true, color: C.muted })],
      spacing: { after: 100 },
    }),
    new Paragraph({ children: inlineRuns(desc, 20), spacing: { after: 200 } }),
  ]
}

function essenzBlock(text) {
  return [
    ornament(),
    new Paragraph({
      children: [run(text, { size: 30, italics: true, color: C.muted })],
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.SOLID, fill: C.cream },
      indent: { left: 400, right: 400 },
      spacing: { before: 200, after: 200 },
    }),
    ornament(),
  ]
}

function notizfeld() {
  return [
    emptyLine(160),
    new Paragraph({
      children: [run('[ Notizen / Ergaenzungen fuer diese Klientin: ]', { size: 18, italics: true, color: C.rule })],
      spacing: { before: 160, after: 320 },
      border: { top: { style: BorderStyle.DASHED, size: 2, color: C.rule }, bottom: { style: BorderStyle.DASHED, size: 2, color: C.rule } },
    }),
    emptyLine(120),
  ]
}

// Parse the structured AI response into DOCX elements
function parseResponse(text) {
  const children = []
  const sections = ss(text).split(/^~~~/m).filter(Boolean)

  sections.forEach(section => {
    const lines = section.trim().split('\n')
    const title = lines[0].trim()
    const body = lines.slice(1).join('\n').trim()
    if (title) children.push(secHeading(title))
    parseBodyTags(body, children)
    children.push(...notizfeld())
  })

  return children
}

function parseBodyTags(body, out) {
  const lines = body.split('\n')
  let i = 0
  let buf = []

  function flush() {
    if (buf.length) { out.push(...bodyBlock(buf.join('\n'))); buf = [] }
  }

  while (i < lines.length) {
    const l = lines[i]

    if (/^\[ZAHL:/.test(l)) {
      flush()
      const m = l.match(/\[ZAHL:(.+?)\]/)
      out.push(...bigNum(m[1], lines[i+1] || ''))
      i += 2; continue
    }

    if (l.trim() === '[PERSON-GRID-START]') {
      flush(); i++
      while (i < lines.length && lines[i].trim() !== '[PERSON-GRID-END]') {
        const m = lines[i].match(/\[PERSON-CARD:(.+)\]/)
        if (m) {
          const p = m[1].split('|')
          out.push(...personCard(p[0]||'', p[1]||'', p[2]||'',
            (p[5]||'').replace('LZ:',''), '', '', '',
            (p[6]||'').replace('Pinnacle:',''),
            (p[7]||'').replace('PersJahr:',''), ''))
        } else { buf.push(lines[i]) }
        i++
      }
      i++; continue
    }

    if (l.trim() === '[KARTEN-GRID-START]') {
      flush(); i++
      while (i < lines.length && lines[i].trim() !== '[KARTEN-GRID-END]') {
        const m = lines[i].match(/\[KARTE:(.+)\]/)
        if (m) { const p = m[1].split('|'); out.push(...infoCard(p[0]||'', p[1]||'', (p[2]||'') + '\n' + (p[3]||''))) }
        i++
      }
      i++; continue
    }

    if (/^\[DYNAMIK:/.test(l)) {
      flush()
      const m = l.match(/\[DYNAMIK:(.+)\]/)
      if (m) {
        const p = m[1].split('|')
        out.push(subHeading(p[0]||''), ...bigNum(p[1]||'', p[0]||''))
        out.push(new Paragraph({ children: [run('\u21d5\u21d5', { size: 36, color: C.rule })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }))
        out.push(...bigNum(p[3]||'', p[2]||''))
        if (p[4]) out.push(...bodyBlock(p[4]))
      }
      i++; continue
    }

    if (l.trim() === '[ASTRO-START]') {
      flush(); i++
      while (i < lines.length && lines[i].trim() !== '[ASTRO-END]') {
        const m = lines[i].match(/\[ASTRO:(.+)\]/)
        if (m) {
          const p = m[1].split('|')
          out.push(new Paragraph({ children: [run((p[0]||'') + '  ', { size: 32, color: C.goldL }), run(p[1]||'', { size: 26, bold: true })], spacing: { before: 200, after: 60 } }))
          if (p[2]) out.push(new Paragraph({ children: inlineRuns(p[2], 20), spacing: { after: 160 }, indent: { left: 360 } }))
        }
        i++
      }
      i++; continue
    }

    if (l.trim() === '[HS-START]') {
      flush(); i++
      let hT = '', sT = ''
      while (i < lines.length && lines[i].trim() !== '[HS-END]') {
        const hm = lines[i].match(/\[HERAUSFORDERUNG:(.+)\]/)
        const sm = lines[i].match(/\[SCHLUESSEL:(.+)\]/)
        if (hm) hT = hm[1]; if (sm) sT = sm[1]
        i++
      }
      out.push(...hsBlock(hT, sT)); i++; continue
    }

    if (/^\[JAHRES-TABELLE:/.test(l)) {
      flush()
      const m = l.match(/\[JAHRES-TABELLE:(.+)\]/)
      const headers = m ? m[1].split('|') : []
      const rows = []; i++
      while (i < lines.length && /^\[JAHR:/.test(lines[i])) {
        const jm = lines[i].match(/\[JAHR:(.+)\]/)
        if (jm) rows.push(jm[1].split('|'))
        i++
      }
      if (headers.length && rows.length) { out.push(jahresTab(headers, rows)); out.push(emptyLine(200)) }
      continue
    }

    if (/^\[PINNACLE:/.test(l)) {
      flush()
      const m = l.match(/\[PINNACLE:(.+)\]/)
      if (m) { const p = m[1].split('|'); out.push(...pinnacleCard(p[0],p[1],p[2],p[3],p[4]||'',p[5]||'')) }
      i++; continue
    }

    if (l.trim() === '[NAMEN-GRID-START]') {
      flush(); i++
      while (i < lines.length && lines[i].trim() !== '[NAMEN-GRID-END]') {
        const m = lines[i].match(/\[NAMEN-CARD:(.+)\]/)
        if (m) { const p = m[1].split('|'); out.push(...namenCard(p[0]||'',p[1]||'',p[2]||'',p[3]||'',p[4]||'',p[5]||'',p[6]||'',p[7]||'',p[8]||'')) }
        i++
      }
      i++; continue
    }

    if (/^\[ESSENZ:/.test(l)) {
      flush()
      const m = l.match(/\[ESSENZ:(.+)\]/)
      if (m) out.push(...essenzBlock(m[1]))
      i++; continue
    }

    buf.push(l); i++
  }
  flush()
}

// Title page
function titlePage(name1, name2) {
  return [
    emptyLine(1440),
    new Paragraph({ children: [run('Familien-Code', { size: 72, color: C.gold })], alignment: AlignmentType.CENTER, spacing: { after: 160 } }),
    new Paragraph({ children: [run('Astro & Numerologie  \u00b7  Persoenliche Analyse', { size: 26, italics: true, color: C.muted })], alignment: AlignmentType.CENTER, spacing: { after: 320 } }),
    ornament('\u2736   \u2736   \u2736'),
    new Paragraph({ children: [run(ss(name1), { size: 44, bold: true })], alignment: AlignmentType.CENTER, spacing: { after: name2 ? 80 : 240 } }),
    ...(name2 ? [
      new Paragraph({ children: [run('&', { size: 30, color: C.goldL })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }),
      new Paragraph({ children: [run(ss(name2), { size: 44, bold: true })], alignment: AlignmentType.CENTER, spacing: { after: 320 } }),
    ] : []),
    emptyLine(200),
    new Paragraph({ children: [run(new Date().toLocaleDateString('de-CH', { day: '2-digit', month: 'long', year: 'numeric' }), { size: 20, color: C.silver })], alignment: AlignmentType.CENTER, spacing: { after: 1440 } }),
    new Paragraph({ children: [run('herzbewegung.ch  \u00b7  Susana', { size: 18, italics: true, color: C.goldL })], alignment: AlignmentType.CENTER }),
    new Paragraph({ children: [new PageBreak()] }),
  ]
}

// TOC
function toc(sections) {
  return [
    secHeading('Inhalt dieser Analyse'),
    ...sections.map((s, i) => new Paragraph({
      children: [run(String(i+1).padStart(2,'0'), { size: 18, color: C.goldL }), run('   '), run(ss(s), { size: 22, color: C.muted })],
      spacing: { after: 100 },
    })),
    emptyLine(320),
    new Paragraph({ children: [run('Jede Sektion schliesst mit einem Notizfeld fuer Ergaenzungen.', { size: 18, italics: true, color: C.silver })], spacing: { after: 240 } }),
    new Paragraph({ children: [new PageBreak()] }),
  ]
}

// Glossar
function glossar() {
  const terms = [
    ['Lebenszahl', 'Aus dem vollstaendigen Geburtsdatum. Die wichtigste Zahl — zeigt Lebensaufgabe und spirituellen Entwicklungsweg.'],
    ['Seelendrang', 'Aus den Vokalen des Taufnamens. Was die Seele innerlich antreibt und ersehnt — das geheime Herzensbegehren.'],
    ['Persoenlichkeit', 'Aus den Konsonanten. Wie man nach aussen wirkt — das erste Bild, das andere empfangen.'],
    ['Ausdruckszahl', 'Alle Buchstaben des vollstaendigen Namens. Das Gesamtpotenzial — was gelebt und ausgedrueckt werden kann.'],
    ['Persoenliches Jahr', 'Jaehrlicher Energiezyklus 1-9. Beginnt am Geburtstag, nicht am 1. Januar. Zeigt das Thema des laufenden Jahres.'],
    ['Pinnacle', 'Laengere Lebensphase (7-27 Jahre) mit spezifischer Energie und Lernaufgabe. Vier Pinnacles im Laufe des Lebens.'],
    ['Challenge', 'Das Reibungsthema innerhalb eines Pinnacles. Das zentrale Wachstumsfeld dieser Lebensphase.'],
    ['Meisterzahl', '11, 22 oder 33. Wird nicht reduziert. Traegt erhoehtes Potenzial und erhoehte Anforderung.'],
    ['Beziehungscode', 'Summe der Lebenszahlen zweier Personen — zeigt die Kernenergie der gemeinsamen Verbindung.'],
    ['Kompatibilitaet', 'Numerologische Resonanz zwischen zwei Menschen. Zeigt Harmonie, Spannung und gemeinsame Lernfelder.'],
  ]
  return [
    new Paragraph({ children: [new PageBreak()] }),
    secHeading('Begriffe auf einen Blick'),
    ...terms.flatMap(([term, def]) => [
      new Paragraph({ children: [run(term, { size: 22, bold: true, color: C.rose })], spacing: { before: 160, after: 40 } }),
      new Paragraph({ children: inlineRuns(def, 20), spacing: { after: 120 }, indent: { left: 200 } }),
    ]),
    emptyLine(200),
  ]
}

// Notizseite
function notizSeite() {
  return [
    new Paragraph({ children: [new PageBreak()] }),
    secHeading('Persoenliche Notizseite'),
    ...Array(8).fill(null).flatMap(() => [
      new Paragraph({ children: [], spacing: { after: 400 }, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.rule } } }),
    ]),
    emptyLine(240),
    new Paragraph({ children: [run('herzbewegung.ch  \u00b7  Susana  \u00b7  ' + new Date().getFullYear(), { size: 16, italics: true, color: C.silver })], alignment: AlignmentType.CENTER }),
  ]
}

// ── MAIN ──
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { result, person1, person2, constellation } = req.body
  if (!result) return res.status(400).json({ error: 'No result text provided' })

  const hasPair = constellation === 'pair' || constellation === 'family'
  const hasKids = constellation === 'family' || constellation === 'solo_children'

  const n1 = person1?.firstName ? (person1.firstName + ' ' + (person1.lastName || '')).trim() : 'Analyse'
  const n2 = hasPair && person2?.firstName ? (person2.firstName + ' ' + (person2.lastName || '')).trim() : null

  const tocItems = [
    'Der zentrale Code',
    ...(hasPair ? ['Schlüsseldaten des Paares', 'Beziehungsdynamik', 'Astrologische Kernverbindungen'] : ['Persoenlicher Lebensweg', 'Namen-Energie']),
    ...(hasKids ? ['Die Kinder'] : []),
    ...(constellation === 'family' ? ['Das Familiensystem'] : []),
    'Herausforderung & Schlüssel',
    'Jahresenergien 2025-2030',
    'Pinnacles & Challenges',
    'Namen-Numerologie',
    'Die Essenz',
    '— Begriffe auf einen Blick',
    '— Persoenliche Notizseite',
  ]

  try {
    const doc = new Document({
      styles: { default: { document: { run: { font: 'Georgia', size: 22, color: C.ink } } } },
      sections: [{
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: [
          ...titlePage(n1, n2),
          ...toc(tocItems),
          ...parseResponse(result),
          ...glossar(),
          ...notizSeite(),
        ],
      }],
    })

    const buffer = await Packer.toBuffer(doc)
    const slug = n1.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    res.setHeader('Content-Disposition', 'attachment; filename="familien-code-' + slug + '.docx"')
    res.send(buffer)
  } catch (err) {
    console.error('DOCX error:', err)
    res.status(500).json({ error: err.message })
  }
}
