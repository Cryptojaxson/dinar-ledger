// Dinar Ledger offline cache. Bump VERSION when you change any app file.
const VERSION = 'dinar-ledger-v7';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== 'dinar-reminders').map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // App pages (including shared-SMS links like ./?text=...): network first, fall back to cached app.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy));
      return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }

  // Fonts and app files: cache first, then fill the cache from the network.
  if (url.origin === location.origin || url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    })));
  }
});

// ---- Due-date reminders (best effort: Android decides when this runs, roughly daily) ----
const pad2 = n => String(n).padStart(2, '0');
const isoDay = d => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
const money = n => 'BD ' + (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

async function checkDue() {
  const cache = await caches.open('dinar-reminders');
  const res = await cache.match('./due.json'); if (!res) return;
  const items = await res.json();
  const today = isoDay(new Date());
  const last = await cache.match('./notified.txt');
  if (last && (await last.text()) === today) return;
  const due = items.filter(i => i.due && i.due <= today);
  if (!due.length) return;
  const line = i => (i.type === 'lent' ? `${i.who} owes you ${money(i.amount)}` : `You owe ${i.who} ${money(i.amount)}`) + (i.due < today ? ' (overdue)' : ' (due today)');
  await self.registration.showNotification(due.length === 1 ? 'Payment due' : due.length + ' payments due', {
    body: due.slice(0, 3).map(line).join('\n') + (due.length > 3 ? `\n+${due.length - 3} more` : ''),
    icon: 'icon-192.png?v=2', badge: 'icon-192.png?v=2', tag: 'dinar-due'
  });
  await cache.put('./notified.txt', new Response(today));
}

self.addEventListener('periodicsync', e => { if (e.tag === 'dinar-due-check') e.waitUntil(checkDue()); });

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow('./');
  }));
});
