// ════════════════════════════════════════════════════════════════
// njord.js — Njord UI Kit for n8n
// Version: 1.0.0
// Usage: eval() this file in a Code node after fetching from GitHub.
//
// Quick start:
//   1. HTTP Request node → GET raw GitHub URL → body as text
//   2. Code node → eval($('Fetch Njord').first().json.body)
//   3. Build your page: const html = njordPage({ nav, breadcrumbs, content })
//   4. return [{ json: { html } }]
//
// Caching (recommended):
//   const cache = $getWorkflowStaticData('global');
//   if (!cache.njord || Date.now() - cache.njordTs > 3600000) {
//     cache.njord = $('Fetch Njord').first().json.body;
//     cache.njordTs = Date.now();
//   }
//   eval(cache.njord);
// ════════════════════════════════════════════════════════════════


// ── 1. THEMES ────────────────────────────────────────────────────
const NJORD_THEMES = {
  kullander: { name: 'Kullander', short: 'KU', accent: '#0d8a7a', accentLight: '#e6f5f3', accentDark: '#0a6b5e' },
  dnsit:     { name: 'DNS IT',    short: 'DN', accent: '#2563eb', accentLight: '#eff3ff', accentDark: '#1d4ed8' },
  ccit:      { name: 'CC IT',     short: 'CC', accent: '#1e28f5', accentLight: '#eef0ff', accentDark: '#1820e0' },
};

// ── 2. ICONS ─────────────────────────────────────────────────────
const NJORD_ICONS = {
  crm:       'M22 12h-4l-3 9L9 3l-3 9H2',
  customers: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  quotes:    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8',
  orders:    'M2 3h20v14H2z M8 21h8 M12 17v4',
  invoices:  'M2 5h20v14H2z M2 10h20',
  credits:   'M2 5h20v14H2z M2 10h20 M12 14v3 M10 15.5h4',
  contracts: 'M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34 M18 2l4 4-10 10H8v-4z',
  overdue:   'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  serial:    'M2 3h20v18H2z M7 8h10 M7 12h10 M7 16h6',
  purchases: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18',
  plus:      'M12 5v14 M5 12h14',
  search:    'M21 21l-4.35-4.35 M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0',
  edit:      'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  trash:     'M3 6h18 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  download:  'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  alert:     'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01',
  check:     'M20 6L9 17l-5-5',
  close:     'M18 6L6 18 M6 6l12 12',
  arrow:     'M5 12h14 M12 5l7 7-7 7',
  filter:    'M22 3H2l8 9.46V19l4 2v-8.54L22 3',
  refresh:   'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
};

