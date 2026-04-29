// ════════════════════════════════════════════════════════════════
// NJORD — n8n HTML Kit
// Klistra in hela den här filen i en n8n Code-nod (JavaScript).
// Funktionen njordPage() genererar en komplett HTML-sida.
// Komponenterna är separata hjälpfunktioner du kan använda fritt.
// ════════════════════════════════════════════════════════════════

// ── Konfig ───────────────────────────────────────────────────────
const NJORD_COMPANIES = {
  kullander: { name: 'Kullander',  accent: '#0d8a7a', accentLight: '#e6f5f3' },
  dnsit:     { name: 'DNS IT',     accent: '#2563eb', accentLight: '#eff3ff' },
  ccit:      { name: 'CC IT',      accent: '#1e28f5', accentLight: '#eef0ff' },
};

// Hämta company från query param (eller sätt default)
const co = ($input.first().json.query?.company || 'ccit').toLowerCase();
const company = NJORD_COMPANIES[co] || NJORD_COMPANIES.ccit;
const { accent, accentLight } = company;

// ── CSS (inbakat, inga externa beroenden) ────────────────────────
const CSS = `
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;font-family:'Segoe UI',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;background:#f4f4f8;color:#0c0d12}

/* Layout */
.nj-layout{display:flex;height:100vh;overflow:hidden}
.nj-sidebar{width:216px;background:#0c0d12;display:flex;flex-direction:column;
  flex-shrink:0;overflow-y:auto;overflow-x:hidden}
.nj-main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}
.nj-topbar{height:52px;background:#fff;border-bottom:1px solid #e8eaef;
  padding:0 28px;display:flex;align-items:center;justify-content:space-between;
  flex-shrink:0;position:sticky;top:0;z-index:10}
.nj-content{flex:1;overflow-y:auto;padding:28px 32px}

/* Sidebar logo */
.nj-logo{padding:15px 18px 13px;border-bottom:1px solid rgba(255,255,255,.07);
  display:flex;align-items:center;gap:10px;text-decoration:none}
.nj-logo-title{color:#fff;font-size:15px;font-weight:700;letter-spacing:-.02em;line-height:1.1}
.nj-logo-sub{font-size:9px;letter-spacing:.12em;text-transform:uppercase;
  color:#04707b;margin-top:2px;font-weight:600}

/* Nav */
.nj-nav-group{padding-top:12px;padding-bottom:4px}
.nj-nav-label{padding:4px 18px;font-size:10px;font-weight:600;text-transform:uppercase;
  letter-spacing:.08em;color:rgba(255,255,255,.25)}
.nj-nav-item{display:flex;align-items:center;gap:9px;padding:7px 18px 7px 16px;
  font-size:13px;text-decoration:none;color:rgba(255,255,255,.5);
  border-left:2px solid transparent;transition:all .12s ease-out}
.nj-nav-item:hover{color:rgba(255,255,255,.85);background:rgba(255,255,255,.04)}
.nj-nav-item.active{color:#fff;background:rgba(255,255,255,.07);border-left-color:VAR_ACCENT}
.nj-nav-item svg{flex-shrink:0;opacity:.6}
.nj-nav-item:hover svg,.nj-nav-item.active svg{opacity:1}

/* Company switcher */
.nj-co-switcher{padding:12px 16px 16px;border-top:1px solid rgba(255,255,255,.07);
  display:flex;gap:6px;flex-wrap:wrap;margin-top:auto}
.nj-co-btn{padding:4px 11px;border-radius:9999px;font-size:11px;font-weight:500;
  text-decoration:none;border:1px solid rgba(255,255,255,.18);
  color:rgba(255,255,255,.5);transition:all .12s}
.nj-co-btn:hover{color:rgba(255,255,255,.85);border-color:rgba(255,255,255,.35)}
.nj-co-btn.active{color:#fff}

/* Topbar */
.nj-breadcrumb{display:flex;align-items:center;gap:6px;font-size:13px}
.nj-breadcrumb-home{color:#8589a0;text-decoration:none}
.nj-breadcrumb-sep{color:#c5c9d8}
.nj-breadcrumb-current{font-weight:500;color:#0c0d12}
.nj-avatar{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;
  justify-content:center;font-size:11px;font-weight:700}

/* Cards */
.nj-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px}
.nj-stat-card{background:#fff;border:1px solid #e8eaef;border-radius:12px;
  padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.nj-stat-label{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
  color:#8589a0;margin-bottom:8px}
.nj-stat-value{font-size:26px;font-weight:700;color:#0c0d12;letter-spacing:-.02em;line-height:1}
.nj-stat-sub{font-size:12px;font-weight:500;margin-top:5px}

.nj-card{background:#fff;border:1px solid #e8eaef;border-radius:12px;
  box-shadow:0 1px 3px rgba(0,0,0,.05)}

/* Quick grid */
.nj-quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.nj-quick-card{background:#fff;border:1px solid #e8eaef;border-radius:10px;
  padding:12px 14px;display:flex;align-items:center;gap:10px;
  text-decoration:none;color:#0c0d12;transition:all .15s ease-out}
.nj-quick-card:hover{border-color:VAR_ACCENT;box-shadow:0 4px 14px rgba(0,0,0,.09);
  transform:translateY(-1px)}
.nj-quick-icon{width:32px;height:32px;border-radius:8px;background:#f4f4f8;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s}
.nj-quick-card:hover .nj-quick-icon{background:VAR_ACCENT_LIGHT}
.nj-quick-label{font-size:13px;font-weight:500;white-space:nowrap}

/* Table */
.nj-table{width:100%;border-collapse:collapse}
.nj-table th{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;
  color:#8589a0;padding:11px 16px;text-align:left;background:#f9f9fb;border-bottom:1px solid #e8eaef}
.nj-table td{padding:13px 16px;font-size:13px;border-bottom:1px solid #f0f0f5;vertical-align:middle}
.nj-table tr:last-child td{border-bottom:none}
.nj-table tr:hover td{background:#fafafa}

/* Badges */
.nj-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;
  border-radius:4px;font-size:12px;font-weight:500;line-height:1.5}
.nj-badge-success{background:#d3f5e4;color:#1a8a4a}
.nj-badge-warning{background:#fef3d3;color:#c47d0a}
.nj-badge-danger{background:#fde8e8;color:#c7262a}
.nj-badge-info{background:#eef0ff;color:#1e28f5}
.nj-badge-neutral{background:#ebebf3;color:#63677d}
.nj-badge-dot{width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0}

/* Buttons */
.nj-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;
  border-radius:8px;font-size:13px;font-weight:600;font-family:inherit;
  border:none;cursor:pointer;transition:all .12s;text-decoration:none}
.nj-btn-primary{background:VAR_ACCENT;color:#fff}
.nj-btn-primary:hover{filter:brightness(.9)}
.nj-btn-secondary{background:#ebebf3;color:#323542}
.nj-btn-secondary:hover{background:#dde0ec}
.nj-btn-outline{background:transparent;color:VAR_ACCENT;border:1.5px solid VAR_ACCENT}
.nj-btn-outline:hover{background:VAR_ACCENT_LIGHT}

/* Section header */
.nj-section-title{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;
  color:#8589a0;margin-bottom:12px}
.nj-page-title{font-size:24px;font-weight:700;letter-spacing:-.025em;color:#0c0d12}
.nj-page-sub{font-size:13px;color:#8589a0;margin-top:3px}

/* Page header bar */
.nj-page-header{display:flex;align-items:flex-start;justify-content:space-between;
  margin-bottom:24px;gap:16px}

/* Empty state */
.nj-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:64px 32px;text-align:center;color:#8589a0}
.nj-empty-icon{width:48px;height:48px;border-radius:12px;background:#f4f4f8;
  display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
.nj-empty-title{font-size:15px;font-weight:600;color:#323542;margin-bottom:6px}
.nj-empty-body{font-size:13px;line-height:1.6;max-width:280px}

/* Alerts */
.nj-alert{padding:12px 16px;border-radius:8px;font-size:13px;
  display:flex;align-items:flex-start;gap:10px;line-height:1.5}
.nj-alert-success{background:#d3f5e4;color:#1a5c33}
.nj-alert-warning{background:#fef3d3;color:#7a4e08}
.nj-alert-danger{background:#fde8e8;color:#8b1a1c}
.nj-alert-info{background:#eef0ff;color:#1220a0}

/* Utility */
.nj-flex{display:flex}.nj-gap-2{gap:8px}.nj-gap-3{gap:12px}.nj-items-center{align-items:center}
.nj-justify-between{justify-content:space-between}.nj-mt-4{margin-top:16px}
.nj-mt-6{margin-top:24px}.nj-mb-4{margin-bottom:16px}.nj-mb-6{margin-bottom:24px}
.nj-w-full{width:100%}
</style>
`.replaceAll('VAR_ACCENT', accent).replaceAll('VAR_ACCENT_LIGHT', accentLight);

