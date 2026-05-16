(function() {
  function init() {

    // -- STATE ------------------------------------------------------
    const state = {
      constellation: '',
      focus: '',
      childCount: 1,
      lead: { name: '', email: '' },
      ancestry: {
        include: false,
        mother: {}, father: {},
        mgm: {}, mgf: {}, pgm: {}, pgf: {},
        themes: ''
      },  // Lead-Gate
    };

    // -- FLOW -------------------------------------------------------
    function getFlow() {
      const hasPair = state.constellation === 'pair' || state.constellation === 'family';
      const hasKids = state.constellation === 'family' || state.constellation === 'solo_children';
      let f = ['splash', 'constellation', 'person1'];
      if (hasPair) f.push('person2', 'couple');
      if (hasKids) f.push('children');
      f.push('ancestry', 'focus', 'loading', 'result');
      return f;
    }

    let cur = 'splash';

    function showScreen(id) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      const el = document.getElementById('screen-' + id);
      if (!el) return;
      el.classList.add('active');
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
      cur = id;
      window.scrollTo(0, 0);
      updateNav();
      if (id === 'ancestry') initAncestryToggles();
    }

    function updateNav() {
      const flow = getFlow();
      const idx = flow.indexOf(cur);
      const prog = document.getElementById('nav-progress');
      const steps = flow.filter(s => !['splash', 'lead', 'loading', 'result'].includes(s));
      if (['splash', 'loading', 'result'].includes(cur)) {
        prog.innerHTML = '';
      } else {
        prog.innerHTML = steps.map((s) => {
          const si = flow.indexOf(s);
          let cls = 'nav-step';
          if (si < idx) cls += ' done';
          else if (si === idx) cls += ' active';
          return `<div class="${cls}"></div>`;
        }).join('');
      }
      const resetBtn = document.getElementById('nav-reset');
      if (resetBtn) resetBtn.style.display = (cur !== 'splash') ? '' : 'none';
    }

    function goNext() {
      const f = getFlow(), i = f.indexOf(cur);
      if (i < f.length - 1) showScreen(f[i + 1]);
    }

    function goBack() {
      const f = getFlow(), i = f.indexOf(cur);
      if (i > 0) showScreen(f[i - 1]);
    }

    // -- ANCESTRY HELPERS ------------------------------------------
    function getAncestor(key) {
      function v(suffix) { return (document.getElementById('ancestor-' + key + '-' + suffix) || {}).value || ''; }
      return {
        firstName: v('firstname'),
        lastName: v('lastname'),
        birthPlace: v('place'),
        birthCountry: v('country'),
        day: v('day'),
        month: v('month'),
        year: v('year'),
        hour: v('hour'),
        minute: v('minute'),
      };
    }

    function getAncestry() {
      var themes = (document.getElementById('ancestry-themes') || {}).value || '';
      return {
        include: state.ancestry.include,
        mother: getAncestor('mother'),
        father: getAncestor('father'),
        maternalGrandmother: getAncestor('mgm'),
        maternalGrandfather: getAncestor('mgf'),
        paternalGrandmother: getAncestor('pgm'),
        paternalGrandfather: getAncestor('pgf'),
        themes: themes,
      };
    }

    function toggleAncestry() {
      state.ancestry.include = !state.ancestry.include;
      var card = document.getElementById('ancestry-toggle-card');
      var fields = document.getElementById('ancestry-fields');
      var circle = document.getElementById('ancestry-check-circle');
      var skipBtn = document.getElementById('btn-ancestry-skip');
      if (card) card.style.background = state.ancestry.include ? 'var(--gold-pp, #fdf9f0)' : '';
      if (card) card.style.borderColor = state.ancestry.include ? 'var(--gold-l, #c4962a)' : '';
      if (fields) fields.style.display = state.ancestry.include ? '' : 'none';
      if (circle) circle.innerHTML = state.ancestry.include ? '<span style="color:white;font-size:14px">✓</span>' : '';
      if (circle) circle.style.background = state.ancestry.include ? 'var(--gold, #9a7020)' : 'var(--gold-p, #f0e4c0)';
      if (skipBtn) skipBtn.style.display = state.ancestry.include ? 'none' : '';
    }

    function initAncestryToggles() {
      ['mother', 'father', 'mgm', 'mgf', 'pgm', 'pgf'].forEach(function(key) {
        var toggle = document.getElementById('ancestor-toggle-' + key);
        if (!toggle) return;
        toggle.onclick = function() {
          var fields = document.getElementById('ancestor-fields-' + key);
          var arrow = document.getElementById('ancestor-arrow-' + key);
          var open = fields && fields.style.display !== 'none';
          if (fields) fields.style.display = open ? 'none' : '';
          if (arrow) arrow.textContent = open ? '▾' : '▴';
          // Update sub label
          var fn = (document.getElementById('ancestor-' + key + '-firstname') || {}).value || '';
          var ln = (document.getElementById('ancestor-' + key + '-lastname') || {}).value || '';
          var place = (document.getElementById('ancestor-' + key + '-place') || {}).value || '';
          var sub = document.getElementById('ancestor-sub-' + key);
          var subText = (fn + ' ' + ln).trim();
          if (subText && place) subText += ', ' + place;
          if (sub) sub.textContent = subText || 'Tippe hier um Angaben zu machen';
        };
      });
    }

    // -- DOCX DOWNLOAD ---------------------------------------------
    async function downloadDocx() {
      var btn = document.getElementById('btn-download-docx');
      if (btn) { btn.disabled = true; btn.textContent = 'Wird erstellt...'; }
      try {
        var p1 = getPerson('p1');
        var hasPair = state.constellation === 'pair' || state.constellation === 'family';
        var p2 = hasPair ? getPerson('p2') : null;
        var hasKids = state.constellation === 'family' || state.constellation === 'solo_children';
        var kids = hasKids ? getChildren() : [];
        var ancestry = getAncestry();
        var resultText = document.getElementById('result-body') ? document.getElementById('result-body').dataset.rawText || '' : '';

        var res = await fetch('/api/generate-docx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            result: resultText,
            person1: p1,
            person2: p2,
            constellation: state.constellation,
            children: kids,
            ancestry: ancestry,
          })
        });
        if (!res.ok) throw new Error('DOCX Fehler');
        var blob = await res.blob();
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'familien-code-' + (p1.firstName || 'analyse').toLowerCase().replace(/\s+/g, '-') + '.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch(err) {
        alert('Fehler beim Erstellen: ' + err.message);
      }
      if (btn) { btn.disabled = false; btn.textContent = '↓ Als Word-Dokument (editierbar)'; }
    }



    // -- CARDS ------------------------------------------------------
    function selectCard(el, type) {
      el.closest('[class*="card-grid"]').querySelectorAll('.select-card').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
      if (type === 'constellation') {
        state.constellation = el.dataset.value;
        const btn = document.getElementById('btn-constellation-next');
        if (btn) btn.disabled = false;
      } else if (type === 'focus') {
        state.focus = el.dataset.value;
        const btn = document.getElementById('btn-focus-next');
        if (btn) btn.disabled = false;
      }
    }

    // -- LEAD GATE --------------------------------------------------
    function validateLead() {
      const name = document.getElementById('lead-name')?.value.trim();
      const email = document.getElementById('lead-email')?.value.trim();
      const btn = document.getElementById('btn-lead-next');
      if (!btn) return;
      const valid = name && email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      btn.disabled = !valid;
    }

    function submitLead() { goNext(); }

    // -- COMPATIBILITY NUMBER ----------------------------------------
    function compatNum(lz1, lz2) {
      if (!lz1 || !lz2 || lz1 === 'n/a' || lz2 === 'n/a') return 'n/a';
      const sum = Number(lz1) + Number(lz2);
      return red(sum);
    }

    // -- NAME CHANGE ANALYSIS ----------------------------------------
    function nameChangeBlock(prefix, label) {
      const firstName = val(`${prefix}-newname-first`);
      const lastName = val(`${prefix}-newname-last`);
      if (!firstName && !lastName) return '';
      const full = `${firstName} ${lastName}`.trim();
      const n = nameNums(full);
      return `\n${label} -- NEUER NAME: ${full}\n- Neue Ausdruckszahl: ${n.expression}\n- Neue Persönlichkeitszahl: ${n.personality}\n- Neue Seelendrang-Zahl: ${n.soul}`;
    }
    function toggleField(inputId, toggleId) {
      const input = document.getElementById(inputId);
      const box = document.getElementById(toggleId);
      if (!input || !box) return;
      const on = box.classList.toggle('on');
      input.disabled = on;
      if (on) input.value = '';
    }

    // -- FORMS ------------------------------------------------------
    function personFormHTML(prefix) {
      return `
        <div class="field-row">
          <div class="field-group">
            <label class="field-label">Vorname/n (Taufname)</label>
            <input class="field-input" id="${prefix}-firstname" placeholder="Taufname/n" />
          </div>
          <div class="field-group">
            <label class="field-label">Nachname</label>
            <input class="field-input" id="${prefix}-lastname" placeholder="Nachname" />
          </div>
        </div>
        <div class="field-row-3">
          <div class="field-group">
            <label class="field-label">Geburtsdatum (TT.MM.JJJJ)</label>
            <input class="field-input" id="${prefix}-birthdate" placeholder="15.03.1988" />
          </div>
          <div class="field-group">
            <label class="field-label">Geburtszeit (HH:MM)</label>
            <input class="field-input" id="${prefix}-birthtime" placeholder="14:30" />
            <div class="toggle-row" data-toggle-input="${prefix}-birthtime" data-toggle-id="${prefix}-notime">
              <div class="toggle-box" id="${prefix}-notime"></div>
              <span class="toggle-label">Unbekannt</span>
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">Geburtsort</label>
            <input class="field-input" id="${prefix}-birthplace" placeholder="Stadt, Land" />
          </div>
        </div>`;
    }

    function childBlockHTML(i) {
      const p = `child${i}`;
      return `
        <div class="child-block" id="child-block-${i}">
          <div class="child-block-header">
            <div class="child-block-title">Kind ${i + 1}</div>
            ${i > 0 ? `<button class="btn-remove" data-remove-child="${i}">×</button>` : ''}
          </div>
          <div class="field-row">
            <div class="field-group">
              <label class="field-label">Vorname/n (Taufname)</label>
              <input class="field-input" id="${p}-firstname" placeholder="Taufname/n" />
            </div>
            <div class="field-group">
              <label class="field-label">Nachname</label>
              <input class="field-input" id="${p}-lastname" placeholder="Nachname" />
            </div>
          </div>
          <div class="field-row-3">
            <div class="field-group">
              <label class="field-label">Geburtsdatum (TT.MM.JJJJ)</label>
              <input class="field-input" id="${p}-birthdate" placeholder="15.03.2015" />
            </div>
            <div class="field-group">
              <label class="field-label">Geburtszeit (HH:MM)</label>
              <input class="field-input" id="${p}-birthtime" placeholder="14:30" />
              <div class="toggle-row" data-toggle-input="${p}-birthtime" data-toggle-id="${p}-notime">
                <div class="toggle-box" id="${p}-notime"></div>
                <span class="toggle-label">Unbekannt</span>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Geburtsort</label>
              <input class="field-input" id="${p}-birthplace" placeholder="Stadt, Land" />
            </div>
          </div>
        </div>`;
    }

    function addChild() {
      if (state.childCount >= 5) return;
      const container = document.getElementById('children-container');
      if (container) {
        container.insertAdjacentHTML('beforeend', childBlockHTML(state.childCount));
      }
      state.childCount++;
      const btn = document.getElementById('btn-add-child');
      if (btn) btn.style.display = state.childCount >= 5 ? 'none' : '';
    }

    function removeChild(i) {
      const block = document.getElementById('child-block-' + i);
      if (block) block.remove();
      state.childCount = Math.max(1, state.childCount - 1);
      const btn = document.getElementById('btn-add-child');
      if (btn) btn.style.display = '';
    }

    // -- HELPERS ----------------------------------------------------
    function val(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
    function isOn(id) { const el = document.getElementById(id); return el ? el.classList.contains('on') : false; }
    function getPerson(prefix) {
      return {
        firstName: val(`${prefix}-firstname`),
        lastName: val(`${prefix}-lastname`),
        birthDate: val(`${prefix}-birthdate`),
        birthTime: isOn(`${prefix}-notime`) ? 'unbekannt' : (val(`${prefix}-birthtime`) || 'unbekannt'),
        birthPlace: val(`${prefix}-birthplace`)
      };
    }
    function getChildren() {
      const out = [];
      for (let i = 0; i < state.childCount; i++) {
        if (document.getElementById(`child-block-${i}`)) out.push(getPerson(`child${i}`));
      }
      return out;
    }

    // -- NUMEROLOGIE ------------------------------------------------
    const LM = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9, J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9, S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8 };
    const VO = new Set(['A', 'E', 'I', 'O', 'U']);
    function red(n) { if (n === 11 || n === 22 || n === 33) return n; if (n < 10) return n; return red(String(n).split('').reduce((a, d) => a + parseInt(d), 0)); }
    function lifeNum(d) { if (!d) return 'n/a'; const dg = d.replace(/\D/g, ''); if (!dg) return 'n/a'; return red(dg.split('').reduce((a, c) => a + parseInt(c), 0)); }
    function nameNums(full) { const c = full.toUpperCase().replace(/[^A-Z]/g, ''); let s = 0, p = 0, e = 0; for (const ch of c) { const v = LM[ch] || 0; e += v; if (VO.has(ch)) s += v; else p += v; } return { soul: red(s) || 'n/a', personality: red(p) || 'n/a', expression: red(e) || 'n/a' }; }
    function persYear(d) { if (!d) return 'n/a'; const pt = d.split('.'); if (pt.length < 2) return 'n/a'; return red(parseInt(pt[0]) + parseInt(pt[1]) + 9); }
    function zodiac(d) {
      if (!d) return 'unbekannt';
      const pt = d.split('.'); if (pt.length < 2) return 'unbekannt';
      const day = parseInt(pt[0]), mo = parseInt(pt[1]);
      // [cutoff_day, month, sign_if_day_<=_cutoff, sign_if_day_>_cutoff]
      const s = [
        [19, 1, 'Steinbock', 'Wassermann'],
        [18, 2, 'Wassermann', 'Fische'],
        [20, 3, 'Fische', 'Widder'],
        [19, 4, 'Widder', 'Stier'],
        [20, 5, 'Stier', 'Zwillinge'],
        [20, 6, 'Zwillinge', 'Krebs'],
        [22, 7, 'Krebs', 'Löwe'],
        [22, 8, 'Löwe', 'Jungfrau'],
        [22, 9, 'Jungfrau', 'Waage'],
        [22, 10, 'Waage', 'Skorpion'],
        [21, 11, 'Skorpion', 'Schütze'],
        [21, 12, 'Schütze', 'Steinbock'],
      ];
      const row = s.find(r => r[1] === mo);
      if (!row) return 'unbekannt';
      return day <= row[0] ? row[2] : row[3];
    }
    function personBlock(p, label) {
      if (!p.firstName) return '';
      const full = `${p.firstName} ${p.lastName}`.trim();
      const n = nameNums(full);
      return `\n${label}: ${full}\n- Geburtsdatum: ${p.birthDate || 'unbekannt'}\n- Geburtszeit: ${p.birthTime || 'unbekannt'}\n- Geburtsort: ${p.birthPlace || 'unbekannt'}\n- Lebenszahl: ${lifeNum(p.birthDate)}\n- Seelendrang: ${n.soul}\n- Persönlichkeitszahl: ${n.personality}\n- Ausdruckszahl: ${n.expression}\n- Persönliches Jahr 2025: ${persYear(p.birthDate)}\n- Sternzeichen: ${zodiac(p.birthDate)}`;
    }

    // -- PROMPT -----------------------------------------------------
    function buildPrompt() {
      const hasPair = state.constellation === 'pair' || state.constellation === 'family';
      const hasKids = state.constellation === 'family' || state.constellation === 'solo_children';
      const p1 = getPerson('p1'), p2 = hasPair ? getPerson('p2') : null;

      // Kompatibilitätszahl
      let compatBlock = '';
      if (hasPair && p2) {
        const lz1 = lifeNum(p1.birthDate);
        const lz2 = lifeNum(p2.birthDate);
        const compat = compatNum(lz1, lz2);
        compatBlock = `\nKOMPATIBILITÄTSZAHL (Beziehungscode): ${compat} (${lz1} + ${lz2} → ${compat})`;
      }

      // Namenswechsel
      const nc1 = nameChangeBlock('p1', 'PERSON 1');
      const nc2 = hasPair ? nameChangeBlock('p2', 'PERSON 2') : '';
      const hasNameChange = nc1 || nc2;

      let coupleBlock = '';
      if (hasPair) {
        const meet = val('meet-date'), wed = val('wedding-date');
        if (meet || wed) {
          coupleBlock = '\nSCHLÜSSELDATEN:';
          if (meet) coupleBlock += `\n- Kennenlernen: ${meet} → Code: ${lifeNum(meet.replace(/\./g, ''))}`;
          if (wed) coupleBlock += `\n- Hochzeit: ${wed} → Code: ${lifeNum(wed.replace(/\./g, ''))}`;
        }
      }
      const kids = hasKids ? getChildren().map((c, i) => personBlock(c, `KIND ${i + 1}`)).join('\n') : '';

      // Pre-compute name numerology (vollständig, Vorname, Nachname einzeln)
      function calcNameNums(firstName, lastName) {
        if (!firstName) return null;
        const full = `${firstName} ${lastName}`.trim();
        const nFull = nameNums(full);
        const nVor = nameNums(firstName);
        const nNach = lastName ? nameNums(lastName) : null;
        return { firstName, lastName, full, nFull, nVor, nNach };
      }
      function nameNumsText(nn, label) {
        if (!nn) return '';
        return `NAMEN-NUMEROLOGIE ${label}:
- Vollständiger Name (${nn.full}): Seelendrang=${nn.nFull.soul}, Persönlichkeit=${nn.nFull.personality}, Ausdruck=${nn.nFull.expression}
- Vorname (${nn.firstName}): Seelendrang=${nn.nVor.soul}, Persönlichkeit=${nn.nVor.personality}, Ausdruck=${nn.nVor.expression}${nn.nNach ? `\n- Nachname (${nn.lastName}): Seelendrang=${nn.nNach.soul}, Persönlichkeit=${nn.nNach.personality}, Ausdruck=${nn.nNach.expression}` : ''}`;
      }
      const nn1 = calcNameNums(p1.firstName, p1.lastName);
      const nn2 = hasPair && p2 ? calcNameNums(p2.firstName, p2.lastName) : null;
      const nnKids = hasKids ? getChildren().map(c => calcNameNums(c.firstName, c.lastName)) : [];

      var sektionen = '1. Der zentrale Code -- mit [ZAHL:X] fuer den Haupt-Code\n';
      if (hasPair) {
        sektionen += '2. Schlüsseldaten des Paares -- mit [KARTEN-GRID-START/END]\n3. Beziehungsdynamik -- mit [DYNAMIK:]\n4. Astrologische Kernverbindungen -- mit [ASTRO-START/END]\n';
      } else {
        sektionen += '2. Persoenlicher Lebensweg\n3. Namen-Energie -- mit [NAMEN-GRID-START/END]\n';
      }
      if (hasKids) sektionen += '5. Die Kinder -- mit [PERSON-GRID-START/END] pro Kind\n';
      if (state.constellation === 'family') sektionen += '6. Das Familiensystem -- Fliesstext\n';
      sektionen += '7. Herausforderung & Schlüssel -- mit [HS-START/END]\n';
      sektionen += '8. Jahresenergien 2025-2030 -- mit [JAHRES-TABELLE:' + [p1.firstName, hasPair && p2 && p2.firstName ? p2.firstName : null].filter(Boolean).join('|') + '] und Zeilen [JAHR:2025|Zahl·Keyword' + (hasPair ? '|Zahl·Keyword' : '') + ']\n';
      sektionen += '9. Pinnacles & Challenges -- mit [PINNACLE:Person|Nr|Zeitraum|Zahl|Beschreibung|Challenge]\n';
      sektionen += '10. Namen-Numerologie -- mit [NAMEN-GRID-START/END]\n';
      var ancestry = getAncestry();
      var esNum = 11;
      if (ancestry.include) { sektionen += esNum + '. Die Ahnenlinie -- Lebenszahlen der Vorfahren, Muster, Systemisches\n'; esNum++; }
      if (hasNameChange) { sektionen += esNum + '. Namenswechsel & seine Energie\n'; esNum++; }
      sektionen += esNum + '. Die Essenz -- mit [ESSENZ:Ein einziger Satz der alles zusammenfasst]';

      var ancestryBlock = '';
      if (ancestry.include) {
        ancestryBlock = '\nAHNENLINIE:';
        var aKeys = ['mother', 'father', 'maternalGrandmother', 'maternalGrandfather', 'paternalGrandmother', 'paternalGrandfather'];
        var aLabels = ['Mutter', 'Vater', 'Grossmutter mütterlicherseits', 'Grossvater mütterlicherseits', 'Grossmutter väterlicherseits', 'Grossvater väterlicherseits'];
        aKeys.forEach(function(k, i) {
          var a = ancestry[k] || getAncestor(k === 'maternalGrandmother' ? 'mgm' : k === 'maternalGrandfather' ? 'mgf' : k === 'paternalGrandmother' ? 'pgm' : k === 'paternalGrandfather' ? 'pgf' : k);
          if (a && a.firstName) {
            ancestryBlock += '\n- ' + aLabels[i] + ': ' + a.firstName + (a.lastName ? ' ' + a.lastName : '');
            if (a.birthPlace) ancestryBlock += ', Geburtsort: ' + a.birthPlace;
            if (a.birthCountry) ancestryBlock += ', Herkunft: ' + a.birthCountry;
            if (a.day && a.month && a.year) {
              ancestryBlock += ', *' + a.day + '.' + a.month + '.' + a.year;
              if (a.hour) ancestryBlock += ' um ' + a.hour + ':' + (a.minute || '00') + ' Uhr';
            }
          }
        });
        if (ancestry.themes) ancestryBlock += '\nWiederkehrende Familienthemen: ' + ancestry.themes;
      }

      return 'Du bist eine erfahrene Astrologin. Schweizer Hochdeutsch. Kein scharfes S (kein ß) -- immer ss. Tiefe persoenliche Analyse, direkt mit du.\n\n'
        + 'KONSTELLATION: ' + state.constellation + '\nFOKUS: ' + state.focus + '\n'
        + personBlock(p1, 'PERSON 1') + '\n'
        + (p2 ? personBlock(p2, 'PERSON 2') + '\n' : '')
        + compatBlock + '\n' + coupleBlock + '\n' + kids + '\n' + nc1 + nc2 + '\n'
        + '\nNAMEN-NUMEROLOGIE (vorberechnet -- exakt verwenden):\n'
        + nameNumsText(nn1, 'PERSON 1') + '\n'
        + (nn2 ? nameNumsText(nn2, 'PERSON 2') + '\n' : '')
        + nnKids.map(function(nn, i) { return nameNumsText(nn, 'KIND ' + (i+1)); }).join('\n') + '\n'
        + '\nStruktur: Sektionen mit ~~~ trennen. Titel, dann Zeilenumbruch, dann Inhalt.\n'
        + 'Tags: [ZAHL:X] [PERSON-GRID-START/END] [PERSON-CARD:Label|Name|Datum|Stern|Desc|LZ:X|Pinnacle:X|PersJahr:X] [KARTEN-GRID-START/END] [KARTE:EB|Titel|Sub|Desc] [DYNAMIK:L1|Z1|L2|Z2|Text] [ASTRO-START/END] [ASTRO:Sym|Titel|Text] [HS-START/END] [HERAUSFORDERUNG:Text] [SCHLUESSEL:Text] [PINNACLE:Person|Nr|Zeit|Z|Desc|Challenge] [NAMEN-GRID-START/END] [NAMEN-CARD:Name|Rolle|SD-Z|SD-L|P-Z|P-L|E-Z|E-L|Desc] [ESSENZ:Text]\n'
        + '\nSektionen:\n' + sektionen + '\n\n'
        + 'Tief, praezise, persoenlich. Pers. Jahr beginnt am Geburtstag.';
    }

    // -- LOADING CYCLE ----------------------------------------------
    const LT = ['Lebenszahlen werden ermittelt…', 'Astrologische Verbindungen werden gewoben…', 'Seelenlandschaft entfaltet sich…'];
    let li = null, lx = 0;
    function startLoader() {
      lx = 0;
      const el = document.getElementById('loading-sub');
      if (el) el.textContent = LT[0];
      li = setInterval(() => {
        const sub = document.getElementById('loading-sub');
        if (!sub) return;
        sub.classList.add('hidden');
        setTimeout(() => {
          lx = (lx + 1) % LT.length;
          sub.textContent = LT[lx];
          sub.classList.remove('hidden');
        }, 400);
      }, 2200);
    }
    function stopLoader() { if (li) { clearInterval(li); li = null; } }

    // -- API CALL ---------------------------------------------------
    async function startAnalysis() {
      showScreen('loading');
      startLoader();
      const p1 = getPerson('p1'), p2 = getPerson('p2');
      const hasPair = state.constellation === 'pair' || state.constellation === 'family';
      let name = p1.firstName || 'Deine Analyse';
      if (hasPair && p2 && p2.firstName) name += ' & ' + p2.firstName;
      const nameEl = document.getElementById('result-name');
      if (nameEl) nameEl.textContent = name;
      try {
        let promptText;
        try {
          promptText = buildPrompt();
        } catch(promptErr) {
          throw new Error('Prompt-Fehler: ' + promptErr.message);
        }
        if (!promptText) throw new Error('Prompt ist leer');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 55000);
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: promptText }],
            lead: { name: state.lead.name, email: '', constellation: state.constellation, focus: state.focus },
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error('API ' + res.status + ': ' + (errData.error?.message || errData.message || res.statusText));
        }
        const data = await res.json();
        if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
        stopLoader();
        const text = (data.content && data.content[0] && data.content[0].text) ? data.content[0].text : '';
        if (!text) throw new Error('Keine Antwort von Claude erhalten');
        renderResult(text);
      } catch (err) {
        stopLoader();
        renderError(err.message || 'Unbekannter Fehler');
      }
      showScreen('result');
    }

    // -- RENDER RESULT ----------------------------------------------
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    // Parses inline markdown AFTER escaping -- works on already-escaped text
    // so we inject safe HTML tags back in
    function parseMarkdown(escapedText) {
      return escapedText
        // **bold** → <strong>
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // *italic* or _italic_ (not double-star)
        .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        // ~~strikethrough~~ (uncommon but possible)
        .replace(/~~(.+?)~~/g, '<del>$1</del>');
    }

    function parseInlineMarkers(text) {
      // [ZAHL:X] → big number display
      text = text.replace(/\[ZAHL:([^\]]+)\]/g, (_, z) =>
        `<div class="res-big-zahl">${esc(z)}</div>`);
      return text;
    }

    function parseBlock(block) {
      let out = '';
      const lines = block.split('\n');
      let i = 0;

      while (i < lines.length) {
        const line = lines[i].trim();

        // PERSON-GRID
        if (line === '[PERSON-GRID-START]') {
          let cards = [];
          i++;
          while (i < lines.length && lines[i].trim() !== '[PERSON-GRID-END]') {
            const m = lines[i].trim().match(/^\[PERSON-CARD:(.+)\]$/);
            if (m) {
              const [label, name, datum, stern, desc, lz, pin, pj] = m[1].split('|');
              const lzNum = (lz||'').replace('LZ:','');
              const pinNum = (pin||'').replace('Pinnacle:','');
              const pjNum = (pj||'').replace('PersJahr:','');
              cards.push(`<div class="res-person-card">
                <div class="res-pc-label">${esc(label||'')}</div>
                <div class="res-pc-zahl">${esc(lzNum)}</div>
                <div class="res-pc-datum">${esc(datum||'')}</div>
                <div class="res-pc-stern">${esc(stern||'')}</div>
                <div class="res-pc-desc">${parseMarkdown(esc(desc||''))}</div>
                <div class="res-pc-stats">
                  ${lzNum ? `<div class="res-pc-stat"><div class="res-pc-stat-val">${esc(lzNum)}</div><div class="res-pc-stat-label">Lebenszahl</div></div>` : ''}
                  ${pinNum ? `<div class="res-pc-stat"><div class="res-pc-stat-val">${esc(pinNum)}</div><div class="res-pc-stat-label">Pinnacle (Jetzt)</div></div>` : ''}
                  ${pjNum ? `<div class="res-pc-stat"><div class="res-pc-stat-val">${esc(pjNum)}</div><div class="res-pc-stat-label">Pers. Jahr 2025</div></div>` : ''}
                </div>
              </div>`);
            }
            i++;
          }
          out += `<div class="res-person-grid">${cards.join('')}</div>`;
          i++;
          continue;
        }

        // KARTEN-GRID
        if (line === '[KARTEN-GRID-START]') {
          let cards = [];
          i++;
          while (i < lines.length && lines[i].trim() !== '[KARTEN-GRID-END]') {
            const m = lines[i].trim().match(/^\[KARTE:(.+)\]$/);
            if (m) {
              const [eyebrow, titel, untertitel, desc] = m[1].split('|');
              cards.push(`<div class="res-karte">
                <div class="res-karte-eyebrow">${esc(eyebrow||'')}</div>
                <div class="res-karte-zahl">${esc(untertitel||'')}</div>
                <div class="res-karte-titel">${esc(titel||'')}</div>
                <div class="res-karte-desc">${esc(desc||'')}</div>
              </div>`);
            }
            i++;
          }
          out += `<div class="res-karten-grid">${cards.join('')}</div>`;
          i++;
          continue;
        }

        // DYNAMIK
        if (line.startsWith('[DYNAMIK:')) {
          const m = line.match(/^\[DYNAMIK:(.+)\]$/);
          if (m) {
            const [sieLabel, sieZahl, erLabel, erZahl, resonanz] = m[1].split('|');
            out += `<div class="res-dynamik">
              <div class="res-dyn-pole">
                <div class="res-dyn-pole-item">
                  <div class="res-dyn-zahl">${esc(sieZahl||'')}</div>
                  <div class="res-dyn-label">${esc(sieLabel||'')}</div>
                </div>
                <div class="res-dyn-arrows">⇅<div class="res-dyn-resonanz">${esc(resonanz||'RESONANZ')}</div>⇅</div>
                <div class="res-dyn-pole-item">
                  <div class="res-dyn-zahl">${esc(erZahl||'')}</div>
                  <div class="res-dyn-label">${esc(erLabel||'')}</div>
                </div>
              </div>
            </div>`;
          }
          i++;
          continue;
        }

        // ASTRO
        if (line === '[ASTRO-START]') {
          let items = [];
          i++;
          while (i < lines.length && lines[i].trim() !== '[ASTRO-END]') {
            const m = lines[i].trim().match(/^\[ASTRO:(.+)\]$/);
            if (m) {
              const [symbol, titel, text] = m[1].split('|');
              items.push(`<div class="res-astro-item">
                <div class="res-astro-symbol">${esc(symbol||'')}</div>
                <div class="res-astro-body">
                  <div class="res-astro-titel">${esc(titel||'')}</div>
                  <div class="res-astro-text">${parseMarkdown(esc(text||''))}</div>
                </div>
              </div>`);
            }
            i++;
          }
          out += `<div class="res-astro-list">${items.join('')}</div>`;
          i++;
          continue;
        }

        // HS (Herausforderung & Schlüssel)
        if (line === '[HS-START]') {
          let heraus = [], schluessel = [];
          i++;
          while (i < lines.length && lines[i].trim() !== '[HS-END]') {
            const l = lines[i].trim();
            const mh = l.match(/^\[HERAUSFORDERUNG:(.+)\]$/);
            const ms = l.match(/^\[SCHLUESSEL:(.+)\]$/);
            if (mh) heraus.push(mh[1]);
            if (ms) schluessel.push(ms[1]);
            i++;
          }
          out += `<div class="res-hs-grid">
            <div class="res-hs-col res-hs-challenge">
              <div class="res-hs-header">Herausforderung</div>
              ${heraus.map(h => `<div class="res-hs-item">-- ${parseMarkdown(esc(h))}</div>`).join('')}
            </div>
            <div class="res-hs-col res-hs-key">
              <div class="res-hs-header">Schlüssel</div>
              ${schluessel.map(s => `<div class="res-hs-item">-- ${parseMarkdown(esc(s))}</div>`).join('')}
            </div>
          </div>`;
          i++;
          continue;
        }

        // JAHRES-TABELLE
        if (line.startsWith('[JAHRES-TABELLE:')) {
          const m = line.match(/^\[JAHRES-TABELLE:(.+)\]$/);
          // Filter out empty header slots (empty string or just whitespace)
          const allHeaders = m ? m[1].split('|') : [];
          const headers = allHeaders.filter(h => h.trim() !== '');
          const activeCols = headers.length; // how many real person columns
          let rows = [];
          i++;
          while (i < lines.length && lines[i].trim().startsWith('[JAHR:')) {
            const rm = lines[i].trim().match(/^\[JAHR:(.+)\]$/);
            if (rm) {
              const allCells = rm[1].split('|');
              // Keep year + only as many data cells as we have headers
              const year = allCells[0];
              const cells = allCells.slice(1, activeCols + 1)
                .filter((c, idx) => {
                  // Only include if header exists for this column
                  return headers[idx] && headers[idx].trim() !== '';
                });
              rows.push([year, ...cells]);
            }
            i++;
          }
          out += `<div class="res-tabelle-wrap"><table class="res-tabelle">
            <thead><tr>
              <th>Jahr</th>
              ${headers.map(h => `<th>${esc(h)}</th>`).join('')}
            </tr></thead>
            <tbody>
              ${rows.map((r, ri) => `<tr class="${ri === 0 ? 'res-row-now' : ''}">
                <td class="res-jahr-cell">${esc(r[0]||'')}</td>
                ${r.slice(1).map(cell => {
                  const trimmed = cell.trim();
                  // Skip dash-only cells
                  if (!trimmed || trimmed === '--' || trimmed === '-' || trimmed === '–') {
                    return '<td><span class="res-tab-zahl" style="color:var(--gold-pale)">--</span></td>';
                  }
                  const parts = trimmed.split('·');
                  const num = parts[0] ? parts[0].trim() : '';
                  const kw = parts[1] ? parts[1].trim() : '';
                  return `<td><span class="res-tab-zahl">${esc(num)}</span>${kw ? `<span class="res-tab-kw">${esc(kw)}</span>` : ''}</td>`;
                }).join('')}
              </tr>`).join('')}
            </tbody>
          </table></div>`;
          continue;
        }

        // PINNACLE
        if (line.startsWith('[PINNACLE:')) {
          const m = line.match(/^\[PINNACLE:(.+)\]$/);
          if (m) {
            const [person, nummer, zeitraum, zahl, beschreibung, challenge] = m[1].split('|');
            out += `<div class="res-pinnacle">
              <div class="res-pin-zahl">${esc(zahl||'')}</div>
              <div class="res-pin-body">
                <div class="res-pin-header">
                  <span class="res-pin-num">${esc(nummer||'')}. Pinnacle</span>
                  <span class="res-pin-zeit">${esc(zeitraum||'')}</span>
                  ${person ? `<span class="res-pin-person">${esc(person)}</span>` : ''}
                </div>
                <div class="res-pin-desc">${parseMarkdown(esc(beschreibung||''))}</div>
                ${challenge ? `<div class="res-pin-challenge">Challenge: ${esc(challenge)}</div>` : ''}
              </div>
            </div>`;
          }
          i++;
          continue;
        }

        // NAMEN-GRID
        if (line === '[NAMEN-GRID-START]') {
          let cards = [];
          i++;
          while (i < lines.length && lines[i].trim() !== '[NAMEN-GRID-END]') {
            const m = lines[i].trim().match(/^\[NAMEN-CARD:(.+)\]$/);
            if (m) {
              const [nameRaw, rolle, sdZ, sdL, pZ, pL, ausZ, ausL, desc] = m[1].split('|');
              // Strip letter-by-letter hyphens ("M-A-U-R-O" → "MAURO"), keep normal word hyphens
              const name = (nameRaw||'').replace(/(?<=[A-ZÄÖÜ])-(?=[A-ZÄÖÜ])/g, '').replace(/(?<=[a-zäöü])-(?=[a-zäöü])/g, '');
              const isDash = v => !v || v.trim() === '--' || v.trim() === '-' || v.trim() === '';
              const zahlenItems = [
                { z: sdZ, zl: 'Seelendrang', ll: sdL },
                { z: pZ, zl: 'Persönlichkeit', ll: pL },
                { z: ausZ, zl: 'Ausdruck', ll: ausL },
              ].filter(item => !isDash(item.z)); // skip empty/dash slots
              cards.push(`<div class="res-namen-card">
                <div class="res-nc-name">${esc(name)}</div>
                <div class="res-nc-rolle">${esc(rolle||'')}</div>
                <div class="res-nc-zahlen" style="grid-template-columns: repeat(${zahlenItems.length || 3}, 1fr)">
                  ${zahlenItems.map(item => `<div class="res-nc-zahl-item">
                    <div class="res-nc-z">${esc(item.z)}</div>
                    <div class="res-nc-zl">${esc(item.zl)}</div>
                    <div class="res-nc-ll">${esc(item.ll||'')}</div>
                  </div>`).join('')}
                </div>
                ${desc ? `<div class="res-nc-desc">${esc(desc)}</div>` : ''}
              </div>`);
            }
            i++;
          }
          out += `<div class="res-namen-grid">${cards.join('')}</div>`;
          i++;
          continue;
        }

        // ESSENZ
        if (line.startsWith('[ESSENZ:')) {
          const m = line.match(/^\[ESSENZ:(.+)\]$/);
          if (m) out += `<div class="res-essenz">${esc(m[1])}</div>`;
          i++;
          continue;
        }

        // Normal text -- group consecutive lines into paragraphs, apply markdown
        if (line && !line.startsWith('[')) {
          // Collect consecutive non-empty, non-tag lines as one paragraph
          let paraLines = [line];
          while (i + 1 < lines.length) {
            const next = lines[i + 1].trim();
            if (next && !next.startsWith('[')) {
              paraLines.push(next);
              i++;
            } else {
              break;
            }
          }
          const paraText = paraLines.join(' ');
          out += `<p class="res-p">${parseMarkdown(parseInlineMarkers(esc(paraText)))}</p>`;
        } else if (!line) {
          // empty line = paragraph break (already handled by grouping above)
        }
        i++;
      }

      return out;
    }

    // -- SECTION GLOSSARY -------------------------------------------
    const SECTION_INFO = {
      'Der zentrale Code': 'In der Numerologie ist der "zentrale Code" die verdichtete Kernformel einer Person oder Familie -- die Lebenszahl kombiniert mit den wichtigsten Schlüsselzahlen. Er zeigt auf einen Blick, welche Energien das Leben am stärksten prägen.',
      'Schlüsseldaten des Paares': 'Jedes Datum trägt eine numerologische Schwingung. Das Datum des Kennenlernens, der Hochzeit oder anderer Schlüsselereignisse wird auf eine Kernzahl reduziert (Quersumme) und gibt Auskunft darüber, unter welcher Energie dieses Ereignis stand.',
      'Beziehungsdynamik': 'Die Beziehungsdynamik beschreibt das energetische Zusammenspiel zweier Menschen -- wie ihre Lebenszahlen, Sternzeichen und Namen-Energien miteinander resonieren, sich ergänzen oder reiben. Sie zeigt keine Urteile, sondern Muster.',
      'Astrologische Kernverbindungen': 'Die Astrologie betrachtet, wie die Planetenpositionen zum Geburtszeitpunkt (Sonne, Mond, Aszendent) zweier Menschen miteinander interagieren. Verbindungen zwischen denselben Zeichen oder Planeten zeigen tiefe Resonanz.',
      'Dein persönlicher Lebensweg': 'Die Lebenszahl (errechnet aus dem vollständigen Geburtsdatum) ist die wichtigste Zahl in der Numerologie. Sie beschreibt den übergeordneten Weg, die Lebensaufgabe und die Qualitäten, die eine Person entwickeln soll -- nicht das, was man ist, sondern wohin man wächst.',
      'Deine Namen-Energie': 'Der Name trägt eigene numerologische Energie. Seelendrang (Vokale) zeigt das innere Verlangen; Persönlichkeit (Konsonanten) zeigt, wie man nach aussen wirkt; Ausdruckszahl (alle Buchstaben) zeigt das Gesamtpotenzial. Basis ist die Taufname-Zuweisung nach dem pythagoreischen System.',
      'Die Kinder': 'Jedes Kind bringt seine eigene numerologische und astrologische Signatur mit. Die Analyse zeigt, welche Energien das Kind trägt, wie es sich im Familiensystem positioniert und welche Verbindungen zu den Eltern bestehen.',
      'Das Familiensystem': 'Das Familiensystem betrachtet die Familie als energetisches Ganzes -- welche Zahlen und Qualitäten dominieren, welche fehlen, wie die einzelnen Mitglieder sich gegenseitig spiegeln und ergänzen. Muster wiederholen sich oft über Generationen.',
      'Herausforderung & Schlüssel': 'Jede Lebenszahl bringt spezifische Herausforderungen mit -- wiederkehrende Themen, die das Leben immer wieder aufwirft. Der Schlüssel ist der bewusste Umgang damit: nicht Widerstand, sondern Integration. Herausforderungen sind keine Schwächen, sondern Wachstumsfelder.',
      'Jahresenergien': 'Das Persönliche Jahr wird errechnet aus Geburtstag + Geburtsmonat + aktuellem Kalenderjahr. Es beschreibt, unter welchem energetischen Thema ein Jahr steht -- von 1 (Neubeginn) bis 9 (Abschluss). Die neunjährigen Zyklen wiederholen sich lebenslang.',
      'Deine Jahresenergien 2025–2029': 'Das Persönliche Jahr wird errechnet aus Geburtstag + Geburtsmonat + aktuellem Kalenderjahr. Es beschreibt, unter welchem energetischen Thema ein Jahr steht -- von 1 (Neubeginn) bis 9 (Abschluss). Die neunjährigen Zyklen wiederholen sich lebenslang.',
      'Pinnacles & Challenges': 'Pinnacles sind längere Lebenszyklen (ca. 7–27 Jahre), die bestimmte Qualitäten in den Vordergrund bringen. Sie werden aus Geburtstag, -monat und -jahr errechnet. Challenges sind die spezifischen Lernthemen innerhalb jedes Pinnacles -- die Reibungspunkte, die bewusste Entwicklung verlangen.',
      'Namen-Numerologie': 'Eine detaillierte Aufschlüsselung der Namen-Energie aller Familienmitglieder. Seelendrang, Persönlichkeit und Ausdruck zusammen zeigen, wie inneres Verlangen, äussere Wirkung und Gesamtpotenzial zueinander stehen -- und wie die Mitglieder sich numerologisch spiegeln.',
      'Die Essenz': 'Ein einziger Satz, der das Wesen dieser Analyse zusammenfasst -- die verdichtete Quintessenz aller Zahlen, Zeichen und Verbindungen.',
    };

    function getSectionInfo(title) {
      // fuzzy match
      for (const key of Object.keys(SECTION_INFO)) {
        if (title.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(title.toLowerCase())) {
          return SECTION_INFO[key];
        }
      }
      return null;
    }

    function renderResult(text) {
      // Store raw text for DOCX export
      var resultBody = document.getElementById('result-body');
      if (resultBody) resultBody.dataset.rawText = text;
      const secs = text.split('~~~').map(s => s.trim()).filter(Boolean);
      const body = document.getElementById('result-body');
      if (!body) return;
      body.innerHTML = secs.map((sec, idx) => {
        const lines = sec.split('\n');
        const titleRaw = lines[0].replace(/^#+\s*/, '').trim();
        const bodyText = lines.slice(1).join('\n').trim();
        const orn = idx < secs.length - 1 ? `<div class="result-ornament">✦ ✦ ✦</div>` : '';
        const info = getSectionInfo(titleRaw);
        const infoHtml = info
          ? `<button class="sec-info-btn" onclick="this.nextElementSibling.classList.toggle('open')" title="Was bedeutet das?">i</button>
             <div class="sec-info-panel">${esc(info)}</div>`
          : '';
        return `<div class="result-section">
          <div class="result-section-title-row">
            <div class="result-section-title">${esc(titleRaw)}</div>
            ${infoHtml}
          </div>
          <div class="result-body-inner">${parseBlock(bodyText)}</div>
        </div>${orn}`;
      }).join('');
    }
    function renderError(msg) {
      const body = document.getElementById('result-body');
      if (body) body.innerHTML = `<div class="error-box">⚠ ${esc(msg)}<br><small>Bitte versuche es erneut.</small></div>`;
    }

    // -- RESET ------------------------------------------------------
    function resetAll() {
      state.constellation = ''; state.focus = ''; state.childCount = 1;
      state.lead = { name: '', email: '' };
      document.querySelectorAll('.field-input').forEach(el => { el.value = ''; el.disabled = false; });
      document.querySelectorAll('.toggle-box').forEach(el => el.classList.remove('on'));
      document.querySelectorAll('.select-card').forEach(c => c.classList.remove('selected'));
      const btn1 = document.getElementById('btn-constellation-next');
      const btn2 = document.getElementById('btn-focus-next');
      const btn3 = document.getElementById('btn-lead-next');
      if (btn1) btn1.disabled = true;
      if (btn2) btn2.disabled = true;
      if (btn3) btn3.disabled = true;
      const leadName = document.getElementById('lead-name');
      const leadEmail = document.getElementById('lead-email');
      if (leadName) leadName.value = '';
      if (leadEmail) leadEmail.value = '';
      const resultBody = document.getElementById('result-body');
      if (resultBody) resultBody.innerHTML = '';
      const childContainer = document.getElementById('children-container');
      if (childContainer) childContainer.innerHTML = childBlockHTML(0);
      const addBtn = document.getElementById('btn-add-child');
      if (addBtn) addBtn.style.display = '';
      showScreen('splash');
    }

    // -- INIT FORMS -------------------------------------------------
    const p1form = document.getElementById('person1-form');
    if (p1form) p1form.innerHTML = personFormHTML('p1');
    const p2form = document.getElementById('person2-form');
    if (p2form) p2form.innerHTML = personFormHTML('p2');
    const childContainer = document.getElementById('children-container');
    if (childContainer) childContainer.innerHTML = childBlockHTML(0);
    updateNav();

    // Lead gate input listeners
    document.addEventListener('input', (e) => {
      if (e.target.id === 'lead-name' || e.target.id === 'lead-email') validateLead();
    });
    document.addEventListener('keydown', (e) => {
      if ((e.target.id === 'lead-name' || e.target.id === 'lead-email') && e.key === 'Enter') {
        const btn = document.getElementById('btn-lead-next');
        if (btn && !btn.disabled) submitLead();
      }
    });

    // -- EVENT DELEGATION -------------------------------------------
    document.addEventListener('click', (e) => {
      // Select cards
      const card = e.target.closest('.select-card');
      if (card) {
        const grid = card.closest('[class*="card-grid"]');
        if (grid) {
          const type = card.dataset.cardType;
          selectCard(card, type || (card.closest('#screen-constellation') ? 'constellation' : 'focus'));
        }
      }
      // Toggle rows
      const toggleRow = e.target.closest('.toggle-row');
      if (toggleRow) {
        const inputId = toggleRow.dataset.toggleInput;
        const toggleId = toggleRow.dataset.toggleId;
        if (inputId && toggleId) toggleField(inputId, toggleId);
      }
      // Remove child buttons
      const removeBtn = e.target.closest('[data-remove-child]');
      if (removeBtn) removeChild(parseInt(removeBtn.dataset.removeChild));
      // Nav actions -- use closest() so clicks on child elements (spans, icons) still register
      // Ancestry card toggle (it's a div, not a button)
      if (e.target.closest('#ancestry-toggle-card')) {
        toggleAncestry();
        return;
      }

      const btn = e.target.closest('button, [role="button"]');
      if (btn) {
        const id = btn.id;
        if (id === 'nav-reset') resetAll();
        if (id === 'btn-add-child') addChild();
        if (id === 'btn-lead-next') submitLead();
        if (id === 'btn-constellation-next') goNext();
        if (id === 'btn-focus-next') startAnalysis();
        if (btn.classList.contains('btn-back')) goBack();
        if (btn.classList.contains('btn-next-generic')) goNext();
        if (id === 'hero-cta-btn') goNext();
        if (id === 'btn-ancestry-next' || id === 'btn-ancestry-skip') goNext();
        if (id === 'btn-back-ancestry') goBack();
        if (id === 'ancestry-toggle-card') toggleAncestry();
        if (id === 'btn-download-docx') downloadDocx();
        if (id === 'btn-print') window.print();
        if (id === 'btn-reset-result') resetAll();
      }
    });


  }
  // Wait for React/Next.js hydration to complete before initializing
  function tryInit() {
    // Check if the key elements exist and are ready
    var el = document.getElementById('screen-splash');
    if (el) {
      init();
    } else {
      setTimeout(tryInit, 50);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(tryInit, 100); });
  } else {
    setTimeout(tryInit, 100);
  }
})();
