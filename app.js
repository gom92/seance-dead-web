/* Séance — Resurrect the Dead Web.
 * Zero-dependency front end. All data comes from the public Internet Archive
 * APIs (archive.org / web.archive.org). No keys, no backend, no tracking.
 */
'use strict';

const $ = (sel) => document.querySelector(sel);

/* ------------------------------------------------------------------ */
/* Graveyard: famous dead sites. Dates are public historical facts.    */
/* ------------------------------------------------------------------ */
const GRAVEYARD = [
  { name: 'GeoCities',       url: 'geocities.com',        born: 1994, died: 2009, cause: 'Yahoo shut it down; 38M pages evicted overnight.' },
  { name: 'Vine',            url: 'vine.co',              born: 2013, died: 2017, cause: 'Twitter pulled the plug on 6-second loops.' },
  { name: 'Google Reader',   url: 'reader.google.com',    born: 2005, died: 2013, cause: 'Killed in the Google spring cleaning.' },
  { name: 'Google+',         url: 'plus.google.com',      born: 2011, died: 2019, cause: 'Nobody came to the party; a data bug ended it.' },
  { name: 'MSN Messenger',   url: 'messenger.msn.com',    born: 1999, died: 2013, cause: 'Merged into Skype; the nudges fell silent.' },
  { name: 'Orkut',           url: 'orkut.com',            born: 2004, died: 2014, cause: 'Google retired it as Facebook won Brazil.' },
  { name: 'iGoogle',         url: 'google.com/ig',        born: 2005, died: 2013, cause: 'Personalised homepages went out of fashion.' },
  { name: 'Yahoo Answers',   url: 'answers.yahoo.com',    born: 2005, died: 2021, cause: 'Sixteen years of questions, then silence.' },
  { name: 'StumbleUpon',     url: 'stumbleupon.com',      born: 2001, died: 2018, cause: 'Folded into Mix; the random button stopped.' },
  { name: 'Adobe Flash',     url: 'adobe.com/flashplayer',born: 1996, died: 2020, cause: 'Browsers buried it; a whole era of games with it.' },
  { name: 'Internet Explorer', url: 'microsoft.com/ie',   born: 1995, died: 2022, cause: 'Microsoft retired it after 27 years of service.' },
  { name: 'Friendster',      url: 'friendster.com',       born: 2002, died: 2015, cause: 'The first social network, outrun by its children.' },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function normalizeUrl(raw) {
  let u = raw.trim().toLowerCase();
  u = u.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
  return u;
}
function hostOf(raw) {
  try { return new URL(raw.startsWith('http') ? raw : 'https://' + raw).hostname; }
  catch { return raw; }
}
function fmtDate(ts) { // Wayback timestamp YYYYMMDDhhmmss -> readable
  if (!ts || ts.length < 8) return 'unknown date';
  const y = ts.slice(0, 4), m = ts.slice(4, 6), d = ts.slice(6, 8);
  return `${y}-${m}-${d}`;
}
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/* ------------------------------------------------------------------ */
/* Wayback API calls                                                   */
/* ------------------------------------------------------------------ */
async function fetchClosestSnapshot(url) {
  const r = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`);
  if (!r.ok) throw new Error('Archive API answered ' + r.status);
  const j = await r.json();
  return j.archived_snapshots && j.archived_snapshots.closest ? j.archived_snapshots.closest : null;
}

async function fetchYearlySnapshots(url) {
  // One capture per year (collapse timestamp to year precision), 200-status only.
  const q = new URLSearchParams({
    url, output: 'json', fl: 'timestamp,original,statuscode',
    filter: 'statuscode:200', collapse: 'timestamp:4', limit: '60',
  });
  const r = await fetch(`https://web.archive.org/cdx/search/cdx?${q}`);
  if (!r.ok) throw new Error('CDX API answered ' + r.status);
  const rows = await r.json();
  return rows.slice(1).map(([timestamp, original]) => ({ timestamp, original }));
}

async function knockOnDoor(url) {
  // no-cors: resolves if anything answers at the network level, rejects on
  // DNS / connection failure. Cannot read the status — that is fine: we only
  // need "something lives there" vs "nothing answers at all".
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    await fetch('https://' + hostOf(url), { mode: 'no-cors', signal: ctrl.signal });
    clearTimeout(t);
    return true;
  } catch { return false; }
}