// ── 3. CSS ───────────────────────────────────────────────────────
// Injected per-page with theme variables substituted.
// Kept minimal — only what's needed for the layout + components.
function _njordCSS(theme) {
  const { accent, accentLight, accentDark } = theme;
  return `<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;
  -webkit-font-smoothing:antialiased;background:#f4f4f8;color:#0c0d12}

/* ─ Layout ─ */
.nj{display:flex;height:100vh;overflow:hidden}
.nj-sb{width:216px;background:#0c0d12;display:flex;flex-direction:column;
  flex-shrink:0;overflow-y:auto;overflow-x:hidden}
.nj-main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}
.nj-tb{height:52px;background:#fff;border-bottom:1px solid #e8eaef;
  padding:0 28px;display:flex;align-items:center;justify-content:space-between;
  flex-shrink:0}
.nj-body{flex:1;overflow-y:auto;padding:28px 32px}

/* ─ Sidebar ─ */
.nj-logo{padding:15px 18px 13px;border-bottom:1px solid rgba(255,255,255,.07);
  display:flex;align-items:center;gap:10px}
.nj-logo-name{color:#fff;font-size:15px;font-weight:700;letter-spacing:-.02em;line-height:1.1}
.nj-logo-sub{font-size:9px;letter-spacing:.12em;text-transform:uppercase;
  color:#04707b;margin-top:2px;font-weight:600}
.nj-ng{padding-top:12px;padding-bottom:4px}
.nj-ng-lbl{padding:4px 18px;font-size:10px;font-weight:600;text-transform:uppercase;
  letter-spacing:.08em;color:rgba(255,255,255,.25)}
.nj-ni{display:flex;align-items:center;gap:9px;padding:7px 18px 7px 16px;font-size:13px;
  text-decoration:none;color:rgba(255,255,255,.5);border-left:2px solid transparent;
  transition:color .12s,background .12s,border-color .12s}
.nj-ni:hover{color:rgba(255,255,255,.85);background:rgba(255,255,255,.04)}
.nj-ni.on{color:#fff;background:rgba(255,255,255,.08);border-left-color:${accent}}
.nj-ni svg{flex-shrink:0;opacity:.6;transition:opacity .12s}
.nj-ni:hover svg,.nj-ni.on svg{opacity:1}
.nj-cos{padding:12px 16px 16px;border-top:1px solid rgba(255,255,255,.07);
  display:flex;gap:6px;flex-wrap:wrap;margin-top:auto}
.nj-co{padding:4px 11px;border-radius:9999px;font-size:11px;font-weight:500;
  text-decoration:none;border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.5);
  transition:all .12s}
.nj-co:hover{color:rgba(255,255,255,.85);border-color:rgba(255,255,255,.35)}
.nj-co.on{color:#fff}

/* ─ Topbar ─ */
.nj-bc{display:flex;align-items:center;gap:6px;font-size:13px}
.nj-bc a{color:#8589a0;text-decoration:none}
.nj-bc a:hover{color:#323542}
.nj-bc-sep{color:#c5c9d8}
.nj-bc-cur{font-weight:500;color:#0c0d12}
.nj-av{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;
  justify-content:center;font-size:11px;font-weight:700;
  background:${accentLight};color:${accent}}

/* ─ Page header ─ */
.nj-ph{display:flex;align-items:flex-start;justify-content:space-between;
  margin-bottom:24px;gap:16px}
.nj-pt{font-size:24px;font-weight:700;letter-spacing:-.025em;color:#0c0d12}
.nj-ps{font-size:13px;color:#8589a0;margin-top:3px}

/* ─ Section label ─ */
.nj-sl{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;
  color:#8589a0;margin-bottom:12px}

/* ─ Stat grid ─ */
.nj-sg{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px}
.nj-sc{background:#fff;border:1px solid #e8eaef;border-radius:12px;
  padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.nj-sc-lbl{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
  color:#8589a0;margin-bottom:8px}
.nj-sc-val{font-size:26px;font-weight:700;color:#0c0d12;letter-spacing:-.02em;line-height:1}
.nj-sc-sub{font-size:12px;font-weight:500;margin-top:5px;color:${accent}}

/* ─ Quick grid ─ */
.nj-qg{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.nj-qc{background:#fff;border:1px solid #e8eaef;border-radius:10px;
  padding:12px 14px;display:flex;align-items:center;gap:10px;
  text-decoration:none;color:#0c0d12;transition:all .15s ease-out}
.nj-qc:hover{border-color:${accent};box-shadow:0 4px 14px rgba(0,0,0,.09);
  transform:translateY(-1px)}
.nj-qi{width:32px;height:32px;border-radius:8px;background:#f4f4f8;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s}
.nj-qc:hover .nj-qi{background:${accentLight}}
.nj-ql{font-size:13px;font-weight:500;white-space:nowrap}

/* ─ Card ─ */
.nj-card{background:#fff;border:1px solid #e8eaef;border-radius:12px;
  box-shadow:0 1px 3px rgba(0,0,0,.05);overflow:hidden}

/* ─ Table ─ */
.nj-tbl{width:100%;border-collapse:collapse}
.nj-tbl th{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;
  color:#8589a0;padding:11px 16px;text-align:left;background:#f9f9fb;
  border-bottom:1px solid #e8eaef;white-space:nowrap}
.nj-tbl td{padding:12px 16px;font-size:13px;border-bottom:1px solid #f0f0f5;
  vertical-align:middle;color:#0c0d12}
.nj-tbl tr:last-child td{border-bottom:none}
.nj-tbl tr.link:hover td{background:#fafafa;cursor:pointer}
.nj-tbl td.muted{color:#8589a0}
.nj-tbl td.mono{font-family:monospace;font-size:12px}
.nj-tbl td.num{text-align:right;font-variant-numeric:tabular-nums}

/* ─ Badge ─ */
.nj-b{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;
  border-radius:4px;font-size:12px;font-weight:500;line-height:1.5;white-space:nowrap}
.nj-b-dot{width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0}
.nj-b-ok{background:#d3f5e4;color:#1a8a4a}
.nj-b-warn{background:#fef3d3;color:#c47d0a}
.nj-b-err{background:#fde8e8;color:#c7262a}
.nj-b-info{background:${accentLight};color:${accent}}
.nj-b-grey{background:#ebebf3;color:#63677d}

/* ─ Alert ─ */
.nj-al{padding:12px 16px;border-radius:8px;font-size:13px;
  display:flex;align-items:flex-start;gap:10px;line-height:1.5;margin-bottom:16px}
.nj-al-ok{background:#d3f5e4;color:#1a5c33}
.nj-al-warn{background:#fef3d3;color:#7a4e08}
.nj-al-err{background:#fde8e8;color:#8b1a1c}
.nj-al-info{background:${accentLight};color:${accentDark}}

/* ─ Button ─ */
.nj-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;
  border-radius:8px;font-size:13px;font-weight:600;font-family:inherit;
  border:none;cursor:pointer;transition:all .12s;text-decoration:none;line-height:1}
.nj-btn-p{background:${accent};color:#fff}
.nj-btn-p:hover{background:${accentDark}}
.nj-btn-s{background:#ebebf3;color:#323542}
.nj-btn-s:hover{background:#dde0ec}
.nj-btn-o{background:transparent;color:${accent};border:1.5px solid ${accent}}
.nj-btn-o:hover{background:${accentLight}}
.nj-btn-sm{padding:6px 13px;font-size:12px;border-radius:6px}
.nj-btn-ghost{background:transparent;color:#63677d;border:1px solid #e8eaef}
.nj-btn-ghost:hover{background:#f4f4f8}

/* ─ Empty state ─ */
.nj-empty{display:flex;flex-direction:column;align-items:center;
  justify-content:center;padding:56px 32px;text-align:center;color:#8589a0}
.nj-empty-ico{width:44px;height:44px;border-radius:12px;background:#f4f4f8;
  display:flex;align-items:center;justify-content:center;margin:0 auto 14px}
.nj-empty-ttl{font-size:15px;font-weight:600;color:#323542;margin-bottom:6px}
.nj-empty-txt{font-size:13px;line-height:1.6;max-width:260px}

/* ─ Utility ─ */
.nj-flex{display:flex}.nj-wrap{flex-wrap:wrap}
.nj-col{flex-direction:column}.nj-gap-1{gap:4px}.nj-gap-2{gap:8px}
.nj-gap-3{gap:12px}.nj-gap-4{gap:16px}
.nj-ac{align-items:center}.nj-as{align-items:flex-start}
.nj-jb{justify-content:space-between}.nj-je{justify-content:flex-end}
.nj-mt-2{margin-top:8px}.nj-mt-4{margin-top:16px}.nj-mt-6{margin-top:24px}
.nj-mb-2{margin-bottom:8px}.nj-mb-4{margin-bottom:16px}.nj-mb-6{margin-bottom:24px}
.nj-w-full{width:100%}.nj-text-muted{color:#8589a0}.nj-text-sm{font-size:13px}
.nj-divider{height:1px;background:#e8eaef;margin:16px 0}
</style>`;
}

