(function () {
  'use strict';

  const CONFIG = {
    // true = visitors can analyze their own feedback (needs GEMINI_API_KEY in Vercel).
    // The sample readout still loads instantly, pre-run, either way.
    // Set to false for a demo-only page.
    liveEnabled: true
  };

  const AUDIENCES = [
    { id: 'product', label: 'Product' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'support', label: 'Support' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'leadership', label: 'Leadership' }
  ];
  const SIGNAL_LABEL = { deal_blocker: 'Deal blocker', churn_risk: 'Churn risk', expansion: 'Expansion', advocacy: 'Advocacy', none: '' };
  const SIGNAL_WEIGHT = { deal_blocker: 1.5, churn_risk: 1.3 };
  const LIMITS = { items: 200, chars: 20000, itemChars: 1000, fileBytes: 2 * 1024 * 1024 };
  const PROBLEMS_SHOWN = 5;

  // Input columns. Only feedback text is required.
  const FIELDS = [
    { key: 'text', label: 'Feedback', required: true, names: ['feedback', 'feedback text', 'comment', 'comments', 'text', 'review', 'response', 'message', 'verbatim'], re: /feedback|comment|text|review|response|message|verbatim|body/i },
    { key: 'date', label: 'Date', names: ['date', 'created', 'created at', 'submitted', 'timestamp'], re: /date|created|submitted|time/i },
    { key: 'source', label: 'Source', names: ['source', 'channel'], re: /source|channel|origin/i },
    { key: 'segment', label: 'Segment', names: ['segment', 'plan', 'tier', 'customer segment'], re: /segment|plan|tier|customer.?type|persona/i },
    { key: 'version', label: 'Version', names: ['version', 'app version', 'product', 'platform'], re: /version|product|platform/i }
  ];

  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtDate = s => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || ''); return m ? `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}` : (s || ''); };

  const state = {
    effort: {},         // PM's effort estimate per problem key: 'S' | 'M' | 'L'
    table: null, build: null, items: [], inputError: null,
    raw: null, mode: 'demo', meta: null,
    audience: 'product', runAudience: 'product',
    showAllProblems: false, stale: false, notice: null, running: false
  };

  // ---------- Input parsing ----------
  const sampleText = () => 'date\tsource\tfeedback\n' + window.SAMPLE_FEEDBACK.map(r => r.join('\t')).join('\n');
  const isSample = () => state.table?.origin === 'sample';

  function redact(text) {
    return text.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]').replace(/\+?\d[\d\s().-]{8,}\d/g, '[phone]');
  }

  // RFC 4180-style parser: quoted fields, escaped quotes, embedded delimiters and line breaks.
  function parseDelimited(text, d) {
    const rows = [];
    let row = [], field = '', inQuotes = false, line = 1, quoteLine = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
        } else {
          if (c === '\n') line++;
          field += c;
        }
      } else if (c === '"' && field.trim() === '') { inQuotes = true; quoteLine = line; field = ''; }
      else if (c === d) { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; line++; }
      else if (c !== '\r') field += c;
    }
    if (inQuotes) return { error: `A quoted value starting on line ${quoteLine} is never closed. Check the file for a stray " character.` };
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return { rows };
  }

  function detectMapping(headers) {
    const norm = headers.map(h => h.toLowerCase().replace(/[_-]+/g, ' ').trim());
    const map = {}, used = new Set();
    FIELDS.forEach(f => {
      const i = norm.findIndex((h, idx) => !used.has(idx) && f.names.includes(h));
      map[f.key] = i; if (i >= 0) used.add(i);
    });
    FIELDS.forEach(f => {
      if (map[f.key] >= 0) return;
      const i = norm.findIndex((h, idx) => !used.has(idx) && f.re.test(h));
      map[f.key] = i; if (i >= 0) used.add(i);
    });
    return map;
  }

  function mappingByPosition(width) {
    const m = { text: -1, date: -1, source: -1, segment: -1, version: -1 };
    if (width >= 3) Object.assign(m, { date: 0, source: 1, text: 2 });
    else if (width === 2) Object.assign(m, { source: 0, text: 1 });
    else m.text = 0;
    return m;
  }

  function tableFromText(text, origin, name) {
    text = text.replace(/^﻿/, '');
    const firstLine = text.split(/\r?\n/).find(l => l.trim()) || '';
    let d = null;
    if (firstLine.includes('\t')) d = '\t';
    else if (origin === 'csv') d = firstLine.split(';').length > firstLine.split(',').length ? ';' : ',';
    else if (firstLine.includes(',') && firstLine.length < 200 && firstLine.split(',').some(h => FIELDS[0].names.includes(h.trim().toLowerCase()))) d = ',';

    if (!d) {
      const rows = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => {
        const m = l.match(/^\[([^\]]{1,30})\]\s*(.+)$/);
        return m ? [m[1], m[2]] : ['', l];
      });
      if (!rows.length) return null;
      return { origin, name, headers: ['Source tag', 'Comment'], rows, hasHeader: false, lineMode: true, mapping: { text: 1, source: 0, date: -1, segment: -1, version: -1 } };
    }

    const parsed = parseDelimited(text, d);
    if (parsed.error) return { origin, name, error: parsed.error };
    let rows = parsed.rows.map(r => r.map(c => c.trim())).filter(r => r.some(Boolean));
    if (!rows.length) return { origin, name, error: `${name ? `"${name}"` : 'The input'} has no rows.` };
    const width = Math.max(...rows.map(r => r.length));
    const first = rows[0];
    // Uploaded files are expected to have a header row; pasted text is checked for one.
    const hasHeader = origin === 'csv' || (first.some(h => FIELDS.some(f => f.names.includes(h.toLowerCase()) || f.re.test(h))) && !first.some(h => h.length > 60));
    let headers = [];
    if (hasHeader) { headers = first.map((h, i) => h || `Column ${i + 1}`); rows = rows.slice(1); }
    while (headers.length < width) headers.push(`Column ${headers.length + 1}`);
    if (!rows.length) return { origin, name, error: `${name ? `"${name}"` : 'The input'} only has a header row.` };
    const mapping = hasHeader ? detectMapping(headers) : mappingByPosition(width);
    if (mapping.text < 0 && width === 1) mapping.text = 0;
    return { origin, name, headers, rows, hasHeader, mapping };
  }

  function buildItems(t) {
    const m = t.mapping, items = [], excluded = [], seen = new Map();
    let redactions = 0, chars = 0;
    const offset = t.hasHeader ? 2 : 1; // row numbers as a spreadsheet shows them
    if (m.text < 0) return { items, excluded, redactions, chars, duplicates: 0, noTextColumn: true };
    t.rows.forEach((r, i) => {
      const row = i + offset;
      const get = k => (m[k] >= 0 ? (r[m[k]] || '').trim() : '');
      const raw = get('text');
      if (!raw) { excluded.push({ row, reason: 'no feedback text' }); return; }
      if (raw.length > LIMITS.itemChars) { excluded.push({ row, reason: `over ${LIMITS.itemChars.toLocaleString()} characters` }); return; }
      const text = redact(raw);
      if (text !== raw) redactions++;
      const item = { id: items.length + 1, row, date: get('date'), source: (get('source') || 'unknown').toLowerCase(), segment: get('segment'), version: get('version'), text };
      const key = text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
      if (seen.has(key)) item.dupOf = seen.get(key); else seen.set(key, item.id);
      chars += text.length;
      items.push(item);
    });
    return { items, excluded, redactions, chars, duplicates: items.filter(i => i.dupOf).length };
  }

  const overLimit = () => !!state.build && (state.build.items.length > LIMITS.items || state.build.chars > LIMITS.chars);

  function refreshInput() {
    state.build = state.table && !state.table.error ? buildItems(state.table) : null;
    state.items = state.build ? state.build.items : [];
    state.notice = null;
    if (isSample() && state.mode === 'demo') { state.raw = window.DEMO_ANALYSIS; state.stale = false; }
    else if (state.mode === 'demo') state.raw = null;
    else state.stale = true;
    renderInput();
    render();
  }

  function setPaste(text) {
    $('#feedback').value = text;
    const trimmed = text.trim();
    state.table = trimmed ? tableFromText(text, trimmed === sampleText().trim() ? 'sample' : 'paste') : null;
    state.inputError = state.table?.error || null;
    refreshInput();
  }

  function useSample() {
    state.mode = 'demo'; state.meta = null; state.inputError = null;
    // Start from the PM's own effort estimates for the sample; visitors can change them.
    state.effort = Object.fromEntries(Object.entries(window.DEMO_ANALYSIS.discovery || {}).map(([k, v]) => [k, v.effort]).filter(([, v]) => v));
    $('#pasteBox').hidden = true;
    setPaste(sampleText());
  }

  async function loadFile(file) {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const fail = msg => { state.inputError = msg; renderInput(); };
    if (!['csv', 'tsv', 'txt'].includes(ext)) return fail(`"${file.name}" isn't a CSV file. Export your feedback as .csv and try again.`);
    if (file.size === 0) return fail(`"${file.name}" is empty.`);
    if (file.size > LIMITS.fileBytes) return fail(`"${file.name}" is ${(file.size / 1048576).toFixed(1)} MB. The limit is 2 MB.`);
    let text;
    try { text = await file.text(); } catch { return fail(`"${file.name}" couldn't be read. Save it again as CSV (UTF-8) and retry.`); }
    const t = tableFromText(text, 'csv', file.name);
    if (!t) return fail(`"${file.name}" has no rows.`);
    if (t.error) return fail(t.error);
    state.inputError = null;
    state.table = t;
    $('#feedback').value = '';
    $('#pasteBox').hidden = true;
    refreshInput();
  }

  // ---------- Input rendering ----------
  function dateRange(items) {
    const ds = items.map(i => i.date).filter(d => /^\d{4}-\d{2}-\d{2}/.test(d)).sort();
    if (!ds.length) return '';
    const a = fmtDate(ds[0]), b = fmtDate(ds[ds.length - 1]);
    return a === b ? a : `${a.replace(/ \d{4}$/, ds[0].slice(0, 4) === ds[ds.length - 1].slice(0, 4) ? '' : '$&')} – ${b}`;
  }

  function renderInput() {
    const t = state.table, b = state.build;
    const items = b ? b.items : [];
    const channels = [...new Set(items.map(i => i.source))].filter(s => s !== 'unknown');
    $('#srcName').textContent = !t ? 'No data' : t.origin === 'sample' ? 'Sample dataset' : t.origin === 'csv' ? t.name : 'Pasted feedback';
    $('#srcMeta').textContent = items.length ? ` · ${plural(items.length, 'comment')}${channels.length ? ' from ' + channels.join(', ') : ''}${dateRange(items) ? ' · ' + dateRange(items) : ''}` : '';
    $('#loadSample').hidden = isSample();

    const err = $('#inputError');
    err.hidden = !state.inputError;
    err.textContent = state.inputError || '';

    $('#preview').innerHTML = b && !isSample() ? previewHtml(t, b) : '';

    $('#modeNote').textContent = CONFIG.liveEnabled
      ? 'Emails and phone numbers are removed before analysis. Nothing is stored here, but the AI provider (Google Gemini, free tier) may retain what you send, so avoid confidential data.'
      : isSample()
        ? 'This is a demo using sample data, analysed in advance. You can upload your own CSV to see how it gets checked. It stays on your computer.'
        : 'Your data was checked on your computer only. Analysis is switched off in this demo, so nothing was analysed or sent anywhere.';
  }

  function previewHtml(t, b) {
    const bits = [];
    if (b.noTextColumn) bits.push('<b style="color:var(--red)">Pick the column that holds the feedback.</b>');
    else bits.push(`<b>${plural(b.items.length, 'comment')} ready</b>`);
    if (b.excluded.length) bits.push(`${b.excluded.length} skipped (${[...new Set(b.excluded.map(x => x.reason))].join(', ')}: row ${b.excluded.slice(0, 5).map(x => x.row).join(', ')}${b.excluded.length > 5 ? '…' : ''})`);
    if (b.duplicates) bits.push(`${plural(b.duplicates, 'possible duplicate')} kept and marked`);
    if (b.redactions) bits.push(`${b.redactions} with contact details removed`);
    if (overLimit()) bits.push(`<span style="color:var(--red)">over the ${LIMITS.items}-comment limit</span>`);

    const mapping = t.lineMode ? '' : `<div class="mapping">${FIELDS.map(f => `
      <label>${esc(f.label)}${f.required ? ' *' : ''}
        <select data-field="${f.key}" id="map-${f.key}">
          <option value="-1">${f.required ? 'Choose…' : '—'}</option>
          ${t.headers.map((h, i) => `<option value="${i}"${t.mapping[f.key] === i ? ' selected' : ''}>${esc(h)}</option>`).join('')}
        </select></label>`).join('')}</div>`;

    const rows = b.items.slice(0, 5);
    const table = rows.length ? `<div class="table-wrap"><table>
      <thead><tr><th>Row</th><th>Source</th><th>Date</th><th>Feedback</th></tr></thead>
      <tbody>${rows.map(i => `<tr><td class="n muted">${i.row}</td><td>${esc(i.source)}</td><td class="n">${esc(i.date)}</td><td>${esc(i.text.length > 120 ? i.text.slice(0, 120) + '…' : i.text)}${i.dupOf ? ` <span class="small" style="color:var(--amber)">(same as #${i.dupOf})</span>` : ''}</td></tr>`).join('')}</tbody>
    </table></div>` : '';

    return `<div class="checks"><p>${bits.join(' · ')}</p>${mapping}${table}</div>`;
  }

  // ---------- Analysis (deterministic, from tags) ----------
  function compute() {
    const tagById = new Map(state.raw.items.map(t => [t.id, t]));
    const rows = state.items.map(it => {
      const t = tagById.get(it.id) || { theme: 'Unclassified', subtheme: 'Not tagged', sentiment: 'neutral', type: 'Other', area: '', severity: 0, signal: 'none', evidence: '' };
      const ev = (t.evidence || '').trim();
      return { ...t, ...it, evidence: ev, verified: ev ? it.text.includes(ev) : null };
    });
    const byId = new Map(rows.map(r => [r.id, r]));

    const discovery = state.raw.discovery || {};
    const problems = groupBy(rows.filter(r => r.severity > 0 && r.sentiment !== 'positive'), r => r.theme + '\u0000' + r.subtheme).map(items => {
      const score = items.reduce((s, r) => s + r.severity * (SIGNAL_WEIGHT[r.signal] || 1), 0);
      const channels = [...new Set(items.map(r => r.source))];
      const conf = items.length >= 5 && channels.length >= 2 ? 'High' : (items.length >= 3 || channels.length >= 2) ? 'Medium' : 'Low';
      const risks = [...new Set(items.map(r => r.signal).filter(s => s === 'deal_blocker' || s === 'churn_risk'))];
      const key = items[0].theme + '|' + items[0].subtheme;
      return {
        key, theme: items[0].theme, subtheme: items[0].subtheme, items, score, channels, conf, risks,
        avgSev: items.reduce((s, r) => s + r.severity, 0) / items.length,
        impact: score >= 10 || risks.length ? 'High' : score >= 5 ? 'Medium' : 'Low',
        expansion: items.some(r => r.signal === 'expansion'),
        usability: items.some(r => r.type === 'Usability'),
        disc: discovery[key] || null
      };
    }).sort((a, b) => b.score - a.score || b.items.length - a.items.length);

    const riskGroups = groupBy(rows.filter(r => r.signal === 'deal_blocker' || r.signal === 'churn_risk'), r => r.theme + '\u0000' + r.subtheme)
      .sort((a, b) => b.length - a.length);

    const positives = groupBy(rows.filter(r => r.sentiment === 'positive'), r => r.theme + '\u0000' + r.subtheme)
      .sort((a, b) => b.length - a.length);

    const summaries = new Map((state.raw.themes || []).map(t => [t.name, t.summary]));
    const themes = groupBy(rows, r => r.theme).map(items => ({
      name: items[0].theme, summary: summaries.get(items[0].theme) || '', items,
      neg: items.filter(r => r.sentiment === 'negative').length,
      subs: groupBy(items, r => r.subtheme).sort((a, b) => b.length - a.length)
    })).sort((a, b) => b.items.length - a.items.length);

    const spans = rows.filter(r => r.verified !== null);
    return {
      rows, byId, problems, riskGroups, positives, themes,
      neg: rows.filter(r => r.sentiment === 'negative').length,
      riskCount: riskGroups.reduce((n, g) => n + g.length, 0),
      verified: spans.filter(r => r.verified).length, spanCount: spans.length
    };
  }

  function groupBy(list, keyFn) {
    const m = new Map();
    list.forEach(x => { const k = keyFn(x); if (!m.has(k)) m.set(k, []); m.get(k).push(x); });
    return [...m.values()];
  }

  const currentLens = () => (state.mode === 'demo' ? window.DEMO_ANALYSIS.lenses[state.audience] : state.raw.lens);

  // ---------- Results rendering ----------
  let uid = 0;
  const toggle = (label, content) => {
    const id = 't' + (++uid);
    return `<button class="link" type="button" data-toggle="${id}" data-label="${esc(label)}">${esc(label)}</button><div id="${id}" hidden>${content}</div>`;
  };

  function quote(r) {
    const meta = [r.source === 'unknown' ? '' : r.source, fmtDate(r.date), r.segment, r.version].filter(Boolean).map(esc).join(' · ');
    const warn = r.verified === false ? ' <span class="warn">· quoted words not found in original</span>' : '';
    return `<blockquote class="q">${esc(r.text)}<cite>${meta}${warn}</cite></blockquote>`;
  }
  const quotes = list => `<div class="quotes">${list.map(quote).join('')}</div>`;

  function scoreMath(p) {
    const parts = groupBy(p.items, r => r.severity + '|' + r.signal).map(g => {
      const r = g[0], w = SIGNAL_WEIGHT[r.signal] || 1;
      return `${g.length} × ${r.severity}${w !== 1 ? ` × ${w} (${SIGNAL_LABEL[r.signal].toLowerCase()})` : ''}`;
    });
    return `Score ${p.score.toFixed(1)} = ${parts.join(' + ')} <span>(mentions × severity × risk weight)</span>`;
    // e.g. "4 × 3 × 1.3 (churn risk) + 4 × 3" for Crashes
  }

  // Impact comes from the feedback; effort is the PM's call. Together they place the problem.
  const EFFORT = { S: 'Small', M: 'Medium', L: 'Large' };
  function decision(p) {
    const e = state.effort[p.key];
    if (!e) return '';
    if (p.impact === 'High') return { S: 'Quick win', M: 'Do next', L: 'Big bet' }[e];
    return e === 'L' ? 'Not now' : 'Fill-in';
  }
  const feasibility = p => (state.effort[p.key] ? `${EFFORT[state.effort[p.key]]} effort (PM estimate, to confirm with engineering)` : 'Not estimated yet. Pick an effort above, then confirm with engineering.');

  function problemDetail(p, i) {
    const viability = [
      ...p.risks.map(s => `${SIGNAL_LABEL[s]} (${p.items.filter(r => r.signal === s).length})`),
      ...(p.expansion ? ['A customer would pay more for this'] : [])
    ];
    return `<div class="disc">
      ${p.disc ? `
        <p class="stmt">${esc(p.disc.statement)}</p>
        ${p.disc.unknowns?.length ? `<div><p class="kv"><span>What we don't know yet</span></p><ul class="unknowns">${p.disc.unknowns.map(q => `<li>${esc(q)}</li>`).join('')}</ul></div>` : ''}
        ${p.disc.next ? `<p class="kv"><span>Next discovery step:</span> ${esc(p.disc.next)}</p>` : ''}`
      : '<p class="small muted">No problem statement drafted for this one yet.</p>'}
      <dl class="lenses">
        <div><dt>Value</dt><dd>${plural(p.items.length, 'mention')} from ${esc(p.channels.join(', '))}, average severity ${p.avgSev.toFixed(1)} of 3 (confidence ${p.conf.toLowerCase()})</dd></div>
        <div><dt>Viability</dt><dd>${viability.length ? esc(viability.join(' · ')) : 'No direct revenue signal in the feedback'}</dd></div>
        <div><dt>Usability</dt><dd>${p.usability ? 'Yes: customers find it confusing to use' : 'Not a usability issue'}</dd></div>
        <div><dt>Feasibility</dt><dd id="feas-${i}">${esc(feasibility(p))}</dd></div>
      </dl>
      <div>${toggle(`Show ${plural(p.items.length, 'quote')}`, quotes(p.items))}</div>
      <p class="math">${scoreMath(p)}</p>
    </div>`;
  }

  // Subthemes of one theme: what kind of issue, which part of the product, how often, and an example.
  function subthemeTable(t) {
    const top = (list, n) => {
      const counts = new Map();
      list.forEach(v => { if (v) counts.set(v, (counts.get(v) || 0) + 1); });
      return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([v]) => v);
    };
    const SENT_SHORT = { negative: 'neg', mixed: 'mixed', neutral: 'neutral', positive: 'pos' };
    const sentiment = s => Object.keys(SENT_SHORT).map(k => [k, s.filter(r => r.sentiment === k).length]).filter(([, n]) => n).map(([k, n]) => `${n} ${SENT_SHORT[k]}`).join(', ');
    const areas = s => top(s.map(r => (r.area && r.area !== 'General' ? r.area : '')), 3).join(', ') || 'Unknown';
    return `<div class="table-wrap"><table style="font-size:13.5px">
      <thead><tr><th>Subtheme</th><th class="n">Mentions</th><th>Sentiment</th><th>Type</th><th class="hide-sm">Area</th><th class="hide-sm">Source</th><th>Example</th></tr></thead>
      <tbody>${t.subs.map(s => {
        const ex = s.find(r => r.verified) || s[0];
        return `<tr>
          <td>${esc(s[0].subtheme)}</td>
          <td class="n">${s.length}</td>
          <td class="small">${esc(sentiment(s))}</td>
          <td class="small">${esc(top(s.map(r => r.type), 2).join(', '))}</td>
          <td class="hide-sm small">${esc(areas(s))}</td>
          <td class="hide-sm small">${esc(top(s.map(r => (r.source === 'unknown' ? '' : r.source)), 4).join(', ') || 'Unknown')}</td>
          <td class="small">“${esc(ex.verified ? ex.evidence : ex.text)}” ${s.length > 1 ? toggle('All', quotes(s)) : ''}</td>
        </tr>`;
      }).join('')}</tbody>
    </table></div>`;
  }

  function render() {
    uid = 0;
    const out = $('#results');
    const banners = [];
    if (state.notice) banners.push(`<div class="banner warn" role="status">${esc(state.notice)}</div>`);
    if (state.stale) banners.push(`<div class="banner">The data or view changed since this analysis ran. Click Analyze to update it.</div>`);
    if (!state.raw) {
      out.innerHTML = banners.join('') + (state.table && !isSample() && !CONFIG.liveEnabled
        ? `<p class="muted">Analysis is switched off in this demo. <button class="link" type="button" data-action="sample">Go back to the sample</button> to see what the readout looks like.</p>` : '');
      return;
    }
    const a = compute();
    const lens = currentLens();
    const aud = AUDIENCES.find(x => x.id === (state.mode === 'demo' ? state.audience : state.runAudience));
    const n = a.rows.length;
    const shown = state.showAllProblems ? a.problems : a.problems.slice(0, PROBLEMS_SHOWN);

    out.innerHTML = banners.join('') + [
      // 1. The readout
      `<section class="readout">
        <p class="eyebrow">${esc(aud.label)} readout · ${plural(n, 'comment')}${state.mode === 'live' && state.meta?.model ? ' · analyzed with ' + esc(state.meta.model) : ''}</p>
        <h2>${esc(lens?.headline || 'Analysis')}</h2>
        ${state.mode === 'live' && state.meta?.instructions ? `<p class="small muted">Your instructions: “${esc(state.meta.instructions)}”</p>` : ''}
        <p class="facts"><b>${a.neg}</b> negative comments (${Math.round(a.neg / (n || 1) * 100)}%) · <b>${a.riskCount}</b> flag a deal or churn risk · <b>${a.problems.length}</b> problems</p>
      </section>`,

      // 2. What we heard
      lens?.insights?.length ? `<section><h3>What we heard</h3><ul class="heard">${lens.insights.map(x => {
        const ev = (x.ids || []).map(id => a.byId.get(id)).filter(Boolean);
        return `<li><b>${esc(x.title)}.</b> <span>${esc(x.detail)}</span> ${ev.length ? toggle(`${plural(ev.length, 'quote')}`, quotes(ev)) : ''}</li>`;
      }).join('')}</ul></section>` : '',

      // 3. What to do next
      lens?.actions?.length ? `<section><h3>What we should do next</h3><ol class="next">${lens.actions.map(x => {
        const ev = (x.ids || []).map(id => a.byId.get(id)).filter(Boolean);
        return `<li><b>${esc(x.action)}</b>
          <p class="why">${esc(x.why)}</p>
          ${x.assumption ? `<p class="kv"><span>Check first:</span> ${esc(x.assumption)}</p>` : ''}
          ${x.measure ? `<p class="kv"><span>Measure:</span> ${esc(x.measure)}</p>` : ''}
          ${ev.length ? toggle(`Based on ${plural(ev.length, 'comment')}`, quotes(ev)) : ''}</li>`;
      }).join('')}</ol></section>` : '',

      // 4. Ranked problems
      a.problems.length ? `<section><h3>Top problems</h3>
        <p class="small muted" style="margin:-4px 0 10px">Impact comes from the feedback. Effort is your call: pick one to see where each problem lands. Click a problem for the problem statement and what to find out next.</p>
        <div class="table-wrap"><table>
          <thead><tr><th>#</th><th>Problem</th><th class="n hide-sm">Mentions</th><th>Impact</th><th>Effort</th><th>Call</th></tr></thead>
          <tbody>${shown.map((p, i) => {
            const id = 'p' + i, e = state.effort[p.key] || '';
            return `<tr>
              <td class="n muted">${i + 1}</td>
              <td><button class="link" style="font-size:14px;color:var(--ink);font-weight:500;text-align:left" type="button" data-toggle="${id}" aria-expanded="false">${esc(p.subtheme)}</button>
                <div class="small muted">${esc(p.theme)}${p.risks.map(s => ` · <span class="risk">${SIGNAL_LABEL[s]}</span>`).join('')}</div></td>
              <td class="n hide-sm">${p.items.length}</td>
              <td class="small imp-${p.impact}">${p.impact}</td>
              <td><select data-effort="${esc(p.key)}" data-i="${i}" aria-label="Effort for ${esc(p.subtheme)}">
                <option value=""${e ? '' : ' selected'}>Set…</option>
                ${Object.entries(EFFORT).map(([k, v]) => `<option value="${k}"${e === k ? ' selected' : ''}>${v}</option>`).join('')}
              </select></td>
              <td class="small call" id="call-${i}">${decision(p) || '<span class="muted">–</span>'}</td>
            </tr>
            <tr class="detail" id="${id}" hidden><td></td><td colspan="5">${problemDetail(p, i)}</td></tr>`;
          }).join('')}</tbody>
        </table></div>
        ${a.problems.length > PROBLEMS_SHOWN ? `<p style="margin-top:8px"><button class="link" type="button" data-action="moreProblems">${state.showAllProblems ? `Show top ${PROBLEMS_SHOWN}` : `Show all ${a.problems.length}`}</button></p>` : ''}
      </section>` : '',

      // 5. Risks, always shown
      `<section class="riskbox">
        <h3>Deal and churn risks</h3>
        <p class="small muted">Shown whichever team you pick. These are flagged from what customers said, so check them before treating them as confirmed.</p>
        ${a.riskGroups.length ? `<ul>${a.riskGroups.map(g => `<li><b>${esc(g[0].subtheme)}</b> <span class="muted">(${esc(g[0].theme)}, ${plural(g.length, 'mention')})</span>: “${esc(g[0].verified ? g[0].evidence : g[0].text)}” ${toggle('All', quotes(g))}</li>`).join('')}</ul>` : '<p class="small">None found in this data.</p>'}
      </section>`,

      // 6. What's working
      a.positives.length ? `<section><h3>What's working</h3><ul class="heard">${a.positives.slice(0, 5).map(g => `<li><b>${esc(g[0].subtheme)}</b> <span class="muted">(${esc(g[0].theme)}, ${plural(g.length, 'mention')})</span>: “${esc(g[0].verified ? g[0].evidence : g[0].text)}” ${g.length > 1 ? toggle('More', quotes(g.slice(1))) : ''}</li>`).join('')}</ul></section>` : '',

      // 7. All themes, each opening into its subthemes
      `<section><h3>All themes</h3>
        <p class="small muted" style="margin:-4px 0 10px">Click a theme to see what's inside it.</p>
        <div class="table-wrap"><table>
          <thead><tr><th>Theme</th><th class="n">Mentions</th><th class="n">Negative</th><th class="n">Positive</th></tr></thead>
          <tbody>${a.themes.map((t, i) => `<tr>
            <td><button class="link" style="font-size:14px;color:var(--ink);font-weight:500" type="button" data-toggle="th${i}" aria-expanded="false">${esc(t.name)}</button>${t.summary ? `<div class="small muted">${esc(t.summary)}</div>` : ''}</td>
            <td class="n">${t.items.length}</td><td class="n">${t.neg}</td><td class="n">${t.items.filter(r => r.sentiment === 'positive').length}</td>
          </tr>
          <tr class="detail" id="th${i}" hidden><td colspan="4">${subthemeTable(t)}</td></tr>`).join('')}</tbody>
        </table></div>
      </section>`,

      // 8. Appendix
      `<section class="appendix">
        <details class="method"><summary style="color:var(--ink)">How this works</summary>
          <ul>
            <li>Each comment gets one theme, a sentiment, a severity from 0 to 3, and a flag if it points to a lost deal or a customer leaving. Counts are comments, not customers.</li>
            <li>Score: add up the severity of each mention, counting deal blockers ×1.5 and churn risks ×1.3. It's for sorting the list, not a revenue estimate.</li>
            <li>Confidence: High = 5+ mentions from 2+ channels. Medium = 3+ mentions or 2+ channels. Low = everything else.</li>
            <li>Impact: High if the score is 10+ or any comment flags a deal or churn risk; Medium if 5+; Low otherwise. Call: high impact with small effort is a Quick win, medium effort Do next, large effort a Big bet. Lower impact is a Fill-in (small or medium effort) or Not now (large).</li>
            <li>Quotes are checked word for word against the original (${a.verified} of ${a.spanCount} match). The tags are judgement calls and can be wrong.</li>
            <li>Picking a team changes the summary and next steps. The ranking and the risk list stay the same.</li>
            <li>${state.mode === 'demo' ? 'The demo data was tagged in advance using AI. ' : 'Tagged by Google Gemini; counts and scores are worked out in the page. '}Accuracy hasn't been tested against a hand-labelled set yet.</li>
          </ul>
        </details>
        <div class="export"><button class="btn" type="button" data-action="copy">Copy problem statements</button><button class="btn" type="button" data-action="csv">Download CSV</button><span class="small muted">Problem statements paste straight into a PRD or backlog. The CSV has every comment with its tags.</span></div>
        <textarea id="copyFallback" hidden aria-label="Summary text"></textarea>
      </section>`
    ].join('');

    out._analysis = { a, lens, aud };
  }

  // ---------- Export ----------
  // Problem statements in a shape that pastes straight into a PRD, Notion page or backlog.
  function copyProblems() {
    const { a } = $('#results')._analysis;
    const list = a.problems.filter(p => p.disc);
    const picked = list.length ? list : a.problems.slice(0, PROBLEMS_SHOWN);
    const L = [`Problem statements from customer feedback (${a.rows.length} comments)`, ''];
    picked.forEach((p, i) => {
      L.push(`${i + 1}. ${p.subtheme} (${p.theme})`);
      if (p.disc?.statement) L.push(`Problem: ${p.disc.statement}`);
      L.push(`Impact: ${p.impact} · Effort: ${EFFORT[state.effort[p.key]] || 'not set'}${decision(p) ? ' · Call: ' + decision(p) : ''}`);
      L.push(`Evidence: ${plural(p.items.length, 'comment')} from ${p.channels.join(', ')}${p.risks.length ? ' · ' + p.risks.map(s => SIGNAL_LABEL[s]).join(', ') : ''}`);
      if (p.disc?.unknowns?.length) L.push(`Open questions: ${p.disc.unknowns.join(' ')}`);
      if (p.disc?.next) L.push(`Next step: ${p.disc.next}`);
      L.push(`Example: "${p.items[0].text}"`, '');
    });
    const text = L.join('\n').trim();
    const fallback = () => { const ta = $('#copyFallback'); ta.hidden = false; ta.value = text; ta.focus(); ta.select(); toast('Select the text below and copy it'); };
    try { navigator.clipboard.writeText(text).then(() => toast('Problem statements copied'), fallback); } catch { fallback(); }
  }

  function downloadCsv() {
    const { a } = $('#results')._analysis;
    const cols = ['id', 'row', 'date', 'source', 'segment', 'version', 'feedback', 'theme', 'subtheme', 'sentiment', 'severity', 'signal', 'possible_duplicate_of'];
    const cell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [cols.join(',')].concat(a.rows.map(r => [r.id, r.row, r.date, r.source, r.segment, r.version, r.text, r.theme, r.subtheme, r.sentiment, r.severity, r.signal, r.dupOf || ''].map(cell).join(',')));
    try {
      const url = URL.createObjectURL(new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
      const link = Object.assign(document.createElement('a'), { href: url, download: 'feedback-readout.csv' });
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { toast('Download is blocked in this browser'); }
  }

  function toast(text) {
    const t = Object.assign(document.createElement('div'), { className: 'toast', textContent: text });
    t.setAttribute('role', 'status');
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  // ---------- Live analysis ----------
  async function analyze() {
    if (state.running) return;
    const b = state.build;
    if (!b || !b.items.length) { state.notice = b?.noTextColumn ? 'Pick the column that holds the feedback, then try again.' : 'Add some feedback first.'; render(); return; }
    if (overLimit()) { state.notice = `That's more than one run handles (${LIMITS.items} comments). Trim the file and try again.`; render(); return; }
    state.running = true; state.notice = null;
    const btn = $('#analyze'), started = Date.now();
    btn.disabled = true;
    const tick = setInterval(() => { btn.textContent = `Analyzing… ${Math.round((Date.now() - started) / 1000)}s`; }, 500);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: state.items.map(({ id, source, segment, version, text }) => ({ id, source, segment, version, text })), audience: state.audience, instructions: $('#instructions').value.trim() })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(data.message || 'The analysis failed. Try again in a moment.'), { code: data.error });
      if (data.redactedTexts) state.items = state.items.map(i => ({ ...i, text: data.redactedTexts[i.id] ?? i.text }));
      Object.assign(state, { raw: data.analysis, meta: data.meta, mode: 'live', runAudience: data.meta.audience, stale: false, showAllProblems: false, effort: {} });
    } catch (err) {
      state.notice = err.code ? err.message : 'Could not reach the analysis service. Check your connection and try again.';
    } finally {
      clearInterval(tick);
      state.running = false; btn.disabled = false; btn.textContent = 'Analyze';
      render();
    }
  }

  // ---------- Boot ----------
  // Custom instructions are always visible; in the demo they're shown but switched off.
  if (!CONFIG.liveEnabled) {
    $('#instructions').disabled = true;
    $('#instructions').placeholder = 'e.g. We\'re planning Q4. Focus on what blocks larger clinics from buying.';
    document.querySelector('label[for="instructions"]').textContent = 'Anything to focus on? (optional, works when live analysis is on)';
    $('#analyze').disabled = true;
    $('#analyze').title = 'Live analysis is switched off in this demo';
  }

  const renderAudiences = () => {
    $('#audiences').innerHTML = AUDIENCES.map(a => `<button type="button" data-aud="${a.id}" aria-pressed="${a.id === state.audience}">${esc(a.label)}</button>`).join('');
  };
  renderAudiences();
  $('#audiences').addEventListener('click', e => {
    const b = e.target.closest('button[data-aud]');
    if (!b) return;
    state.audience = b.dataset.aud;
    renderAudiences();
    if (state.mode === 'live') state.stale = state.audience !== state.runAudience;
    render();
  });

  $('#togglePaste').addEventListener('click', () => {
    const box = $('#pasteBox');
    box.hidden = !box.hidden;
    if (!box.hidden) { if (isSample()) $('#feedback').value = ''; $('#feedback').focus(); }
  });
  $('#feedback').addEventListener('input', e => { state.mode = state.mode === 'live' ? 'live' : 'demo'; setPaste(e.target.value); });
  $('#loadSample').addEventListener('click', useSample);
  $('#analyze').addEventListener('click', analyze);
  $('#fileInput').addEventListener('change', e => { const f = e.target.files[0]; e.target.value = ''; if (f) loadFile(f); });

  const src = $('#source');
  ['dragenter', 'dragover'].forEach(ev => src.addEventListener(ev, e => { e.preventDefault(); src.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => src.addEventListener(ev, () => src.classList.remove('over')));
  src.addEventListener('drop', e => { e.preventDefault(); const f = e.dataTransfer?.files?.[0]; if (f) loadFile(f); });

  // Effort picks update the call and feasibility in place, so open rows stay open.
  $('#results').addEventListener('change', e => {
    const sel = e.target.closest('select[data-effort]');
    if (!sel) return;
    if (sel.value) state.effort[sel.dataset.effort] = sel.value; else delete state.effort[sel.dataset.effort];
    const p = $('#results')._analysis.a.problems.find(x => x.key === sel.dataset.effort);
    $(`#call-${sel.dataset.i}`).innerHTML = decision(p) || '<span class="muted">–</span>';
    $(`#feas-${sel.dataset.i}`).textContent = feasibility(p);
  });

  $('#preview').addEventListener('change', e => {
    const sel = e.target.closest('select[data-field]');
    if (!sel || !state.table) return;
    const key = sel.dataset.field, val = Number(sel.value);
    Object.keys(state.table.mapping).forEach(k => { if (k !== key && val >= 0 && state.table.mapping[k] === val) state.table.mapping[k] = -1; });
    state.table.mapping[key] = val;
    refreshInput();
  });

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-toggle]');
    if (t) {
      const el = document.getElementById(t.dataset.toggle);
      el.hidden = !el.hidden;
      t.setAttribute('aria-expanded', String(!el.hidden));
      if (t.dataset.label) t.textContent = el.hidden ? t.dataset.label : 'Hide';
      return;
    }
    const act = e.target.closest('[data-action]')?.dataset.action;
    if (act === 'sample') useSample();
    if (act === 'moreProblems') { state.showAllProblems = !state.showAllProblems; render(); }
    if (act === 'copy') copyProblems();
    if (act === 'csv') downloadCsv();
  });

  useSample();

  // Open with #print to expand everything (used for PDF export).
  if (location.hash === '#print') {
    state.showAllProblems = true; render();
    document.querySelectorAll('details').forEach(d => { d.open = true; });
    document.querySelectorAll('tr.detail').forEach(r => { r.hidden = false; });
  }
})();
