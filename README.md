# njord.js

UI-kit för n8n · Aderian · v1.0.0

En enda JavaScript-fil som genererar kompletta, stilade HTML-sidor för Business Central-flöden i n8n. Ingen extern CSS, inga beroenden.

---

## Snabbstart

### 1. Hämta filen (HTTP Request-nod)

```
Method: GET
URL:    https://raw.githubusercontent.com/DITT-REPO/main/njord.js
Response: Text
```

### 2. Cachelagra (Code-nod — kör en gång)

```js
const cache = $getWorkflowStaticData('global');
const TTL = 60 * 60 * 1000; // 1 timme

if (!cache.njord || Date.now() - cache.njordTs > TTL) {
  cache.njord   = $('Hämta Njord').first().json.body;
  cache.njordTs = Date.now();
}

return [{ json: { ok: true } }];
```

### 3. Bygg en sida (Code-nod i varje flöde)

```js
const cache = $getWorkflowStaticData('global');
eval(cache.njord);

const co = $input.first().json.query?.company || 'ccit';

const html = njordPage({
  co,
  nav: [
    { group: 'Försäljning', items: [
      { label: 'Kunder',  href: '?company=' + co, iconKey: 'customers', active: true },
      { label: 'Ordrar',  href: '/webhook/bc-orders?company=' + co,     iconKey: 'orders' },
      { label: 'Fakturor',href: '/webhook/bc-invoices?company=' + co,   iconKey: 'invoices' },
    ]},
  ],
  breadcrumbs: [{ label: 'Kunder' }],
  title: 'Kunder',
  content: `
    ${njordPageHeader('Kunder', njordTheme(co).name, njordBtn('Ny kund', '#', 'p', 'plus'))}
    ${njordTable(
      [
        { label: 'Namn',   key: 'name' },
        { label: 'Nr',     key: 'no',      class: 'mono' },
        { label: 'Saldo',  key: 'balance', class: 'num' },
        { label: 'Status', key: 'status' },
      ],
      $input.first().json.value.map(c => ({
        name:    c.displayName,
        no:      c.number,
        balance: (c.balance || 0).toLocaleString('sv-SE') + ' kr',
        status:  njordBadge(c.blocked ? 'Spärrad' : 'Aktiv', c.blocked ? 'err' : 'ok', true),
        _href:   '/webhook/bc-customer?id=' + c.id + '&company=' + co,
      }))
    )}
  `,
});

return [{ json: { html } }];
```

---

## API

### `njordPage(options)` → string
Komplett HTML-sida. Alltid sista anropet.

| Option | Typ | Beskrivning |
|---|---|---|
| `co` | string | Bolagsnyckel: `kullander` \| `dnsit` \| `ccit` |
| `nav` | array | Navigationsstruktur (se nedan) |
| `breadcrumbs` | array | `[{ label, href? }]` — sista = aktuell sida |
| `content` | string | HTML-sträng för sidans innehåll |
| `title` | string | Sidtitel (`<title>`) |
| `homeHref` | string? | Override för hem-länken |

### `njordTheme(co)` → `{ name, short, accent, accentLight, accentDark }`

### `njordSidebar(nav, co)` → string
`nav`: `[ { group: string, items: [ { label, href, iconKey, active? } ] } ]`

### `njordTopbar(breadcrumbs, co, homeHref?)` → string

### `njordStatGrid(stats)` → string
`stats`: `[ { label, value, sub? } ]`

### `njordQuickGrid(items)` → string
`items`: `[ { label, href, iconKey } ]`

### `njordTable(cols, rows, emptyText?)` → string
- `cols`: `[ { label, key, width?, class? } ]` — class: `mono` | `num` | `muted`
- `rows`: `[ { [key]: value, _href? } ]`

### `njordBadge(text, type, withDot?)` → string
`type`: `ok` | `warn` | `err` | `info` | `grey`

### `njordAlert(text, type)` → string
`type`: `ok` | `warn` | `err` | `info`

### `njordBtn(label, href?, variant?, iconKey?)` → string
`variant`: `p` (primary) | `s` (secondary) | `o` (outline) | `ghost`

### `njordPageHeader(title, sub?, actionsHtml?)` → string

### `njordSectionLabel(text)` → string

### `njordDivider()` → string

---

## Ikonnycklar

`customers` `quotes` `orders` `invoices` `credits` `contracts` `overdue` `serial` `purchases` `crm` `plus` `search` `edit` `trash` `download` `alert` `check` `close` `arrow` `filter` `refresh`

---

## Bolag

| Nyckel | Namn | Accent |
|---|---|---|
| `kullander` | Kullander | `#0d8a7a` |
| `dnsit` | DNS IT | `#2563eb` |
| `ccit` | CC IT | `#1e28f5` |

Styrs av `?company=`-parametern i URL:en.