// ── 4. HELPER: SVG icon ──────────────────────────────────────────
function _ico(d, size, color) {
  size = size || 14; color = color || 'currentColor';
  const paths = d.split(' M').map(function(s, i) {
    return '<path d="' + (i ? 'M' : '') + s.trim() + '"/>';
  }).join('');
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
}

// ── 5. COMPASS LOGO SVG ──────────────────────────────────────────
var _COMPASS = '<svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#1a1a2e"/><polygon points="20,5 22.5,17 20,15 17.5,17" fill="#fff"/><polygon points="20,35 22.5,24 20,26 17.5,24" fill="#04707b"/><polygon points="5,20 17,17.5 15,20 17,22.5" fill="#fff" opacity="0.65"/><polygon points="35,20 23,17.5 25,20 23,22.5" fill="#fff" opacity="0.65"/><circle cx="20" cy="20" r="4" fill="#04707b"/><circle cx="20" cy="20" r="2" fill="#fff"/><path d="M9 30 Q14.5 27 20 30 Q25.5 33 31 30" stroke="#04707b" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';

// ════════════════════════════════════════════════════════════════
// 6. PUBLIC API
// ════════════════════════════════════════════════════════════════

// ── njordTheme(co) ───────────────────────────────────────────────
// Returns theme object for a company key. Falls back to ccit.
function njordTheme(co) {
  return NJORD_THEMES[co] || NJORD_THEMES.ccit;
}

