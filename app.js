(() => {
'use strict';
const VERSION = '2.2.0';
const K = { col: 'pm_collection', rech: 'pm_recherches', par: 'pm_params', reco: 'pm_reco', imgs: 'pm_images' };
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
let col = load(K.col, []), rech = load(K.rech, []), par = load(K.par, { url: '', code: '' });
const save = () => {
  localStorage.setItem(K.col, JSON.stringify(col));
  localStorage.setItem(K.rech, JSON.stringify(rech));
  localStorage.setItem(K.par, JSON.stringify(par));
};
const app = document.getElementById('app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const euro = n => Math.round(+n || 0).toLocaleString('fr-FR') + ' €';
const jeux = n => n + (n > 1 ? ' jeux' : ' jeu');
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const pts = (l, v) => l + ' ' + '.'.repeat(Math.max(2, 12 - l.length)) + ' ' + v;
const jour = () => new Date().toISOString().slice(0, 10);
function graine(s) { // hasard identique toute la journée
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}
const melanger = (a, r = Math.random) => a.map(x => [r(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
const tailleEbay = (u, t) => String(u || '').replace(/s-l\d+\./, 's-l' + t + '.');
const ebayLien = q => 'https://www.ebay.fr/sch/i.html?_nkw=' + encodeURIComponent(q);
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2800);
}
const ICO = {
  dl: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
  ul: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>'
};

/* ---------- Données de référence ---------- */
const CATALOGUE = [
  ['Ball', 'AC-01', 1980, 'Silver'], ['Flagman', 'FL-02', 1980, 'Silver'], ['Vermin', 'MT-03', 1980, 'Silver'],
  ['Fire', 'RC-04', 1980, 'Silver'], ['Judge', 'IP-05', 1980, 'Silver'],
  ['Manhole', 'MH-06', 1981, 'Gold'], ['Helmet', 'CN-07', 1981, 'Gold'], ['Lion', 'LN-08', 1981, 'Gold'],
  ['Parachute', 'PR-21', 1981, 'Wide Screen'], ['Octopus', 'OC-22', 1981, 'Wide Screen'], ['Popeye', 'PP-23', 1981, 'Wide Screen'],
  ['Chef', 'FP-24', 1981, 'Wide Screen'], ['Mickey Mouse', 'MC-25', 1981, 'Wide Screen'], ['Egg', 'EG-26', 1981, 'Wide Screen'],
  ['Fire', 'FR-27', 1981, 'Wide Screen'], ['Turtle Bridge', 'TL-28', 1982, 'Wide Screen'], ['Fire Attack', 'ID-29', 1982, 'Wide Screen'],
  ['Snoopy Tennis', 'SP-30', 1982, 'Wide Screen'],
  ['Oil Panic', 'OP-51', 1982, 'Multi Screen'], ['Donkey Kong', 'DK-52', 1982, 'Multi Screen'], ['Mickey & Donald', 'DM-53', 1982, 'Multi Screen'],
  ['Green House', 'GH-54', 1982, 'Multi Screen'], ['Donkey Kong II', 'JR-55', 1983, 'Multi Screen'], ['Mario Bros.', 'MW-56', 1983, 'Multi Screen'],
  ['Rain Shower', 'LP-57', 1983, 'Multi Screen'], ['Life Boat', 'TC-58', 1983, 'Multi Screen'], ['Pinball', 'PB-59', 1983, 'Multi Screen'],
  ['Black Jack', 'BJ-60', 1985, 'Multi Screen'], ['Squish', 'MG-61', 1986, 'Multi Screen'], ['Bomb Sweeper', 'BD-62', 1987, 'Multi Screen'],
  ['Safebuster', 'JB-63', 1988, 'Multi Screen'], ['Gold Cliff', 'MV-64', 1988, 'Multi Screen'], ['Zelda', 'ZL-65', 1989, 'Multi Screen'],
  ['Donkey Kong Jr.', 'DJ-101', 1982, 'New Wide Screen'], ["Mario's Cement Factory", 'ML-102', 1983, 'New Wide Screen'],
  ['Manhole', 'NH-103', 1983, 'New Wide Screen'], ['Tropical Fish', 'TF-104', 1985, 'New Wide Screen'],
  ['Super Mario Bros.', 'YM-105', 1988, 'New Wide Screen'], ['Climber', 'DR-106', 1988, 'New Wide Screen'],
  ['Balloon Fight', 'BF-107', 1988, 'New Wide Screen'], ['Mario the Juggler', 'MB-108', 1991, 'New Wide Screen']
].map(([titre, reference, annee, gamme]) => ({ titre, reference, annee, gamme, fabricant: 'Nintendo' }));
const ETATS = ['Neuf', 'Excellent', 'Très bon', 'Bon', 'Moyen', 'Pour pièces'];
const MARCHE = ['Fonctionne', 'Ne fonctionne pas', 'Non testé'];
const COMPLET = ['Console seule', 'Avec boîte', 'Avec notice', 'Complet (boîte + notice)'];
const SUSPECT = /(repro|réplique|replica|coque|shell|boîte seule|box only|notice seule|manual only|for parts|lot de)/i;
const FAITS = [
  "Gunpei Yokoi aurait eu l'idée des Game & Watch en voyant un homme d'affaires s'amuser avec sa calculatrice dans le train.",
  'Le tout premier Game & Watch, Ball (AC-01), est sorti en 1980.',
  'La croix directionnelle est apparue pour la première fois sur le Game & Watch Donkey Kong (DK-52) en 1982.',
  "Chaque Game & Watch sert aussi d'horloge : c'est le « Watch » de son nom.",
  'Les modèles Multi Screen à deux écrans sont souvent cités comme une inspiration de la Nintendo DS.',
  'Mario the Juggler (MB-108), sorti en 1991, est le dernier Game & Watch de la série d\'origine.',
  'Nintendo a ressorti des Game & Watch Super Mario Bros. en 2020 et Zelda en 2021.',
  'Conseil : une boîte et une notice en bon état peuvent faire nettement monter la valeur d\'un jeu.',
  'Conseil : vérifiez toujours le compartiment à piles. Les traces d\'oxydation sont un défaut fréquent.',
  'Conseil : retirez les piles des jeux exposés pour éviter qu\'elles ne coulent.'
];

/* ---------- Photos (IndexedDB) ---------- */
const dbP = new Promise((ok, ko) => {
  const r = indexedDB.open('pocket-museum', 1);
  r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains('photos')) r.result.createObjectStore('photos'); };
  r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error);
});
async function idb(mode, fn) {
  const d = await dbP;
  return new Promise((ok, ko) => {
    const t = d.transaction('photos', mode); const req = fn(t.objectStore('photos'));
    t.oncomplete = () => ok(req && req.result); t.onerror = () => ko(t.error);
  });
}
const photoGet = id => idb('readonly', s => s.get(id));
const photoPut = (id, v) => idb('readwrite', s => s.put(v, id));
const photoDel = id => idb('readwrite', s => s.delete(id));
function reduire(file, max = 1200) {
  return new Promise((ok, ko) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src); ok(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => ko(new Error('Image illisible'));
    img.src = URL.createObjectURL(file);
  });
}