// ── SVG-ikoner ───────────────────────────────────────────────────
function icon(d, size = 14, color = 'currentColor') {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${d.split(' M').map((s,i) => `<path d="${i?'M':''}${s.trim()}"/>`).join('')}</svg>`;
}

const ICONS = {
  customers:  'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  quotes:     'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8',
  orders:     'M2 3h20v14H2z M8 21h8 M12 17v4',
  invoices:   'M2 5h20v14H2z M2 10h20',
  credits:    'M2 5h20v14H2z M2 10h20 M12 14v3 M10 15.5h4',
  contracts:  'M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34 M18 2l4 4-10 10H8v-4z',
  overdue:    'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  serial:     'M2 3h20v18H2z M7 8h10 M7 12h10 M7 16h6',
  purchases:  'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18',
  crm:        'M22 12h-4l-3 9L9 3l-3 9H2',
  plus:       'M12 5v14 M5 12h14',
  search:     'M21 21l-4.35-4.35 M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0',
  chevron:    'M9 18l6-6-6-6',
};

// ── Kompassikon (inline SVG) ─────────────────────────────────────
const COMPASS_SVG = `<svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" rx="8" fill="#1a1a2e"/>
<polygon points="20,5 22.5,17 20,15 17.5,17" fill="#fff"/>
<polygon points="20,35 22.5,24 20,26 17.5,24" fill="#04707b"/>
<polygon points="5,20 17,17.5 15,20 17,22.5" fill="#fff" opacity="0.65"/>
<polygon points="35,20 23,17.5 25,20 23,22.5" fill="#fff" opacity="0.65"/>
<circle cx="20" cy="20" r="4" fill="#04707b"/>
<circle cx="20" cy="20" r="2" fill="#fff"/>
<path d="M9 30 Q14.5 27 20 30 Q25.5 33 31 30" stroke="#04707b" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`;

// ════════════════════════════════════════════════════════════════
// KOMPONENTER
// Anropa dessa för att generera HTML-strängar.
// ════════════════════════════════════════════════════════════════

// ── Sidebar ──────────────────────────────────────────────────────
// nav: [ { group, items: [ { label, href, iconKey, active } ] } ]
function njordSidebar(nav = [], activeCo = co) {
  const navHtml = nav.map(group => {
    const items = group.items.map(item => `
      <a href="${item.href || '#'}" class="nj-nav-item${item.active ? ' active' : ''}">
        ${icon(ICONS[item.iconKey] || ICONS.orders, 13)}
        <span>${item.label}</span>
      </a>`).join('');
    return `<div class="nj-nav-group">
      <div class="nj-nav-label">${group.group}</div>
      ${items}
    </div>`;
  }).join('');

  const coButtons = Object.entries(NJORD_COMPANIES).map(([key, c]) => {
    const isActive = key === activeCo;
    const style = isActive ? `background:${c.accent};border-color:${c.accent};` : '';
    return `<a href="?company=${key}" class="nj-co-btn${isActive ? ' active' : ''}" style="${style}">${c.name}</a>`;
  }).join('');

  return `<div class="nj-sidebar">
    <div class="nj-logo">
      ${COMPASS_SVG}
      <div>
        <div class="nj-logo-title">Njord</div>
        <div class="nj-logo-sub">by Aderian</div>
      </div>
    </div>
    ${navHtml}
    <div style="flex:1"></div>
    <div class="nj-co-switcher">${coButtons}</div>
  </div>`;
}

// ── Topbar ───────────────────────────────────────────────────────
// breadcrumbs: [ { label, href? }, ... ]  (sista = aktuell sida)
function njordTopbar(breadcrumbs = [], { homeHref = '?company=' + co } = {}) {
  const crumbs = breadcrumbs.map((b, i) => {
    const isLast = i === breadcrumbs.length - 1;
    if (isLast) return `<span class="nj-breadcrumb-current">${b.label}</span>`;
    return `<a href="${b.href || '#'}" class="nj-breadcrumb-home">${b.label}</a>
            <span class="nj-breadcrumb-sep">/</span>`;
  }).join('');

  const coShort = company.name.replace(/\s/g, '').slice(0, 2).toUpperCase();

  return `<div class="nj-topbar">
    <nav class="nj-breadcrumb">
      <a href="${homeHref}" class="nj-breadcrumb-home">Start</a>
      ${breadcrumbs.length ? '<span class="nj-breadcrumb-sep">/</span>' + crumbs : ''}
    </nav>
    <div class="nj-flex nj-gap-2 nj-items-center">
      <span style="font-size:12px;color:#8589a0">${company.name}</span>
      <div class="nj-avatar" style="background:${accentLight};color:${accent}">${coShort}</div>
    </div>
  </div>`;
}

// ── Stat-kort ────────────────────────────────────────────────────
// stats: [ { label, value, sub? } ]
function njordStatGrid(stats = []) {
  const cards = stats.map(s => `
    <div class="nj-stat-card">
      <div class="nj-stat-label">${s.label}</div>
      <div class="nj-stat-value">${s.value}</div>
      ${s.sub ? `<div class="nj-stat-sub" style="color:${accent}">${s.sub}</div>` : ''}
    </div>`).join('');
  return `<div class="nj-stat-grid">${cards}</div>`;
}

// ── Snabbval-grid ────────────────────────────────────────────────
// items: [ { label, href, iconKey } ]
function njordQuickGrid(items = []) {
  const cards = items.map(item => `
    <a href="${item.href || '#'}" class="nj-quick-card">
      <div class="nj-quick-icon">
        ${icon(ICONS[item.iconKey] || ICONS.orders, 14, '#63677d')}
      </div>
      <span class="nj-quick-label">${item.label}</span>
    </a>`).join('');
  return `<div class="nj-quick-grid">${cards}</div>`;
}

// ── Tabell ───────────────────────────────────────────────────────
// cols: [ { label, key, width? } ]
// rows: [ { ...values, _href? } ]
function njordTable(cols = [], rows = []) {
  const thead = `<tr>${cols.map(c => `<th${c.width ? ` style="width:${c.width}"` : ''}>${c.label}</th>`).join('')}</tr>`;
  const tbody = rows.length
    ? rows.map(row => {
        const cells = cols.map(c => `<td>${row[c.key] ?? ''}</td>`).join('');
        return `<tr${row._href ? ` onclick="location.href='${row._href}'" style="cursor:pointer"` : ''}>${cells}</tr>`;
      }).join('')
    : `<tr><td colspan="${cols.length}"><div class="nj-empty">
        <div class="nj-empty-title">Inga poster hittades</div>
        <div class="nj-empty-body">Prova att ändra filter eller skapa en ny post.</div>
      </div></td></tr>`;
  return `<div class="nj-card"><table class="nj-table"><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>`;
}

// ── Badge ─────────────────────────────────────────────────────────
// type: success | warning | danger | info | neutral
function njordBadge(text, type = 'neutral', withDot = false) {
  return `<span class="nj-badge nj-badge-${type}">${withDot ? '<span class="nj-badge-dot"></span>' : ''}${text}</span>`;
}

// ── Alert ─────────────────────────────────────────────────────────
function njordAlert(text, type = 'info') {
  return `<div class="nj-alert nj-alert-${type}">${text}</div>`;
}

// ── Knapp ─────────────────────────────────────────────────────────
function njordBtn(label, href = '#', variant = 'primary', iconKey = null) {
  const ico = iconKey ? icon(ICONS[iconKey], 13) : '';
  return `<a href="${href}" class="nj-btn nj-btn-${variant}">${ico}${label}</a>`;
}

// ── Sidhuvud ─────────────────────────────────────────────────────
function njordPageHeader(title, sub = '', actions = '') {
  return `<div class="nj-page-header">
    <div>
      <div class="nj-page-title">${title}</div>
      ${sub ? `<div class="nj-page-sub">${sub}</div>` : ''}
    </div>
    ${actions ? `<div class="nj-flex nj-gap-2 nj-items-center">${actions}</div>` : ''}
  </div>`;
}

// ════════════════════════════════════════════════════════════════
// HUVUDFUNKTION — generera en komplett sida
// ════════════════════════════════════════════════════════════════
// nav:         navigationsstruktur (se njordSidebar)
// breadcrumbs: [ { label, href? } ]
// content:     HTML-sträng för huvudinnehållet
// title:       <title>-tagg
function njordPage({ nav = [], breadcrumbs = [], content = '', title = 'Njord' } = {}) {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Njord</title>
${CSS}
</head>
<body>
<div class="nj-layout">
  ${njordSidebar(nav)}
  <div class="nj-main">
    ${njordTopbar(breadcrumbs)}
    <div class="nj-content">
      ${content}
    </div>
  </div>
</div>
</body>
</html>`;
}