// ── njordSidebar(nav, co) ────────────────────────────────────────
// nav: [ { group: string, items: [ { label, href, iconKey, active? } ] } ]
// co:  company key (kullander | dnsit | ccit)
function njordSidebar(nav, co) {
  var theme = njordTheme(co);
  var navHtml = (nav || []).map(function(g) {
    var items = (g.items || []).map(function(item) {
      var icoSvg = NJORD_ICONS[item.iconKey] ? _ico(NJORD_ICONS[item.iconKey], 13) : '';
      return '<a href="' + (item.href || '#') + '" class="nj-ni' + (item.active ? ' on' : '') + '">' + icoSvg + '<span>' + item.label + '</span></a>';
    }).join('');
    return '<div class="nj-ng"><div class="nj-ng-lbl">' + g.group + '</div>' + items + '</div>';
  }).join('');

  var coButtons = Object.keys(NJORD_THEMES).map(function(key) {
    var t = NJORD_THEMES[key];
    var isActive = key === co;
    var style = isActive ? 'background:' + t.accent + ';border-color:' + t.accent + ';' : '';
    return '<a href="?company=' + key + '" class="nj-co' + (isActive ? ' on' : '') + '" style="' + style + '">' + t.name + '</a>';
  }).join('');

  return '<div class="nj-sb">' +
    '<div class="nj-logo">' + _COMPASS + '<div><div class="nj-logo-name">Njord</div><div class="nj-logo-sub">Explore the sea</div></div></div>' +
    navHtml +
    '<div style="flex:1"></div>' +
    '<div class="nj-cos">' + coButtons + '</div>' +
    '</div>';
}

// ── njordTopbar(breadcrumbs, co, homeHref?) ──────────────────────
// breadcrumbs: [ { label, href? } ]  — last item = current page
function njordTopbar(breadcrumbs, co, homeHref) {
  var theme = njordTheme(co);
  homeHref = homeHref || ('?company=' + co);
  var crumbs = (breadcrumbs || []).map(function(b, i) {
    var isLast = i === breadcrumbs.length - 1;
    if (isLast) return '<span class="nj-bc-cur">' + b.label + '</span>';
    return '<a href="' + (b.href || '#') + '">' + b.label + '</a><span class="nj-bc-sep">/</span>';
  }).join('');

  return '<div class="nj-tb">' +
    '<nav class="nj-bc"><a href="' + homeHref + '">Start</a>' +
    (breadcrumbs && breadcrumbs.length ? '<span class="nj-bc-sep">/</span>' + crumbs : '') +
    '</nav>' +
    '<div class="nj-flex nj-gap-2 nj-ac">' +
    '<span class="nj-text-sm nj-text-muted">' + theme.name + '</span>' +
    '<div class="nj-av">' + theme.short + '</div>' +
    '</div></div>';
}

// ── njordStatGrid(stats) ─────────────────────────────────────────
// stats: [ { label, value, sub? } ]
function njordStatGrid(stats) {
  var cards = (stats || []).map(function(s) {
    return '<div class="nj-sc"><div class="nj-sc-lbl">' + s.label + '</div>' +
      '<div class="nj-sc-val">' + s.value + '</div>' +
      (s.sub ? '<div class="nj-sc-sub">' + s.sub + '</div>' : '') +
      '</div>';
  }).join('');
  return '<div class="nj-sg">' + cards + '</div>';
}

// ── njordQuickGrid(items) ────────────────────────────────────────
// items: [ { label, href, iconKey } ]
function njordQuickGrid(items) {
  var cards = (items || []).map(function(item) {
    var icoSvg = NJORD_ICONS[item.iconKey] ? _ico(NJORD_ICONS[item.iconKey], 14, '#63677d') : '';
    return '<a href="' + (item.href || '#') + '" class="nj-qc">' +
      '<div class="nj-qi">' + icoSvg + '</div>' +
      '<span class="nj-ql">' + item.label + '</span>' +
      '</a>';
  }).join('');
  return '<div class="nj-qg">' + cards + '</div>';
}

// ── njordTable(cols, rows, emptyText?) ───────────────────────────
// cols: [ { label, key, width?, class? } ]
// rows: [ { [key]: value, _href?, _class? } ]
function njordTable(cols, rows, emptyText) {
  var thead = '<tr>' + (cols || []).map(function(c) {
    return '<th' + (c.width ? ' style="width:' + c.width + '"' : '') + '>' + c.label + '</th>';
  }).join('') + '</tr>';

  var tbody;
  if (!rows || rows.length === 0) {
    tbody = '<tr><td colspan="' + (cols || []).length + '">' +
      '<div class="nj-empty">' +
      '<div class="nj-empty-ico">' + _ico(NJORD_ICONS.search, 20, '#adb1c5') + '</div>' +
      '<div class="nj-empty-ttl">Inga poster</div>' +
      '<div class="nj-empty-txt">' + (emptyText || 'Inga poster hittades.') + '</div>' +
      '</div></td></tr>';
  } else {
    tbody = rows.map(function(row) {
      var cells = (cols || []).map(function(c) {
        return '<td' + (c.class ? ' class="' + c.class + '"' : '') + '>' + (row[c.key] != null ? row[c.key] : '—') + '</td>';
      }).join('');
      var cls = row._href ? ' class="link"' : (row._class ? ' class="' + row._class + '"' : '');
      var onclick = row._href ? ' onclick="location.href=\'' + row._href + '\'"' : '';
      return '<tr' + cls + onclick + '>' + cells + '</tr>';
    }).join('');
  }

  return '<div class="nj-card"><table class="nj-tbl"><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table></div>';
}