/* ---------- Relais (Worker Cloudflare) ---------- */
async function relais(action, extra = {}) {
  if (!par.url) throw new Error('Relais non configuré (Réglages)');
  const r = await fetch(par.url.replace(/\/+$/, ''), {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: par.code, action, ...extra })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.ok === false) throw new Error(j.erreur || j.error || 'Erreur ' + r.status);
  return j;
}
const ebayOk = () => par.url && par.ebay !== false;
const prixDe = a => {
  const v = a.prix ?? a.price?.value ?? a.price ?? a.extracted_price;
  return typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(',', '.').replace(/[^\d.]/g, '')) || 0;
};
const requete = j => [j.titre, j.reference, /game ?& ?watch/i.test(j.titre || '') ? '' : 'game watch'].filter(Boolean).join(' ');
const mediane = a => { a = [...a].sort((x, y) => x - y); const m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
function filtrer(a) {
  a = [...a].sort((x, y) => x - y); if (a.length < 4) return a;
  const q = p => a[Math.floor((a.length - 1) * p)], q1 = q(.25), q3 = q(.75), e = (q3 - q1) * 1.5;
  return a.filter(x => x >= q1 - e && x <= q3 + e);
}

/* ---------- Navigation ---------- */
let cur = null, choixLens = [], choixWeb = [], filtre = { q: '', fav: false }, autoLens = false;
function go(p, arg) {
  const cle = p === 'fiche' && !arg ? 'nouveau' : p;
  document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('on', b.dataset.go === cle));
  window.scrollTo(0, 0);
  ({ accueil: pAccueil, collection: pCollection, fiche: pFiche, recherches: pRecherches, reglages: pReglages })[p](arg);
}
const fond = j => {
  const ph = j.photos?.[0], web = j.imageWeb;
  return { attr: ph ? `data-ph="${ph}"` : web ? `style="background-image:url('${esc(web)}')"` : '', vide: !ph && !web };
};
const carte = j => {
  const f = fond(j);
  return `<button class="carte" data-fiche="${j.id}"><div class="img" ${f.attr}>${f.vide ? 'G&amp;W' : ''}</div>
  <div class="info"><b>${j.favori ? '★ ' : ''}${esc(j.titre)}</b><small>${esc([j.reference, j.annee].filter(Boolean).join(' · '))}</small>
  ${j.valeur ? `<div class="prix">${euro(j.valeur)}</div>` : ''}</div></button>`;
};
async function chargerPhotos() {
  for (const el of app.querySelectorAll('[data-ph]')) {
    const d = await photoGet(el.dataset.ph);
    if (d) el.style.backgroundImage = `url("${d}")`;
  }
}