/* ------------------------------------------------------------------ */
/* Séance log (localStorage only)                                      */
/* ------------------------------------------------------------------ */
const LOG_KEY = 'seance-log-v1';
function readLog() { try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch { return []; } }
function writeLog(entries) { try { localStorage.setItem(LOG_KEY, JSON.stringify(entries.slice(0, 30))); } catch { /* private mode */ } }
function logSummon(url, verdict) {
  const entries = readLog().filter(e => e.url !== url);
  entries.unshift({ url, verdict, at: new Date().toISOString() });
  writeLog(entries);
  renderLog();
}
function renderLog() {
  const ul = $('#seance-log');
  const entries = readLog();
  if (!entries.length) { ul.innerHTML = '<li>No spirits summoned yet. The table is waiting.</li>'; return; }
  ul.innerHTML = entries.map(e => `
    <li><span><button data-url="${esc(e.url)}">${esc(e.url)}</button></span>
    <span class="${e.verdict === 'dead' ? 'dead-tag' : 'alive-tag'}">${e.verdict === 'dead' ? '☠ dead' : '● alive'}</span>
    <span>${esc(new Date(e.at).toLocaleString())}</span></li>`).join('');
  ul.querySelectorAll('button[data-url]').forEach(b =>
    b.addEventListener('click', () => summon(b.dataset.url)));
}

/* ------------------------------------------------------------------ */
/* The séance itself                                                   */
/* ------------------------------------------------------------------ */
let currentSite = null; // { url, closest, years }