// ── njordBadge(text, type, withDot?) ────────────────────────────
// type: ok | warn | err | info | grey
function njordBadge(text, type, withDot) {
  var cls = { ok: 'nj-b-ok', warn: 'nj-b-warn', err: 'nj-b-err', info: 'nj-b-info', grey: 'nj-b-grey' };
  var dot = withDot ? '<span class="nj-b-dot"></span>' : '';
  return '<span class="nj-b ' + (cls[type] || 'nj-b-grey') + '">' + dot + text + '</span>';
}

// ── njordAlert(text, type) ───────────────────────────────────────
// type: ok | warn | err | info
function njordAlert(text, type) {
  var cls = { ok: 'nj-al-ok', warn: 'nj-al-warn', err: 'nj-al-err', info: 'nj-al-info' };
  var ico = { ok: NJORD_ICONS.check, warn: NJORD_ICONS.alert, err: NJORD_ICONS.close, info: NJORD_ICONS.alert };
  return '<div class="nj-al ' + (cls[type] || 'nj-al-info') + '">' +
    (ico[type] ? _ico(ico[type], 15, 'currentColor') : '') +
    '<span>' + text + '</span></div>';
}

// ── njordBtn(label, href?, variant?, iconKey?) ───────────────────
// variant: p (primary) | s (secondary) | o (outline) | ghost | sm
function njordBtn(label, href, variant, iconKey) {
  href = href || '#';
  var variantCls = { p: 'nj-btn-p', s: 'nj-btn-s', o: 'nj-btn-o', ghost: 'nj-btn-ghost' };
  var cls = 'nj-btn ' + (variantCls[variant] || 'nj-btn-p');
  var icoHtml = iconKey && NJORD_ICONS[iconKey] ? _ico(NJORD_ICONS[iconKey], 13) : '';
  return '<a href="' + href + '" class="' + cls + '">' + icoHtml + label + '</a>';
}

// ── njordPageHeader(title, sub?, actionsHtml?) ───────────────────
function njordPageHeader(title, sub, actionsHtml) {
  return '<div class="nj-ph">' +
    '<div><div class="nj-pt">' + title + '</div>' +
    (sub ? '<div class="nj-ps">' + sub + '</div>' : '') +
    '</div>' +
    (actionsHtml ? '<div class="nj-flex nj-gap-2 nj-ac">' + actionsHtml + '</div>' : '') +
    '</div>';
}

// ── njordSectionLabel(text) ──────────────────────────────────────
function njordSectionLabel(text) {
  return '<div class="nj-sl">' + text + '</div>';
}

// ── njordDivider() ───────────────────────────────────────────────
function njordDivider() {
  return '<div class="nj-divider"></div>';
}

// ════════════════════════════════════════════════════════════════
// 7. MAIN FUNCTION — assemble a complete page
// ════════════════════════════════════════════════════════════════
// options: {
//   co:          string   — company key (kullander|dnsit|ccit)
//   nav:         array    — see njordSidebar
//   breadcrumbs: array    — see njordTopbar
//   content:     string   — HTML for the main body
//   title:       string   — <title> tag text
//   homeHref:    string?  — override home link
// }
function njordPage(options) {
  var co      = (options && options.co)          || 'ccit';
  var nav     = (options && options.nav)         || [];
  var crumbs  = (options && options.breadcrumbs) || [];
  var content = (options && options.content)     || '';
  var title   = (options && options.title)       || 'Njord';
  var homeHref= (options && options.homeHref);
  var theme   = njordTheme(co);

  return '<!DOCTYPE html>\n<html lang="sv">\n<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    '<title>' + title + ' \u2014 Njord</title>\n' +
    _njordCSS(theme) + '\n' +
    '</head>\n<body>\n' +
    '<div class="nj">\n' +
    njordSidebar(nav, co) + '\n' +
    '<div class="nj-main">\n' +
    njordTopbar(crumbs, co, homeHref) + '\n' +
    '<div class="nj-body">' + content + '</div>\n' +
    '</div>\n</div>\n</body>\n</html>';
}