// ════════════════════════════════════════════════════════════════
// EXEMPEL — Startsida
// Byt ut det här mot din faktiska data från BC/webhook.
// ════════════════════════════════════════════════════════════════
const DEFAULT_NAV = [
  { group: 'CRM', items: [
    { label: 'Affärsmöjligheter', href: `/webhook/bc-crm?company=${co}`, iconKey: 'crm' }
  ]},
  { group: 'Försäljning', items: [
    { label: 'Kunder',             href: `/webhook/bc-customers?company=${co}`,  iconKey: 'customers' },
    { label: 'Offerter',           href: `/webhook/bc-quotes?company=${co}`,     iconKey: 'quotes' },
    { label: 'Ordrar',             href: `/webhook/bc-orders?company=${co}`,     iconKey: 'orders' },
    { label: 'Fakturor',           href: `/webhook/bc-invoices?company=${co}`,   iconKey: 'invoices' },
    { label: 'Kreditfakturor',     href: `/webhook/bc-creditmemos?company=${co}`,iconKey: 'credits' },
    { label: 'Avtal',              href: `/webhook/bc-contracts?company=${co}`,  iconKey: 'contracts' },
    { label: 'Förfallna fakturor', href: `/webhook/invoice-dashboard?company=${co}`, iconKey: 'overdue' },
    { label: 'Serienummer',        href: `/webhook/bc-serial`,                   iconKey: 'serial' },
  ]},
  { group: 'Inköp', items: [
    { label: 'Inköpsordrar', href: `/webhook/bc-purchases?company=${co}`, iconKey: 'purchases' }
  ]},
];