/* ---------- Accueil ---------- */
const possedes = () => new Set(col.map(j => (j.reference || '').toUpperCase()).filter(Boolean));
const voulu = ref => rech.some(r => r.titre.toUpperCase().includes(ref));
const aDecouvrir = () => {
  const p = possedes();
  return melanger(CATALOGUE.filter(c => !p.has(c.reference) && !voulu(c.reference)), graine('d' + jour())).slice(0, 6);
};

function pAccueil() {
  const val = col.reduce((s, j) => s + (+j.valeur || 0), 0);
  const paye = col.reduce((s, j) => s + (+j.prixAchat || 0), 0);
  const est = col.filter(j => j.valeur).length;
  const pv = col.filter(j => j.valeur && j.prixAchat).reduce((s, j) => s + j.valeur - j.prixAchat, 0);
  const p = possedes(), nbCat = CATALOGUE.filter(c => p.has(c.reference)).length;
  const r = graine(jour());
  const vedette = col.length ? col[Math.floor(r() * col.length)] : null;
  const fait = FAITS[Math.floor(r() * FAITS.length)];
  const derniers = [...col].sort((a, b) => (b.ajout || 0) - (a.ajout || 0)).slice(0, 4);
  app.innerHTML = `
  <section class="console"><div class="rail"></div>
    <div class="lcd"><div class="lbl">Valeur de la collection</div><div class="gros">${euro(val)}</div>
    <div class="pt">${jeux(col.length)} · payé ${euro(paye)}</div></div>
    <div class="bas"><span>${rech.length} recherché${rech.length > 1 ? 's' : ''}</span>
    <span>${pv ? (pv > 0 ? '+' : '') + euro(pv) + ' de plus-value' : est + ' estimé' + (est > 1 ? 's' : '')}</span></div>
    <div class="prog-zone"><div class="prog"><span style="width:${Math.round(nbCat / CATALOGUE.length * 100)}%"></span></div>
    ${nbCat} / ${CATALOGUE.length} modèles Nintendo</div>
  <div class="rail"></div></section>

  <div class="actions">
    <button class="action" data-act="vite-photo"><i>📷</i>Identifier</button>
    <button class="action" data-go="nouveau"><i>＋</i>Ajouter</button>
    <button class="action" data-go="recherches"><i>☆</i>Recherchés</button>
  </div>

  ${taches()}

  <div class="sect"><h2>Bonnes affaires</h2><button class="lien" data-act="reco-maj">Actualiser</button></div>
  <p class="note">Annonces eBay pour vos recherchés et les modèles qui vous manquent.</p>
  <div id="reco" class="defile"><p class="vide petit">Chargement…</p></div>

  <div class="sect"><h2>À découvrir</h2></div>
  <p class="note">Une sélection qui change chaque jour.</p>
  <div id="decouv" class="defile"></div>

  ${vedette ? carteVedette(vedette) : ''}

  <div class="sect"><h2>Le saviez-vous ?</h2></div>
  <div class="lcd-cadre"><div class="lcd fait">${esc(fait)}</div></div>

  <div class="sect"><h2>Derniers ajouts</h2><button class="lien" data-go="collection">Toute la vitrine</button></div>
  ${col.length ? `<div class="grille">${derniers.map(carte).join('')}</div>`
    : `<p class="vide">Votre vitrine est vide.</p><button class="btn auto" data-go="nouveau">Ajouter mon premier jeu</button>`}`;
  chargerPhotos(); decouvertes(); recos(false);
}

function taches() {
  const t = [];
  if (!par.url) t.push(['⚙', 'Connectez le relais pour les estimations et les bonnes affaires', 'data-go="reglages"']);
  const sansPh = col.filter(j => !(j.photos || []).length && !j.imageWeb);
  if (sansPh.length) t.push(['📷', jeux(sansPh.length) + ' sans photo', `data-fiche="${sansPh[0].id}"`]);
  const nonEst = col.filter(j => !j.valeur);
  if (nonEst.length) t.push(['💶', jeux(nonEst.length) + ' à estimer', `data-fiche="${nonEst[0].id}"`]);
  const vieux = col.filter(j => j.releve && Date.now() - j.releve.date > 90 * 864e5);
  if (vieux.length) t.push(['⏳', jeux(vieux.length) + ' estimés il y a plus de 3 mois', `data-fiche="${vieux[0].id}"`]);
  if (col.length && (!par.sauve || Date.now() - par.sauve > 30 * 864e5)) t.push(['💾', 'Pensez à exporter une sauvegarde', 'data-go="reglages"']);
  if (!t.length) return '';
  return `<div class="sect"><h2>À faire</h2></div><div class="taches">${t.slice(0, 4).map(([i, txt, a]) =>
    `<button class="tache" ${a}><i>${i}</i><span>${esc(txt)}</span><b>›</b></button>`).join('')}</div>`;
}

