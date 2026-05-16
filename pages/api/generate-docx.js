// pages/api/generate-docx.js
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, ShadingType, WidthType,
  Table, TableRow, TableCell, PageBreak
} from 'docx'

function parseMarkdown(text) {
  const raw = text.split(/^\#\# /m).filter(Boolean)
  return raw.map(section => {
    const lines = section.split('\n')
    const heading = lines[0].trim()
    const body = lines.slice(1).join('\n').trim()
    return { heading, body }
  })
}

function makeTextRuns(line) {
  const runs = []
  const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g)
  parts.forEach(part => {
    if (part.startsWith('**') && part.endsWith('**')) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true, font: 'Georgia', size: 22 }))
    } else if (part.startsWith('*') && part.endsWith('*')) {
      runs.push(new TextRun({ text: part.slice(1, -1), italics: true, font: 'Georgia', size: 22, color: '8B4060' }))
    } else if (part) {
      runs.push(new TextRun({ text: part, font: 'Georgia', size: 22 }))
    }
  })
  return runs
}

function bodyToParagraphs(body) {
  const paras = []
  const blocks = body.split(/\n\n+/).filter(b => b.trim())
  blocks.forEach(block => {
    const lines = block.split('\n').filter(l => l.trim())
    lines.forEach(line => {
      paras.push(new Paragraph({ children: makeTextRuns(line), spacing: { after: 160, line: 320 } }))
    })
    paras.push(new Paragraph({ children: [], spacing: { after: 80 } }))
  })
  return paras
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { result, person1, person2, constellation, children } = req.body
  if (!result) return res.status(400).json({ error: 'No result text provided' })

  const sections = parseMarkdown(result)
  const docChildren = []

  docChildren.push(
    new Paragraph({ children: [new TextRun({ text: 'Familien-Code', font: 'Georgia', size: 56, bold: true, color: '9A7020' })], alignment: AlignmentType.CENTER, spacing: { before: 1440, after: 240 } }),
    new Paragraph({ children: [new TextRun({ text: 'Astro & Numerologie Analyse', font: 'Georgia', size: 28, italics: true, color: '6A5A50' })], alignment: AlignmentType.CENTER, spacing: { after: 240 } }),
    new Paragraph({ children: [new TextRun({ text: person1?.firstName ? (constellation !== 'solo' && person2?.firstName ? person1.firstName+' '+person1.lastName+' & '+person2.firstName+' '+person2.lastName : person1.firstName+' '+person1.lastName) : '', font: 'Georgia', size: 30, bold: true })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
    new Paragraph({ children: [new TextRun({ text: new Date().toLocaleDateString('de-CH', { day: '2-digit', month: 'long', year: 'numeric' }), font: 'Georgia', size: 22, color: '9A8A80' })], alignment: AlignmentType.CENTER, spacing: { after: 1440 } }),
    new Paragraph({ children: [new TextRun({ text: 'herzbewegung.ch · Susana', font: 'Georgia', size: 18, italics: true, color: 'C4962A' })], alignment: AlignmentType.CENTER }),
    new Paragraph({ children: [new PageBreak()] }),
  )

  sections.forEach((section, idx) => {
    docChildren.push(
      new Paragraph({ children: [new TextRun({ text: section.heading, font: 'Georgia', size: 32, bold: true, color: '8B4060' })], spacing: { before: idx === 0 ? 0 : 480, after: 160 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'F0E4C0', space: 4 } } })
    )
    docChildren.push(...bodyToParagraphs(section.body))
    docChildren.push(
      new Paragraph({ children: [new TextRun({ text: '[ Notizen / Ergänzungen für diese Klientin: ]', font: 'Georgia', size: 18, italics: true, color: 'BBBBBB' })], spacing: { before: 160, after: 320 }, border: { top: { style: BorderStyle.DASHED, size: 2, color: 'E0D0C0' }, bottom: { style: BorderStyle.DASHED, size: 2, color: 'E0D0C0' } } }),
      new Paragraph({ children: [], spacing: { after: 120 } }),
    )
  })

  try {
    const doc = new Document({
      styles: { default: { document: { run: { font: 'Georgia', size: 22, color: '1C1714' } } } },
      sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } }, children: docChildren }]
    })
    const buffer = await Packer.toBuffer(doc)
    const name = person1?.firstName ? `familien-code-${person1.firstName.toLowerCase().replace(/\s/g, '-')}.docx` : 'familien-code.docx'
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`)
    res.send(buffer)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