const homeContent = `
  ${njordPageHeader('Välkommen', `Business Central — ${company.name}`)}
  ${njordStatGrid([
    { label: 'Aktiva kunder',    value: '142',    sub: '+4 denna månad' },
    { label: 'Öppna ordrar',     value: '28',     sub: '3 kräver åtgärd' },
    { label: 'Utestående',       value: '1,2 Mkr',sub: '7 förfallna' },
    { label: 'Offert → Order',   value: '64%',    sub: 'Senaste 90 dagar' },
  ])}
  <div class="nj-section-title">Snabbval</div>
  ${njordQuickGrid([
    { label: 'Kunder',            href: `/webhook/bc-customers?company=${co}`,  iconKey: 'customers' },
    { label: 'Ordrar',            href: `/webhook/bc-orders?company=${co}`,     iconKey: 'orders' },
    { label: 'Fakturor',          href: `/webhook/bc-invoices?company=${co}`,   iconKey: 'invoices' },
    { label: 'Affärsmöjligheter', href: `/webhook/bc-crm?company=${co}`,        iconKey: 'crm' },
    { label: 'Avtal',             href: `/webhook/bc-contracts?company=${co}`,  iconKey: 'contracts' },
    { label: 'Förfallna',         href: `/webhook/invoice-dashboard?company=${co}`, iconKey: 'overdue' },
    { label: 'Inköpsordrar',      href: `/webhook/bc-purchases?company=${co}`,  iconKey: 'purchases' },
    { label: 'Serienummer',       href: `/webhook/bc-serial`,                    iconKey: 'serial' },
  ])}
`;