const carteVedette = j => {
  const f = fond(j);
  return `<button class="vedette" data-fiche="${j.id}"><div class="img" ${f.attr}>${f.vide ? 'G&amp;W' : ''}</div>
  <div><small>Pièce du jour</small><b>${esc(j.titre)}</b><span>${esc([j.reference, j.gamme, j.annee].filter(Boolean).join(' · '))}</span>
  ${j.valeur ? `<div class="prix">${euro(j.valeur)}</div>` : ''}</div></button>`;
};

function decouvertes() {
  const box = document.getElementById('decouv'); if (!box) return;
  const l = aDecouvrir(), imgs = load(K.imgs, {});
  if (!l.length) { box.innerHTML = '<p class="vide petit">Bravo, il ne vous manque plus rien du catalogue !</p>'; return; }
  box.innerHTML = l.map(c => {
    const img = imgs[c.reference];
    return `<div class="carte decouv"><div class="img" data-dimg="${c.reference}" ${img ? `style="background-image:url('${esc(img)}')"` : ''}>${img ? '' : `<span class="ref">${c.reference}</span>`}</div>
    <div class="info"><b>${esc(c.titre)}</b><small>${c.gamme} · ${c.annee}</small>
    <div class="mini"><button data-act="vouloir" data-ref="${c.reference}">☆ Je le veux</button>
    <a href="${ebayLien(c.titre + ' ' + c.reference + ' game watch')}" target="_blank" rel="noopener">eBay ›</a></div></div></div>`;
  }).join('');
  imagesDecouv(l);
}
async function imagesDecouv(l) { // une seule recherche eBay par modèle, puis gardée en mémoire
  if (!ebayOk()) return;
  const imgs = load(K.imgs, {});
  for (const c of l) {
    if (imgs[c.reference] !== undefined) continue;
    try {
      const r = await relais('ebay', { q: c.titre + ' ' + c.reference + ' game watch', limit: 10 });
      const a = (r.annonces || []).find(x => x.image && !SUSPECT.test(x.titre || ''));
      imgs[c.reference] = a ? tailleEbay(a.image, 500) : '';
      localStorage.setItem(K.imgs, JSON.stringify(imgs));
      const el = document.querySelector(`[data-dimg="${c.reference}"]`);
      if (el && imgs[c.reference]) { el.style.backgroundImage = `url('${imgs[c.reference]}')`; el.innerHTML = ''; }
    } catch { break; }
  }
}

async function recos(force) {
  const box = document.getElementById('reco'); if (!box) return;
  const msg = t => { box.innerHTML = `<p class="vide petit">${t}</p>`; };
  if (!par.url) return msg('Configurez le relais dans Réglages pour voir les bonnes affaires eBay.');
  if (par.ebay === false) return msg('eBay n\'est pas configuré sur le relais.');
  let c = load(K.reco, null);
  if (force || !c || Date.now() - c.t > 12 * 3600e3) {
    msg('Recherche sur eBay…');
    const p = possedes();
    const cibles = [
      ...rech.map(r => ({ q: r.titre, max: +r.max || 0 })),
      ...melanger(CATALOGUE.filter(x => !p.has(x.reference))).map(x => ({ q: x.titre + ' ' + x.reference, max: 0 }))
    ].slice(0, 4);
    const items = [], vus = new Set(); let erreur = '';
    for (const ci of cibles) {
      try {
        const r = await relais('ebay', { q: ci.q + (/game ?& ?watch/i.test(ci.q) ? '' : ' game watch'), limit: 20 });
        let n = 0;
        for (const a of r.annonces || []) {
          if (n >= 3 || !a.image || !a.url || vus.has(a.url) || SUSPECT.test(a.titre || '')) continue;
          vus.add(a.url); n++;
          const pr = prixDe(a);
          items.push({ titre: a.titre, prix: pr, url: a.url, image: tailleEbay(a.image, 500), bon: !!(ci.max && pr && pr <= ci.max) });
        }
      } catch (e) { erreur = e.message; }
    }
    if (!items.length) return msg(erreur ? '⚠️ ' + esc(erreur) : 'Aucune annonce pour le moment.');
    items.sort((a, b) => b.bon - a.bon);
    c = { t: Date.now(), items }; localStorage.setItem(K.reco, JSON.stringify(c));
  }
  box.innerHTML = c.items.map(x => `<a class="carte" href="${esc(x.url)}" target="_blank" rel="noopener">
    <div class="img" style="background-image:url('${esc(x.image)}')"></div>
    <div class="info"><b>${esc(x.titre)}</b>${x.bon ? '<span class="badge">Bon prix</span>' : ''}
    <div class="prix">${x.prix ? euro(x.prix) : ''}</div></div></a>`).join('');
}