async function summon(rawInput) {
  const url = normalizeUrl(rawInput);
  if (!url || !url.includes('.')) { setStatus('That does not look like a website. Try something like geocities.com.'); return; }
  const btn = $('#summon-btn');
  btn.disabled = true;
  btn.textContent = 'Consulting the spirits…';
  setStatus('Knocking on the door of ' + url + '…');
  $('#verdict-panel').classList.add('hidden');
  $('#timeline-wrap').classList.add('hidden');
  $('#viewer-wrap').classList.add('hidden');
  $('#obituary-wrap').classList.add('hidden');

  try {
    const [alive, closest] = await Promise.all([knockOnDoor(url), fetchClosestSnapshot(url)]);
    const verdict = (!alive && closest) ? 'dead' : (alive ? 'alive' : 'unknown');
    currentSite = { url, closest, years: [] };
    renderVerdict(url, alive, closest, verdict);
    logSummon(url, verdict === 'alive' ? 'alive' : 'dead');

    if (closest) {
      setStatus('The Archive remembers ' + url + '. Reading its timeline…');
      try {
        const years = await fetchYearlySnapshots(url);
        currentSite.years = years;
        renderTimeline(years);
      } catch (e) { setStatus('Timeline unreadable (' + e.message + ') — but the closest snapshot is shown below.'); }
      showSnapshot(closest.timestamp, closest.url);
      renderObituary(url, closest);
    } else {
      setStatus(alive
        ? 'It lives — and the Archive holds no ghost of it. Nothing to raise.'
        : 'No answer, and no ghost in the Archive. This one is truly gone.');
    }
  } catch (e) {
    setStatus('The spirits are silent: ' + e.message + '. Check the URL and try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Summon 👻';
  }
}

function renderVerdict(url, alive, closest, verdict) {
  const panel = $('#verdict-panel');
  panel.classList.remove('hidden');
  const v = $('#verdict');
  if (verdict === 'alive') {
    v.innerHTML = `<div class="verdict-card alive"><h3>● ${esc(url)} LIVES</h3>
      <p>Something still answers at this address. No séance required — but the Archive keeps a ghost anyway.</p>
      ${closest ? `<dl><dt>Last ghost seen</dt><dd>${fmtDate(closest.timestamp)}</dd>
      <dt>Snapshot</dt><dd><a href="${esc(closest.url)}" target="_blank" rel="noopener">${esc(closest.url)}</a></dd></dl>` : ''}</div>`;
  } else if (verdict === 'dead') {
    v.innerHTML = `<div class="verdict-card dead"><h3>☠ ${esc(url)} IS DEAD</h3>
      <p>Nothing answers at this address anymore. But the Internet Archive kept its soul.</p>
      <dl><dt>Last ghost seen</dt><dd>${fmtDate(closest.timestamp)}</dd>
      <dt>Snapshot</dt><dd><a href="${esc(closest.url)}" target="_blank" rel="noopener">${esc(closest.url)}</a></dd></dl></div>`;
  } else {
    v.innerHTML = `<div class="verdict-card dead"><h3>? ${esc(url)} — UNKNOWN</h3>
      <p>No answer, and the Archive holds no snapshot. Either the address is wrong, or this spirit left no trace.</p></div>`;
  }
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderTimeline(years) {
  const wrap = $('#timeline-wrap');
  const tl = $('#timeline');
  if (!years.length) { wrap.classList.add('hidden'); return; }
  wrap.classList.remove('hidden');
  tl.innerHTML = '';
  years.forEach(({ timestamp }) => {
    const year = timestamp.slice(0, 4);
    const b = document.createElement('button');
    b.textContent = year;
    b.addEventListener('click', () => {
      tl.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      showSnapshot(timestamp);
    });
    tl.appendChild(b);
  });
  tl.querySelector('button').classList.add('active');
}

function showSnapshot(timestamp, snapshotUrl) {
  const url = snapshotUrl || `https://web.archive.org/web/${timestamp}/${currentSite.url}`;
  $('#viewer-wrap').classList.remove('hidden');
  $('#viewer-label').textContent = `${currentSite.url} — as it was on ${fmtDate(timestamp)}`;
  $('#viewer').src = url;
  $('#viewer-open').href = url;
}

function renderObituary(url, closest) {
  const years = currentSite.years || [];
  const born = years.length ? years[0].timestamp.slice(0, 4) : 'unknown';
  const died = closest.timestamp.slice(0, 4);
  const grave = GRAVEYARD.find(g => g.url.replace(/^www\./, '') === url.replace(/^www\./, ''));
  const epitaph = grave ? grave.cause
    : 'It served its visitors faithfully, then one day simply stopped answering.';
  $('#obituary').textContent =
`In loving memory of ${url}
${born} — ${died}

${epitaph}

It is survived by its archived snapshots, kept by the Internet Archive,
and by everyone who still types its address from memory.

Rest in packets. 🕯️`;
  $('#obituary-wrap').classList.remove('hidden');
}

/* ------------------------------------------------------------------ */
/* Wiring                                                              */
/* ------------------------------------------------------------------ */
function setStatus(msg) { $('#summon-status').textContent = msg; }

function renderGraveyard() {
  const grid = $('#graveyard-grid');
  grid.innerHTML = GRAVEYARD.map(g => `
    <button class="tombstone" data-url="${esc(g.url)}">
      <span class="rip">R.I.P.</span>
      <span class="name">${esc(g.name)}</span>
      <span class="dates">${g.born} — ${g.died}</span>
      <p class="cause">${esc(g.cause)}</p>
    </button>`).join('');
  grid.querySelectorAll('.tombstone').forEach(b =>
    b.addEventListener('click', () => {
      $('#url-input').value = b.dataset.url;
      summon(b.dataset.url);
    }));
}

document.addEventListener('DOMContentLoaded', () => {
  renderGraveyard();
  renderLog();
  $('#summon-form').addEventListener('submit', (e) => { e.preventDefault(); summon($('#url-input').value); });
  document.querySelectorAll('.quick-summon button').forEach(b =>
    b.addEventListener('click', () => { $('#url-input').value = b.dataset.url; summon(b.dataset.url); }));
  $('#copy-obit').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('#obituary').textContent);
      $('#copy-note').textContent = 'Copied. Lay it to rest wherever you like.';
    } catch { $('#copy-note').textContent = 'Copy failed — select the text by hand.'; }
  });
  $('#clear-log').addEventListener('click', () => { writeLog([]); renderLog(); });
});