const html = njordPage({
  nav: DEFAULT_NAV,
  breadcrumbs: [],
  content: homeContent,
  title: 'Start',
});

return [{ json: { html } }];

// ════════════════════════════════════════════════════════════════
// EXEMPEL — Listvy (t.ex. Kunder)
// Kommentera ut exemplet ovan och använd det här istället.
// ════════════════════════════════════════════════════════════════
/*
const customers = $input.first().json.value || [];

const rows = customers.map(c => ({
  name:    c.displayName || c.name,
  no:      c.number,
  city:    c.city,
  balance: c.balance != null ? c.balance.toLocaleString('sv-SE') + ' kr' : '—',
  status:  njordBadge(c.blocked ? 'Spärrad' : 'Aktiv', c.blocked ? 'danger' : 'success', true),
  _href:   `/webhook/bc-customer-detail?id=${c.id}&company=${co}`,
}));

const listContent = `
  ${njordPageHeader(
    'Kunder',
    company.name,
    njordBtn('Ny kund', '#', 'primary', 'plus')
  )}
  ${njordTable(
    [
      { label: 'Namn',   key: 'name',    width: '35%' },
      { label: 'Nr',     key: 'no',      width: '10%' },
      { label: 'Ort',    key: 'city',    width: '20%' },
      { label: 'Saldo',  key: 'balance', width: '20%' },
      { label: 'Status', key: 'status',  width: '15%' },
    ],
    rows
  )}
`;

const html = njordPage({
  nav: DEFAULT_NAV.map(g => ({
    ...g,
    items: g.items.map(i => ({ ...i, active: i.iconKey === 'customers' }))
  })),
  breadcrumbs: [{ label: 'Kunder' }],
  content: listContent,
  title: 'Kunder',
});

return [{ json: { html } }];
*/