/* ---------- Collection ---------- */
function pCollection() {
  app.innerHTML = `<div class="titre-page"><h2>La vitrine</h2><p>${jeux(col.length)} exposé${col.length > 1 ? 's' : ''}</p></div>
  <div class="barre"><input id="q" type="search" placeholder="Titre, référence…" value="${esc(filtre.q)}">
  <button class="btn petit ${filtre.fav ? '' : 'sec'}" data-act="fav-filtre">★</button></div>
  <div id="liste"></div><button class="btn" data-go="nouveau">Ajouter un jeu</button>`;
  document.getElementById('q').addEventListener('input', e => { filtre.q = e.target.value; liste(); });
  liste();
}
function liste() {
  const q = filtre.q.toLowerCase().trim();
  const l = col.filter(j => (!filtre.fav || j.favori) && (!q || [j.titre, j.reference, j.fabricant, j.gamme].join(' ').toLowerCase().includes(q)))
    .sort((a, b) => (b.ajout || 0) - (a.ajout || 0));
  document.getElementById('liste').innerHTML = l.length ? `<div class="grille">${l.map(carte).join('')}</div>` : '<p class="vide">Aucun jeu trouvé.</p>';
  chargerPhotos();
}

/* ---------- Fiche d'un jeu ---------- */
const releveTxt = () => cur.releve ? `${cur.releve.n} annonces · ${new Date(cur.releve.date).toLocaleDateString('fr-FR')}` : 'Pas encore estimée';
function maj(champs) { const j = col.find(x => x.id === cur.id); if (j) { Object.assign(j, champs); save(); } }
function pFiche(id) {
  const j = col.find(x => x.id === id);
  cur = j ? structuredClone(j) : { id: uid(), ajout: Date.now(), fabricant: 'Nintendo', photos: [] };
  cur.photos = cur.photos || [];
  choixLens = []; choixWeb = [];
  const nouveau = !j;
  const f = (n, l, t = 'text', x = '') => `<label class="champ"><span>${l}</span><input name="${n}" type="${t}" value="${esc(cur[n])}" ${x}></label>`;
  const s = (n, l, arr) => `<label class="champ"><span>${l}</span><select name="${n}"><option value=""></option>${arr.map(o => `<option ${o === cur[n] ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select></label>`;
  app.innerHTML = `
  <div class="titre-page"><h2>${nouveau ? 'Nouveau jeu' : esc(cur.titre)}</h2><p>${nouveau ? 'Une nouvelle pièce pour la vitrine' : esc([cur.reference, cur.annee].filter(Boolean).join(' · '))}</p></div>
  <div class="lcd-cadre"><div class="lcd lcd-val"><div class="lbl">Valeur estimée</div>
  <div class="moyen" id="val">${cur.valeur ? euro(cur.valeur) : '-- €'}</div><div class="pt" id="releve">${releveTxt()}</div></div></div>
  <h3 class="h3">Photos</h3><div class="photos" id="photos"></div>
  <div class="deux">
    <label class="btn sec">📷 Appareil photo<input type="file" accept="image/*" capture="environment" hidden data-in="photo"></label>
    <label class="btn sec">🖼 Galerie<input type="file" accept="image/*" multiple hidden data-in="photo"></label>
  </div>
  <div class="deux"><button class="btn sec" data-act="lens">🔍 Identifier</button><button class="btn sec" data-act="web">🛒 Photo eBay</button></div>
  <div id="choix"></div>
  <h3 class="h3">Fiche</h3>
  ${nouveau ? `<label class="champ"><span>Choisir dans le catalogue</span><select id="cat"><option value="">— Saisie libre —</option>
    ${CATALOGUE.map((c, i) => `<option value="${i}">${esc(c.titre)} (${c.reference})</option>`).join('')}</select></label>` : ''}
  <form id="form" onsubmit="return false">
    ${f('titre', 'Titre *')}
    <div class="deux">${f('fabricant', 'Fabricant')}${f('reference', 'Référence')}</div>
    <div class="deux">${f('gamme', 'Gamme')}${f('annee', 'Année', 'number', 'inputmode="numeric"')}</div>
    <div class="deux">${s('etat', 'État', ETATS)}${s('fonctionnement', 'Fonctionnement', MARCHE)}</div>
    ${s('completude', 'Complétude', COMPLET)}
    <div class="deux">${f('prixAchat', "Prix d'achat (€)", 'number', 'inputmode="decimal" step="0.01"')}${f('dateAchat', "Date d'achat", 'date')}</div>
    ${f('numeroSerie', 'N° de série')}
    <label class="champ"><span>Notes</span><textarea name="notes" rows="3">${esc(cur.notes)}</textarea></label>
    <label class="case"><input type="checkbox" name="favori" ${cur.favori ? 'checked' : ''}> ★ Pièce favorite</label>
  </form>
  <button class="btn" data-act="enregistrer">Enregistrer</button>
  <button class="btn sec" data-act="estimer">Estimer la valeur</button>
  ${nouveau ? '' : '<button class="btn sec danger" data-act="suppr">Supprimer ce jeu</button>'}`;
  app.querySelectorAll('[data-in=photo]').forEach(i => i.addEventListener('change', ajoutPhotos));
  const cat = document.getElementById('cat');
  if (cat) cat.addEventListener('change', () => { const c = CATALOGUE[cat.value]; if (c) remplir(c); });
  renderPhotos();
}
function remplir(o) {
  const fm = document.getElementById('form');
  for (const [k, v] of Object.entries(o)) if (fm.elements[k]) fm.elements[k].value = v;
}
function lireForm() {
  const fm = document.getElementById('form'); if (!fm) return;
  for (const el of fm.elements) {
    if (!el.name) continue;
    cur[el.name] = el.type === 'checkbox' ? el.checked : el.type === 'number' ? (el.value === '' ? '' : +el.value) : el.value.trim();
  }
}
async function renderPhotos() {
  const box = document.getElementById('photos'); if (!box) return;
  const h = [];
  for (const id of cur.photos) {
    const d = await photoGet(id);
    if (d) h.push(`<div class="ph" style="background-image:url('${d}')"><button data-act="ph-suppr" data-id="${id}">✕</button></div>`);
  }
  if (cur.imageWeb) h.push(`<div class="ph" style="background-image:url('${esc(cur.imageWeb)}')"><span>eBay</span><button data-act="web-suppr">✕</button></div>`);
  box.innerHTML = h.join('') || '<p class="note">Aucune photo pour l\'instant.</p>';
}
async function ajoutPhotos(e) {
  try {
    for (const file of e.target.files) {
      const id = 'ph_' + uid(); await photoPut(id, await reduire(file)); cur.photos.push(id);
    }
    maj({ photos: [...cur.photos] }); renderPhotos(); toast('Photo ajoutée');
    if (autoLens) { autoLens = false; ACTIONS.lens().catch(err => toast('⚠️ ' + err.message)); }
  } catch (err) { toast('⚠️ ' + err.message); }
  e.target.value = '';
}

/* ---------- Recherchés ---------- */
function pRecherches() {
  app.innerHTML = `<div class="titre-page"><h2>Recherchés</h2><p>Les pièces qui manquent à la vitrine</p></div>
  <label class="champ"><span>Jeu recherché</span><input id="r-titre" list="r-cat" placeholder="ex. Octopus OC-22"></label>
  <datalist id="r-cat">${CATALOGUE.map(c => `<option value="${esc(c.titre + ' ' + c.reference)}">`).join('')}</datalist>
  <label class="champ"><span>Prix maximum (€)</span><input id="r-max" type="number" inputmode="decimal"></label>
  <button class="btn" data-act="rech-ajout">Ajouter à la liste</button>
  ${rech.length ? rech.map((r, i) => `<div class="item"><div><b>${esc(r.titre)}</b><small>${r.max ? 'max ' + euro(r.max) : 'pas de prix max'}</small></div>
    <a class="btn petit sec" target="_blank" rel="noopener" href="${ebayLien(r.titre + ' game watch')}">eBay</a>
    <button class="btn petit sec" data-act="rech-suppr" data-i="${i}">✕</button></div>`).join('') : '<p class="vide">Aucun jeu recherché.</p>'}`;
}

/* ---------- Réglages et sauvegarde ---------- */
async function pReglages() {
  const nbPh = await idb('readonly', s => s.count()).catch(() => 0);
  app.innerHTML = `<div class="titre-page"><h2>Relais</h2><p>Connexion à votre Worker Cloudflare</p></div>
  <label class="champ"><span>Adresse du Worker</span><input id="p-url" type="url" placeholder="https://pocket-museum-relay.xxx.workers.dev" value="${esc(par.url)}"></label>
  <label class="champ"><span>Code secret</span><input id="p-code" type="password" value="${esc(par.code)}"></label>
  <button class="btn" data-act="par-save">Enregistrer et tester</button>
  <div class="lcd-cadre" id="test" hidden><div class="lcd lcd-liste" id="test-txt"></div></div>
  <div class="titre-page"><h2>Sauvegarde</h2><p>Vos données restent sur ce téléphone</p></div>
  <div class="lcd-cadre"><div class="lcd lcd-liste">${pts('Jeux', col.length)}\n${pts('Photos', nbPh)}\n${pts('Recherchés', rech.length)}</div></div>
  <button class="btn" data-act="export">${ICO.dl} Exporter (photos incluses)</button>
  <label class="btn sec">${ICO.ul} Restaurer une sauvegarde<input type="file" accept="application/json,.json" hidden id="imp"></label>
  <p class="note">Pas de compte, pas de cloud : pensez à exporter régulièrement. Pour installer l'app, utilisez « Ajouter à l'écran d'accueil » dans votre navigateur.</p>
  <button class="btn sec danger" data-act="effacer">Tout effacer</button>
  <p class="note centre">Pocket Museum v${VERSION}</p>`;
  document.getElementById('imp').addEventListener('change', importer);
}
async function importer(e) {
  const fichier = e.target.files[0]; if (!fichier) return;
  try {
    const d = JSON.parse(await fichier.text());
    if (!Array.isArray(d.collection)) throw new Error('Fichier invalide');
    if (!confirm(`Remplacer vos données par cette sauvegarde (${jeux(d.collection.length)}) ?`)) return;
    await idb('readwrite', s => s.clear());
    for (const [id, v] of Object.entries(d.photos || {})) await photoPut(id, v);
    col = d.collection; rech = d.recherches || []; save(); localStorage.removeItem(K.reco);
    toast('Sauvegarde restaurée'); go('accueil');
  } catch (err) { toast('⚠️ ' + err.message); } finally { e.target.value = ''; }
}

/* ---------- Actions ---------- */
const ACTIONS = {
  'reco-maj': () => recos(true),
  'fav-filtre': () => { filtre.fav = !filtre.fav; pCollection(); },
  'vite-photo': () => {
    go('fiche'); autoLens = true;
    app.querySelector('input[capture]')?.click();
    toast('Photographiez le jeu : il sera identifié automatiquement');
  },
  vouloir: el => {
    const c = CATALOGUE.find(x => x.reference === el.dataset.ref); if (!c) return;
    if (!voulu(c.reference)) rech.push({ id: uid(), titre: c.titre + ' ' + c.reference, max: 0 });
    save(); toast('☆ ' + c.titre + ' ajouté aux recherchés'); pAccueil();
  },

  enregistrer: () => {
    lireForm(); if (!cur.titre) return toast('Le titre est obligatoire');
    const i = col.findIndex(x => x.id === cur.id);
    if (i >= 0) col[i] = cur; else col.push(cur);
    save(); toast('Enregistré ✓'); go('fiche', cur.id);
  },
  suppr: async () => {
    if (!confirm('Supprimer ce jeu et ses photos ?')) return;
    for (const id of cur.photos) await photoDel(id);
    col = col.filter(x => x.id !== cur.id); save(); toast('Jeu supprimé'); go('collection');
  },
  'ph-suppr': async el => {
    cur.photos = cur.photos.filter(x => x !== el.dataset.id); await photoDel(el.dataset.id);
    maj({ photos: [...cur.photos] }); renderPhotos();
  },
  'web-suppr': () => { cur.imageWeb = ''; maj({ imageWeb: '' }); renderPhotos(); },

  // Estimation : eBay (clés eBay) + Vinted/Leboncoin (SerpApi)
  estimer: async () => {
    lireForm(); if (!cur.titre) return toast('Indiquez d\'abord le titre');
    const q = requete(cur); toast('Recherche des annonces…');
    const taches = [];
    if (par.ebay !== false) taches.push(['eBay', relais('ebay', { q })]);
    taches.push(['Vinted/Leboncoin', relais('annonces', { q })]);
    const res = await Promise.allSettled(taches.map(t => t[1]));
    const prix = [], ok = [], ko = [];
    res.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        ok.push(taches[i][0]);
        prix.push(...(r.value.annonces || []).filter(a => !SUSPECT.test(a.titre || a.title || '')).map(prixDe).filter(p => p > 1 && p < 5000));
      } else ko.push(taches[i][0]);
    });
    if (!prix.length) { const err = res.find(r => r.status === 'rejected'); return toast(err ? '⚠️ ' + err.reason.message : 'Aucune annonce trouvée'); }
    const garde = filtrer(prix);
    cur.valeur = Math.round(mediane(garde)); cur.releve = { date: Date.now(), n: garde.length, sources: ok };
    maj({ valeur: cur.valeur, releve: cur.releve });
    document.getElementById('val').textContent = euro(cur.valeur);
    document.getElementById('releve').textContent = releveTxt();
    toast('Valeur estimée' + (ko.length ? ' (sans ' + ko.join(', ') + ')' : ''));
  },

  // Identification par photo : Google Lens (SerpApi)
  lens: async () => {
    if (!cur.photos.length) return toast('Ajoutez d\'abord une photo');
    toast('Identification…');
    const r = await relais('lens', { image: await photoGet(cur.photos[0]) });
    choixLens = (r.matches || []).slice(0, 8);
    document.getElementById('choix').innerHTML = choixLens.length
      ? '<p class="note">Touchez le bon résultat :</p>' + choixLens.map((m, i) => `<button class="ligne" data-act="lens-choix" data-i="${i}"><img src="${esc(m.thumbnail || '')}" alt=""><span>${esc(m.title || '')}</span></button>`).join('')
      : '<p class="note">Aucun résultat.</p>';
  },
  'lens-choix': el => {
    const t = (choixLens[el.dataset.i]?.title || '').toLowerCase();
    const c = CATALOGUE.find(x => t.includes(x.reference.toLowerCase()))
      || [...CATALOGUE].sort((a, b) => b.titre.length - a.titre.length).find(x => t.includes(x.titre.toLowerCase()));
    remplir(c || { titre: (choixLens[el.dataset.i]?.title || '').slice(0, 80) });
    document.getElementById('choix').innerHTML = ''; toast(c ? 'Modèle reconnu : ' + c.titre : 'Titre repris');
  },

  // Photo d'illustration : annonces eBay (clés eBay, 0 SerpApi)
  web: async () => {
    lireForm(); if (!cur.titre) return toast('Indiquez d\'abord le titre');
    if (par.ebay === false) return toast('eBay n\'est pas configuré sur le relais');
    toast('Recherche de photos sur eBay…');
    const r = await relais('ebay', { q: requete(cur), limit: 30 });
    const vus = new Set();
    choixWeb = (r.annonces || [])
      .filter(a => a.image && !SUSPECT.test(a.titre || '') && !vus.has(a.image) && vus.add(a.image))
      .map(a => ({ url: tailleEbay(a.image, 1600), thumbnail: tailleEbay(a.image, 300) }))
      .slice(0, 9);
    document.getElementById('choix').innerHTML = choixWeb.length
      ? '<p class="note">Choisissez une photo :</p><div class="vignettes">' + choixWeb.map((i, n) => `<button data-act="web-choix" data-i="${n}" style="background-image:url('${esc(i.thumbnail)}')"></button>`).join('') + '</div>'
      : '<p class="note">Aucune photo trouvée sur eBay.</p>';
  },
  'web-choix': el => {
    const i = choixWeb[el.dataset.i]; if (!i) return;
    cur.imageWeb = i.url;
    maj({ imageWeb: cur.imageWeb }); document.getElementById('choix').innerHTML = ''; renderPhotos();
    toast('Photo ajoutée');
  },

  'rech-ajout': () => {
    const t = document.getElementById('r-titre').value.trim(); if (!t) return toast('Indiquez un jeu');
    rech.push({ id: uid(), titre: t, max: +document.getElementById('r-max').value || 0 });
    save(); localStorage.removeItem(K.reco); pRecherches();
  },
  'rech-suppr': el => { rech.splice(+el.dataset.i, 1); save(); localStorage.removeItem(K.reco); pRecherches(); },

  'par-save': async () => {
    par.url = document.getElementById('p-url').value.trim(); par.code = document.getElementById('p-code').value.trim();
    save(); localStorage.removeItem(K.reco);
    const box = document.getElementById('test'), txt = document.getElementById('test-txt');
    box.hidden = false; txt.textContent = 'Test en cours…';
    try {
      const r = await relais('test'); par.ebay = !!r.ebay; save();
      const o = v => v ? 'OK' : 'absent';
      txt.textContent = [pts('Relais', 'OK'), pts('SerpApi', o(r.serpapi)), pts('Lens', o(r.lens)), pts('eBay', o(r.ebay)), pts('Photos KV', o(r.kv))].join('\n');
    } catch (e) { txt.textContent = 'Erreur\n' + e.message; }
  },
  export: async () => {
    const photos = {};
    for (const j of col) for (const id of j.photos || []) { const d = await photoGet(id); if (d) photos[id] = d; }
    const blob = new Blob([JSON.stringify({ app: 'pocket-museum', version: VERSION, date: new Date().toISOString(), collection: col, recherches: rech, photos })], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `pocket-museum-${jour()}.json`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    par.sauve = Date.now(); save();
    toast('Sauvegarde téléchargée');
  },
  effacer: async () => {
    if (!confirm('Tout effacer ? Collection, photos et recherchés seront supprimés.')) return;
    if (!confirm('Vraiment ? Cette action est définitive.')) return;
    await idb('readwrite', s => s.clear()); col = []; rech = []; save();
    localStorage.removeItem(K.reco); localStorage.removeItem(K.imgs);
    toast('Tout a été effacé'); go('accueil');
  }
};

/* ---------- Clics ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-go],[data-fiche],[data-act]'); if (!el) return;
  if (el.dataset.go) return el.dataset.go === 'nouveau' ? go('fiche') : go(el.dataset.go);
  if (el.dataset.fiche) return go('fiche', el.dataset.fiche);
  const f = ACTIONS[el.dataset.act];
  if (f) Promise.resolve().then(() => f(el)).catch(err => toast('⚠️ ' + err.message));
});

go('accueil');
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
