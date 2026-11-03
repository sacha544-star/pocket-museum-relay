'use strict';
(function () {
  const VERSION = '1.0.0';
  const K = { col: 'pm_collection', recherches: 'pm_recherches', params: 'pm_params' };
  const DB_NAME = 'pocket-museum';
  const STORE = 'photos';
  const PAGES = [
    ['accueil', 'Accueil', 'home'],
    ['collection', 'Collection', 'game'],
    ['recherches', 'Recherchés', 'heart'],
    ['reglages', 'Réglages', 'sliders']
  ];

  /* ========== Listes ========== */
  const GAMMES = ['Game & Watch Silver', 'Game & Watch Gold', 'Game & Watch Wide Screen', 'Game & Watch Multi Screen', 'Game & Watch New Wide Screen', 'Game & Watch Table Top', 'Game & Watch Panorama', 'Game & Watch Micro Vs.', 'Game & Watch Crystal Screen', 'Game & Watch Super Color', 'LCD', 'LED', 'Mini-arcade', 'Montre-jeu', 'Autre'];
  const FORMATS = ['Simple écran', 'Double écran vertical', 'Double écran horizontal', 'Table Top', 'Panorama', 'Micro Vs.', 'Crystal Screen', 'Autre'];
  const REGIONS = ['Europe', 'France', 'Japon', 'États-Unis', 'Royaume-Uni', 'Allemagne', 'Italie', 'Espagne', 'International', 'Inconnue'];
  const ECRANS = ['LCD', 'LED', 'VFD', 'Mécanique', 'Inconnu'];
  const COULEURS = ['Argent', 'Or', 'Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Orange', 'Rose', 'Violet', 'Gris', 'Transparent', 'Multicolore', 'Autre'];
  const ETATS = ['Neuf', 'Comme neuf', 'Excellent', 'Très bon', 'Bon', 'Correct', 'Usé', 'Pour pièces'];
  const FONCTIONNEMENTS = ['Fonctionne parfaitement', 'Fonctionne avec défauts', 'Ne fonctionne pas', 'Non testé'];
  const COMPLETUDES = ['Jeu seul', 'Jeu + notice', 'Jeu + boîte', 'Complet en boîte', 'Neuf sous blister', 'Autre'];
  const FABRICANTS = ['Nintendo', 'Bandai', 'Casio', 'Epoch', 'Gakken', 'Tomy', 'Tiger Electronics', 'Mattel', 'Coleco', 'Tandy', 'VTech', 'Entex'];

  /* Repères : à vérifier sur la plaque au dos de l'appareil */
  const CATALOGUE = [
    { titre: 'Ball', fabricant: 'Nintendo', gamme: 'Game & Watch Silver', reference: 'AC-01', annee: 1980, format: 'Simple écran' },
    { titre: 'Fire', fabricant: 'Nintendo', gamme: 'Game & Watch Silver', reference: 'RC-04', annee: 1980, format: 'Simple écran' },
    { titre: 'Octopus', fabricant: 'Nintendo', gamme: 'Game & Watch Wide Screen', reference: 'OC-22', annee: 1981, format: 'Simple écran' },
    { titre: 'Popeye', fabricant: 'Nintendo', gamme: 'Game & Watch Wide Screen', reference: 'PP-23', annee: 1981, format: 'Simple écran' },
    { titre: 'Chef', fabricant: 'Nintendo', gamme: 'Game & Watch Wide Screen', reference: 'FP-24', annee: 1981, format: 'Simple écran' },
    { titre: 'Oil Panic', fabricant: 'Nintendo', gamme: 'Game & Watch Multi Screen', reference: 'OP-51', annee: 1982, format: 'Double écran vertical' },
    { titre: 'Donkey Kong', fabricant: 'Nintendo', gamme: 'Game & Watch Multi Screen', reference: 'DK-52', annee: 1982, format: 'Double écran vertical' },
    { titre: 'Donkey Kong II', fabricant: 'Nintendo', gamme: 'Game & Watch Multi Screen', reference: 'JR-55', annee: 1983, format: 'Double écran vertical' },
    { titre: 'Mario Bros.', fabricant: 'Nintendo', gamme: 'Game & Watch Multi Screen', reference: 'MW-56', annee: 1983, format: 'Double écran horizontal' },
    { titre: 'Zelda', fabricant: 'Nintendo', gamme: 'Game & Watch Multi Screen', reference: 'ZL-65', annee: 1989, format: 'Double écran vertical' }
  ];

  const CHAMPS_JEU = [
    { n: 'titre', l: 'Titre *', t: 'text', req: true },
    { n: 'fabricant', l: 'Fabricant', t: 'text', dl: 'dl-fabricants' },
    { n: 'reference', l: 'Référence (sur la plaque)', t: 'text' },
    { n: 'gamme', l: 'Gamme', t: 'select', o: GAMMES },
    { n: 'annee', l: 'Année', t: 'number' },
    { n: 'region', l: 'Région', t: 'select', o: REGIONS },
    { n: 'format', l: 'Format', t: 'select', o: FORMATS },
    { n: 'typeEcran', l: 'Type d’écran', t: 'select', o: ECRANS },
    { n: 'couleur', l: 'Couleur', t: 'select', o: COULEURS },
    { n: 'licence', l: 'Licence / personnage', t: 'text' },
    { n: 'etat', l: 'État', t: 'select', o: ETATS },
    { n: 'fonctionnement', l: 'Fonctionnement', t: 'select', o: FONCTIONNEMENTS },
    { n: 'completude', l: 'Complétude', t: 'select', o: COMPLETUDES },
    { n: 'numeroSerie', l: 'Numéro de série', t: 'text' },
    { n: 'prixAchat', l: 'Prix d’achat (€)', t: 'number' },
    { n: 'dateAchat', l: 'Date d’achat', t: 'date' }
  ];
  const CHAMPS_RECHERCHE = [
    { n: 'titre', l: 'Titre *', t: 'text', req: true },
    { n: 'fabricant', l: 'Fabricant', t: 'text', dl: 'dl-fabricants' },
    { n: 'reference', l: 'Référence', t: 'text' },
    { n: 'gamme', l: 'Gamme', t: 'select', o: GAMMES },
    { n: 'annee', l: 'Année', t: 'number' },
    { n: 'budget', l: 'Budget maxi (€)', t: 'number' }
  ];

  /* ========== Utilitaires ========== */
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const euros = n => (n == null || n === '' || isNaN(n)) ? '—' : Math.round(+n).toLocaleString('fr-FR') + ' €';
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const dateFr = ts => ts ? new Date(ts).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
  const lire = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const ecrire = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { toast('Stockage plein : supprime des éléments.'); } };
  const mediane = list => { if (!list.length) return null; const s = [...list].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

  const ICONES = {
    home: '<path d="M3 11l9-8 9 8v9h-6v-6H9v6H3z"/>',
    game: '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M8 12h4M10 10v4"/><circle cx="16" cy="11" r=".8"/><circle cx="18" cy="13.5" r=".8"/>',
    heart: '<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12 5 5L20 7"/>',
    ext: '<path d="M14 4h6v6M20 4l-10 10M19 14v6H4V5h6"/>',
    scan: '<path d="M4 8V5h3M16 5h3v3M20 16v3h-3M8 19H5v-3"/><path d="M7 12h10"/>',
    down: '<path d="M12 3v12M6 11l6 6 6-6M4 21h16"/>',
    up: '<path d="M12 21V9M6 13l6-6 6 6M4 3h16"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
    gauche: '<path d="m15 6-6 6 6 6"/>',
    droite: '<path d="m9 6 6 6-6 6"/>'
  };
  const I = n => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[n] || ''}</svg>`;

  const PALETTE = ['#8d2929', '#3d4a36', '#2f4a6b', '#6b4a2f', '#5a2d6e', '#8a6a1e'];
  function couleurDe(j) {
    let h = 0;
    for (const c of norm(j.gamme || j.fabricant || j.titre)) h = (h * 31 + c.charCodeAt(0)) | 0;
    return PALETTE[Math.abs(h) % PALETTE.length];
  }

  /* Illustration de secours : un appareil LCD dessiné */
  function consoleSvg(titre, ref, couleur) {
    return `<svg viewBox="0 0 120 100" aria-hidden="true">
      <rect x="8" y="14" width="104" height="72" rx="12" fill="${couleur}" stroke="rgba(0,0,0,.3)" stroke-width="2"/>
      <rect x="29" y="27" width="62" height="35" rx="4" fill="#dce2b8" stroke="#44493c" stroke-width="2"/>
      <circle cx="27" cy="72" r="6" fill="#252622"/>
      <circle cx="93" cy="72" r="6" fill="#252622"/>
      <circle cx="42" cy="72" r="3" fill="#c1343c"/>
      <circle cx="78" cy="72" r="3" fill="#c1343c"/>
      <text x="60" y="23" text-anchor="middle" font-family="Arial" font-size="7" font-weight="700" fill="#fff">${esc(String(titre || '').slice(0, 16))}</text>
      <text x="60" y="58" text-anchor="middle" font-family="monospace" font-size="6" fill="#252622">${esc(String(ref || '').slice(0, 12))}</text>
    </svg>`;
  }

  function visuel(j) {
    const svg = consoleSvg(j.titre, j.reference, couleurDe(j));
    if (j.photos && j.photos.length) return `<div class="visu" data-photo="${esc(j.photos[0])}">${svg}</div>`;
    if (j.imageWeb) return `<div class="visu" data-web="${esc(j.imageWeb)}">${svg}</div>`;
    return `<div class="visu">${svg}</div>`;
  }

  /* ========== État ========== */
  let collection = lire(K.col, []);
  let recherches = lire(K.recherches, []);
  let params = Object.assign({ relais: '', code: '', prenom: '' }, lire(K.params, {}));
  const etat = { page: 'accueil', recherche: '', filtre: { gamme: '', etat: '' }, modal: null, form: null, ficheId: null, index: 0, lens: null, annoncesOuvertes: '' };

  function sauver() {
    ecrire(K.col, collection);
    ecrire(K.recherches, recherches);
    ecrire(K.params, params);
  }

  /* ========== Photos (IndexedDB) ========== */
  let dbPromise = null;
  function db() {
    if (!dbPromise) {
      dbPromise = new Promise((res, rej) => {
        const r = indexedDB.open(DB_NAME, 1);
        r.onupgradeneeded = () => r.result.createObjectStore(STORE);
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
    }
    return dbPromise;
  }
  async function photoOp(mode, fn) {
    const d = await db();
    return new Promise((res, rej) => {
      const req = fn(d.transaction(STORE, mode).objectStore(STORE));
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
  }
  const photoSauver = (id, data) => photoOp('readwrite', s => s.put(data, id));
  const photoLire = id => photoOp('readonly', s => s.get(id));
  const photoSupprimer = id => photoOp('readwrite', s => s.delete(id)).catch(() => {});

  async function photosToutes() {
    const d = await db();
    return new Promise((res, rej) => {
      const out = {};
      const c = d.transaction(STORE, 'readonly').objectStore(STORE).openCursor();
      c.onsuccess = () => {
        const cur = c.result;
        if (cur) { out[cur.key] = cur.value; cur.continue(); } else res(out);
      };
      c.onerror = () => rej(c.error);
    });
  }

  function lireFichier(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = () => rej(r.error);
      r.readAsDataURL(file);
    });
  }

  function compresser(src, max = 1000, qualite = 0.82) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => {
        const r = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.naturalWidth * r));
        c.height = Math.max(1, Math.round(img.naturalHeight * r));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', qualite));
      };
      img.onerror = () => rej(new Error('Image illisible'));
      img.src = src;
    });
  }

  function chargerPhotos() {
    $$('[data-photo]').forEach(async el => {
      const id = el.dataset.photo;
      el.removeAttribute('data-photo');
      const src = await photoLire(id).catch(() => null);
      if (src && el.isConnected) {
        el.innerHTML = '';
        el.appendChild(imgPhoto(src));
      }
    });
    $$('[data-web]').forEach(el => {
      const url = el.dataset.web;
      el.removeAttribute('data-web');
      const img = new Image();
      img.alt = '';
      img.className = 'photo';
      img.onload = () => { if (el.isConnected) el.appendChild(img); };
      img.src = url;
    });
  }
  function imgPhoto(src) {
    const i = new Image();
    i.alt = '';
    i.className = 'photo';
    i.src = src;
    return i;
  }

  /* ========== Relais (Cloudflare Worker) ========== */
  async function relais(action, donnees = {}) {
    if (!params.relais) throw new Error('Relais non configuré dans Réglages.');
    const r = await fetch(params.relais, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: params.code, action, ...donnees })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.ok === false) throw new Error(j.erreur || 'Erreur relais ' + r.status);
    return j;
  }

  /* ========== Estimation ========== */
  const MOTS_SUSPECTS = /\b(reproduction|replica|repro|custom|fan made|sticker|autocollant|poster|affiche|notice seule|boite seule|box only|manual only|cache piles seul|coque seule|shell only|ecran seul|piece detachee|spare part|porte cle|keychain|figurine|miniature|etui|lot de|pour pieces|for parts)\b/;
  const suspect = a => MOTS_SUSPECTS.test(norm(a.titre));

  function requeteRecherche(x) {
    const marque = norm(x.fabricant) === 'nintendo' ? 'Game & Watch' : (x.fabricant || 'jeu électronique');
    return [x.titre, x.reference, marque].filter(Boolean).join(' ');
  }

  function cibleDe(c) {
    if (c === 'form') { lireFormulaire(); return etat.form; }
    const [type, id] = String(c).split(':');
    const liste = type === 'r' ? recherches : collection;
    return liste.find(x => x.id === id) || null;
  }

  async function estimer(cible) {
    const x = cibleDe(cible);
    if (!x) return;
    if (!params.relais) return toast('Configure le relais dans Réglages.');
    if (!x.titre) return toast('Indique d’abord le titre.');

    toast('Recherche des annonces…', true);
    const q = requeteRecherche(x);
    const releve = { date: Date.now(), q, annonces: [], erreurs: [], nb: 0 };

    try {
      const j = await relais('ebay', { q });
      releve.annonces.push(...(j.annonces || []));
    } catch (e) { releve.erreurs.push('eBay : ' + e.message); }

    try {
      const j = await relais('annonces', { q });
      releve.annonces.push(...(j.annonces || []));
    } catch (e) { releve.erreurs.push('Vinted/Leboncoin : ' + e.message); }

    const vus = new Set();
    releve.annonces = releve.annonces
      .filter(a => { const k = a.lien || a.titre; if (vus.has(k)) return false; vus.add(k); return true; })
      .map(a => ({ ...a, sus: suspect(a) }));

    const prix = releve.annonces.filter(a => !a.sus).map(a => a.prix);
    releve.nb = prix.length;
    const med = mediane(prix);

    x.releve = releve;
    x.valeur = med;
    x.dateEstimation = Date.now();
    if (cible !== 'form') sauver();
    rendre();
    toast(med ? `Valeur estimée : ${euros(med)} (${prix.length} annonces)` : 'Aucune annonce exploitable.');
  }

  async function photoWeb(cible) {
    const x = cibleDe(cible);
    if (!x) return;
    if (!params.relais) return toast('Configure le relais dans Réglages.');
    toast('Recherche d’une photo…', true);
    try {
      const j = await relais('images', { q: requeteRecherche(x) });
      const img = (j.images || [])[0];
      const src = img ? (img.original || img.miniature) : '';
      if (!src) return toast('Aucune photo trouvée.');
      x.imageWeb = src;
      sauver();
      rendre();
      toast('Photo web ajoutée. Tes propres photos la remplaceront.');
    } catch (e) { toast('Photo web : ' + e.message); }
  }

  /* ========== Google Lens ========== */
  function analyserLens(matches, indice) {
    const ind = ' ' + norm(indice || '') + ' ';
    const scores = new Map();
    const titres = [];
    matches.forEach((m, idx) => {
      const poids = idx < 5 ? 3 : idx < 15 ? 2 : 1;
      const texte = ' ' + norm(`${m.title || ''} ${m.source || ''}`) + ' ';
      if (m.title && titres.length < 6) titres.push(String(m.title).slice(0, 90));
      CATALOGUE.forEach(j => {
        let s = 0;
        if (texte.includes(' ' + norm(j.reference) + ' ')) s += 8;
        if (texte.includes(' ' + norm(j.titre) + ' ')) s += 3;
        if (ind.trim() && (' ' + norm(j.titre) + ' ' + norm(j.reference) + ' ').includes(ind)) s += 20;
        if (s) scores.set(j, (scores.get(j) || 0) + s * poids);
      });
    });
    const propositions = [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([jeu]) => ({ jeu }));
    return { nb: matches.length, propositions, titres };
  }

  async function lens() {
    lireFormulaire();
    const f = etat.form;
    const src = f.photos[0] ? await photoLire(f.photos[0]) : null;
    if (!src) return toast('Ajoute d’abord une photo du jeu.');
    toast('Google Lens en cours…', true);
    try {
      const image = await compresser(src, 800, 0.8);
      const j = await relais('lens', { image });
      etat.lens = analyserLens(j.matches || [], f.indice);
      toast(etat.lens.propositions.length ? 'Propositions prêtes : clique sur « Appliquer ».' : 'Lens n’a pas reconnu de jeu du catalogue.');
    } catch (e) { toast('Lens : ' + e.message); }
    rendre();
  }

  function appliquerLens(i) {
    const p = etat.lens && etat.lens.propositions[i];
    if (!p) return;
    lireFormulaire();
    const f = etat.form;
    const j = p.jeu;
    Object.assign(f, {
      titre: j.titre,
      fabricant: j.fabricant,
      gamme: j.gamme,
      reference: j.reference,
      annee: j.annee,
      format: j.format,
      typeEcran: f.typeEcran || 'LCD'
    });
    rendre();
    toast('Proposition appliquée : vérifie avant d’enregistrer.');
  }

  /* ========== Filtres et listes ========== */
  function filtrer() {
    const q = norm(etat.recherche);
    const f = etat.filtre;
    return collection
      .filter(j =>
        (!f.gamme || j.gamme === f.gamme) &&
        (!f.etat || j.etat === f.etat) &&
        (!q || norm([j.titre, j.reference, j.fabricant, j.gamme, j.licence, j.notes].join(' ')).includes(q)))
      .sort((a, b) => (b.favori ? 1 : 0) - (a.favori ? 1 : 0) || (b.date || 0) - (a.date || 0));
  }

  function listeCollection() {
    if (!collection.length) {
      return `<div class="vide">${I('game')}<p>Ta collection est vide.</p><button class="btn btn-rouge" data-a="ajouter">${I('plus')} Ajouter un jeu</button></div>`;
    }
    const l = filtrer();
    if (!l.length) return '<div class="vide"><p>Aucun jeu ne correspond à la recherche.</p></div>';
    return `<div class="grille">${l.map(carteJeu).join('')}</div>`;
  }

  function optionsListe(liste, valeur) {
    const l = valeur && !liste.includes(valeur) ? [valeur, ...liste] : liste;
    return l.map(x => `<option value="${esc(x)}"${x === valeur ? ' selected' : ''}>${esc(x)}</option>`).join('');
  }

  /* ========== Cartes ========== */
  function carteJeu(j) {
    const diff = j.valeur > 0 && j.prixAchat > 0 ? j.valeur - j.prixAchat : null;
    return `<article class="carte" data-a="fiche" data-id="${esc(j.id)}">
      <div class="vignette">
        ${visuel(j)}
        <span class="ref">${esc(j.reference || 'SANS RÉF')}</span>
        <button type="button" class="coeur ${j.favori ? 'on' : ''}" data-a="favori" data-id="${esc(j.id)}" title="Favori">${I('heart')}</button>
      </div>
      <div class="corps">
        <div class="fab">${esc(j.fabricant || 'Fabricant inconnu')}</div>
        <b>${esc(j.titre)}</b>
        <div class="tech">${esc([j.annee, j.gamme].filter(Boolean).join(' · '))}</div>
        <div class="chips">
          ${j.etat ? `<span class="chip">${esc(j.etat)}</span>` : ''}
          ${j.fonctionnement ? `<span class="chip vert">${esc(j.fonctionnement)}</span>` : ''}
        </div>
        <div class="bas">
          <span>${j.prixAchat > 0 ? 'Acheté ' + euros(j.prixAchat) : 'Prix non renseigné'}</span>
          <b>${j.valeur > 0 ? '≈ ' + euros(j.valeur) : ''}</b>
          ${diff !== null ? `<span class="${diff >= 0 ? 'plus' : 'moins'}">${diff >= 0 ? '+' : ''}${euros(diff)}</span>` : ''}
        </div>
      </div>
    </article>`;
  }

  function carteRecherche(r) {
    const dansBudget = r.budget > 0 && r.valeur > 0 && r.valeur <= r.budget;
    return `<article class="carte-recherche" data-a="voir-recherche" data-id="${esc(r.id)}">
      <div class="tete">
        <div class="vignette petite">${visuel(r)}</div>
        <div>
          <div class="fab">${esc(r.fabricant || 'Fabricant inconnu')}</div>
          <b>${esc(r.titre)}</b>
          <div class="tech">${esc([r.reference, r.gamme].filter(Boolean).join(' · '))}</div>
          <div class="chips">
            ${r.budget > 0 ? `<span class="chip">Budget ${euros(r.budget)}</span>` : ''}
            ${r.statut === 'trouve' ? '<span class="chip vert">Trouvé</span>' : ''}
          </div>
        </div>
      </div>
      <div class="bas">
        <span>${r.valeur > 0 ? 'Estimation <b>' + euros(r.valeur) + '</b>' : 'Pas encore estimé'}</span>
        ${dansBudget ? '<span class="plus">Dans le budget</span>' : ''}
      </div>
      <div class="wactions">
        <button type="button" class="btn" data-a="verifier-recherche" data-id="${esc(r.id)}">${I('refresh')} Vérifier</button>
      </div>
    </article>`;
  }

  /* ========== Pages ========== */
  function entete() {
    return `<header class="entete">
      <button type="button" class="marque" data-a="page" data-p="accueil">
        <span class="logo">${I('game')}</span>
        <span>
          <b>Pocket Museum</b>
          <small>${esc(params.prenom ? 'Collection de ' + params.prenom : 'Jeux portables rétro')}</small>
        </span>
      </button>
      <nav class="nav">
        ${PAGES.map(([p, l, ic]) => `<button type="button" class="${etat.page === p ? 'on' : ''}" data-a="page" data-p="${p}">${I(ic)}<span>${l}</span></button>`).join('')}
      </nav>
    </header>`;
  }

  function barre() {
    return `<nav class="barre">${PAGES.map(([p, l, ic]) => `<button type="button" class="${etat.page === p ? 'on' : ''}" data-a="page" data-p="${p}">${I(ic)}<span>${l}</span></button>`).join('')}</nav>`;
  }

  function pageAccueil() {
    const recents = [...collection].sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 4);
    const valeur = collection.reduce((s, j) => s + (Number(j.valeur) || Number(j.prixAchat) || 0), 0);
    const fabricants = new Set(collection.map(j => j.fabricant).filter(Boolean)).size;
    const suivis = recherches.filter(r => r.statut !== 'trouve').length;
    const salut = new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir';

    return `<section class="hero">
      <div class="hero-img"><img src="./photos/hero-gamewatch.jpg" alt="" onerror="this.parentElement.classList.add('sans-photo');this.remove()"></div>
      <div class="hero-voile"></div>
      <div class="hero-txt">
        <div class="eyebrow">${salut}${params.prenom ? ' ' + esc(params.prenom) : ''}</div>
        <h1>Ton musée de jeux <em>tient dans la poche.</em></h1>
        <p>Catalogue tes Game & Watch et jeux LCD : photos, référence, état et valeur estimée.</p>
        <div class="stats">
          <div><b>${collection.length}</b><small>appareils</small></div>
          <div><b>${fabricants}</b><small>fabricants</small></div>
          <div><b>${euros(valeur)}</b><small>valeur estimée</small></div>
          <div><b>${suivis}</b><small>recherchés</small></div>
        </div>
        <div class="wactions">
          <button type="button" class="btn btn-rouge" data-a="ajouter">${I('plus')} Ajouter un jeu</button>
          <button type="button" class="btn btn-ecran" data-a="page" data-p="recherches">${I('heart')} Jeux recherchés</button>
        </div>
      </div>
    </section>
    ${recents.length ? `
      <section class="section">
        <div class="titre-page">
          <div><div class="eyebrow">Collection</div><h2>Dernières acquisitions</h2></div>
          <button type="button" class="btn" data-a="page" data-p="collection">Tout voir ${I('droite')}</button>
        </div>
        <div class="grille">${recents.map(carteJeu).join('')}</div>
      </section>` : `
      <section class="bienvenue">
        <div class="visu">${consoleSvg('POCKET', 'START', '#9b2f2f')}</div>
        <div>
          <div class="eyebrow">Commencer la collection</div>
          <h2>Ajoute ton premier jeu portable</h2>
          <p class="aide">Ajoute une photo, lance Google Lens et estime la valeur grâce aux annonces.</p>
          <button type="button" class="btn btn-rouge" data-a="ajouter">${I('plus')} Ajouter mon premier jeu</button>
        </div>
      </section>`}`;
  }

  function pageCollection() {
    const nb = collection.length;
    const investi = collection.reduce((s, j) => s + (Number(j.prixAchat) || 0), 0);
    const valeur = collection.reduce((s, j) => s + (Number(j.valeur) || Number(j.prixAchat) || 0), 0);
    const pv = valeur - investi;
    const gammes = [...new Set(collection.map(j => j.gamme).filter(Boolean))].sort();
    const etats = [...new Set(collection.map(j => j.etat).filter(Boolean))].sort();

    return `<div class="titre-page">
        <div><div class="eyebrow">Collection</div><h1>${nb} jeu${nb > 1 ? 'x' : ''}</h1></div>
        <button type="button" class="btn btn-rouge" data-a="ajouter">${I('plus')} Ajouter</button>
      </div>
      <div class="kpis">
        <div class="kpi"><small>Appareils</small><b>${nb}</b></div>
        <div class="kpi"><small>Investi</small><b>${euros(investi)}</b></div>
        <div class="kpi"><small>Valeur estimée</small><b>${euros(valeur)}</b></div>
        <div class="kpi"><small>Plus-value</small><b class="${pv >= 0 ? 'plus' : 'moins'}">${pv >= 0 ? '+' : ''}${euros(pv)}</b></div>
      </div>
      <div class="recherche">${I('search')}<input id="recherche" type="search" placeholder="Titre, référence, fabricant…" value="${esc(etat.recherche)}"></div>
      <div class="filtres">
        <select class="pilule" data-filtre="gamme">
          <option value="">Toutes les gammes</option>${gammes.map(g => `<option value="${esc(g)}"${g === etat.filtre.gamme ? ' selected' : ''}>${esc(g)}</option>`).join('')}
        </select>
        <select class="pilule" data-filtre="etat">
          <option value="">Tous les états</option>${etats.map(e => `<option value="${esc(e)}"${e === etat.filtre.etat ? ' selected' : ''}>${esc(e)}</option>`).join('')}
        </select>
      </div>
      <div id="zone-liste">${listeCollection()}</div>`;
  }

  function pageRecherches() {
    const suivis = recherches.filter(r => r.statut !== 'trouve').length;
    return `<div class="titre-page">
        <div><div class="eyebrow">Jeux recherchés</div><h1>${suivis} en suivi</h1></div>
        <div class="wactions">
          ${recherches.length ? `<button type="button" class="btn" data-a="verifier-tout">${I('refresh')} Vérifier les prix</button>` : ''}
          <button type="button" class="btn btn-rouge" data-a="ajouter-recherche">${I('plus')} Ajouter</button>
        </div>
      </div>
      <p class="aide">Chaque vérification interroge eBay et Vinted/Leboncoin, ce qui consomme une recherche SerpApi.</p>
      ${recherches.length
        ? `<div class="wgrille">${recherches.map(carteRecherche).join('')}</div>`
        : `<div class="vide">${I('heart')}<p>Aucun jeu recherché pour le moment.</p></div>`}`;
  }

  function pageReglages() {
    return `<div class="titre-page"><div><div class="eyebrow">Réglages</div><h1>Réglages</h1></div></div>
      <section class="carte-reglage">
        <h3>Toi</h3>
        <label>Prénom<input id="prenom" value="${esc(params.prenom)}" placeholder="Pour le message d’accueil"></label>
      </section>
      <section class="carte-reglage">
        <h3>Relais Cloudflare</h3>
        <p class="aide">Le Worker garde tes clés SerpApi et eBay côté serveur. Elles ne sont jamais dans l’application.</p>
        <label>Adresse du Worker<input id="relais" value="${esc(params.relais)}" placeholder="https://pocket-museum-relay.xxx.workers.dev" inputmode="url"></label>
        <label>Code secret<input id="code" type="password" value="${esc(params.code)}" placeholder="Valeur de CODE_SECRET"></label>
        <div class="wactions">
          <button type="button" class="btn btn-rouge" data-a="sauver-reglages">${I('check')} Enregistrer</button>
          <button type="button" class="btn" data-a="tester">${I('refresh')} Tester la connexion</button>
        </div>
        <div id="res-test" class="aide"></div>
      </section>
      <section class="carte-reglage">
        <h3>Sauvegarde</h3>
        <p class="aide">Les données restent dans ce navigateur. Exporte-les pour les transférer vers un autre appareil.</p>
        <div class="wactions">
          <button type="button" class="btn" data-a="exporter">${I('down')} Exporter</button>
          <label class="btn">${I('up')} Importer<input id="fichier-import" type="file" accept="application/json,.json" hidden></label>
        </div>
      </section>
      <section class="carte-reglage">
        <h3>Zone sensible</h3>
        <button type="button" class="btn" data-a="tout-effacer">Tout effacer dans ce navigateur</button>
        <p class="aide">Pocket Museum v${VERSION}. Application personnelle, non affiliée à Nintendo ni aux autres fabricants.</p>
      </section>`;
  }

  function pageCourante() {
    if (etat.page === 'collection') return pageCollection();
    if (etat.page === 'recherches') return pageRecherches();
    if (etat.page === 'reglages') return pageReglages();
    return pageAccueil();
  }

  /* ========== Fiches et formulaires ========== */
  function estimBloc(x, cible) {
    const r = x.releve;
    const ouvert = etat.annoncesOuvertes === cible;
    return `<div class="estim">
      <div class="estim-tete">
        <div>
          <div class="eyebrow">Estimation d’occasion</div>
          ${x.valeur > 0 ? `<div class="grosse">${euros(x.valeur)}</div>` : '<div class="aide">Pas encore estimé</div>'}
        </div>
        <button type="button" class="btn btn-rouge" data-a="estimer" data-c="${cible}">${I('search')} ${r ? 'Actualiser' : 'Estimer'}</button>
      </div>
      ${r ? `
        <div class="aide">${r.nb} annonce(s) retenue(s) sur ${r.annonces.length} · ${dateFr(r.date)}</div>
        ${r.erreurs.length ? `<div class="aide rouge">${r.erreurs.map(esc).join('<br>')}</div>` : ''}
        <button type="button" class="btn" data-a="toggle-annonces" data-c="${cible}">${ouvert ? 'Masquer' : 'Voir'} les annonces</button>
        ${ouvert ? listeAnnonces(r) : ''}` : ''}
      <p class="aide">Estimation indicative à partir d’annonces de revente entre particuliers. Ce n’est pas une cote officielle.</p>
    </div>`;
  }

  function listeAnnonces(r) {
    if (!r.annonces.length) return '<p class="aide">Aucune annonce trouvée.</p>';
    const liste = [...r.annonces].sort((a, b) => a.prix - b.prix);
    return `<div class="annonces">
        ${liste.map(a => `<a class="ann${a.sus ? ' sus' : ''}" href="${esc(a.lien || '#')}" target="_blank" rel="noopener">
          <span class="t"><b>${esc(a.source)}</b> · ${esc(a.titre)}</span>
          <span class="e">${esc(a.etat || '')}</span>
          <b>${euros(a.prix)}</b>
        </a>`).join('')}
      </div>
      <p class="aide">Barrées : annonces écartées du calcul (reproductions, accessoires seuls…).</p>`;
  }

  function ficheJeu(j) {
    const ph = j.photos || [];
    const n = ph.length;
    const i = n ? ((etat.index % n) + n) % n : 0;
    const visu = n
      ? `<div class="carrousel">
          <div class="visu" data-photo="${esc(ph[i])}"></div>
          ${n > 1 ? `<button type="button" class="fl g" data-a="carrousel" data-d="-1">${I('gauche')}</button>
                     <button type="button" class="fl d" data-a="carrousel" data-d="1">${I('droite')}</button>` : ''}
        </div>`
      : `<div class="carrousel">${visuel(j)}</div>`;
    const det = [
      ['Référence', j.reference], ['Gamme', j.gamme], ['Année', j.annee], ['Région', j.region],
      ['Format', j.format], ['Écran', j.typeEcran], ['Couleur', j.couleur], ['Licence', j.licence],
      ['État', j.etat], ['Fonctionnement', j.fonctionnement], ['Complétude', j.completude],
      ['N° de série', j.numeroSerie],
      ['Acheté le', j.dateAchat ? new Date(j.dateAchat).toLocaleDateString('fr-FR') : ''],
      ['Prix d’achat', j.prixAchat > 0 ? euros(j.prixAchat) : '']
    ].filter(x => x[1]);

    return `<div class="fiche-tete">
        <div class="eyebrow">${esc(j.fabricant || 'Fabricant inconnu')}</div>
        <h2>${esc(j.titre)}</h2>
      </div>
      ${visu}
      <div class="det">${det.map(([k, v]) => `<div><small>${k}</small><b>${esc(v)}</b></div>`).join('')}</div>
      ${j.notes ? `<p class="notes">${esc(j.notes)}</p>` : ''}
      ${estimBloc(j, 'j:' + j.id)}
      <div class="wactions">
        <button type="button" class="btn" data-a="modifier" data-id="${esc(j.id)}">${I('edit')} Modifier</button>
        <button type="button" class="btn" data-a="photo-web" data-c="j:${esc(j.id)}">${I('camera')} Photo web</button>
        <button type="button" class="btn btn-ic" data-a="supprimer" data-id="${esc(j.id)}" title="Supprimer">${I('trash')}</button>
      </div>`;
  }

  function ficheRecherche(r) {
    const infos = [['Fabricant', r.fabricant], ['Référence', r.reference], ['Gamme', r.gamme], ['Année', r.annee], ['Budget', r.budget > 0 ? euros(r.budget) : '']]
      .filter(x => x[1]);
    return `<div class="fiche-tete">
        <div class="eyebrow">Jeu recherché</div>
        <h2>${esc(r.titre)}</h2>
      </div>
      <div class="carrousel">${visuel(r)}</div>
      <div class="det">${infos.map(([k, v]) => `<div><small>${k}</small><b>${esc(v)}</b></div>`).join('')}</div>
      ${r.notes ? `<p class="notes">${esc(r.notes)}</p>` : ''}
      ${estimBloc(r, 'r:' + r.id)}
      <div class="wactions">
        <button type="button" class="btn" data-a="modifier-recherche" data-id="${esc(r.id)}">${I('edit')} Modifier</button>
        ${r.statut !== 'trouve' ? `<button type="button" class="btn" data-a="recherche-trouvee" data-id="${esc(r.id)}">${I('check')} Trouvé</button>` : ''}
        <button type="button" class="btn btn-rouge" data-a="recherche-vers-collection" data-id="${esc(r.id)}">${I('plus')} Ajouter à la collection</button>
        <button type="button" class="btn btn-ic" data-a="supprimer-recherche" data-id="${esc(r.id)}" title="Supprimer">${I('trash')}</button>
      </div>`;
  }

  function lensHtml() {
    const a = etat.lens;
    if (!a) return '';
    return `<div class="lens-res">
      <div class="eyebrow">Google Lens · ${a.nb} résultat(s)</div>
      ${a.propositions.length
        ? a.propositions.map((p, i) => `<div class="prop">
            <div><b>${esc(p.jeu.titre)}</b><div class="aide">${esc(p.jeu.fabricant)} · ${esc(p.jeu.reference)} · ${p.jeu.annee}</div></div>
            <button type="button" class="btn btn-rouge" data-a="lens-appliquer" data-i="${i}">${I('check')} Appliquer</button>
          </div>`).join('')
        : '<p class="aide">Aucun jeu du catalogue reconnu. Ajoute un indice ou vérifie la référence sur la plaque.</p>'}
      ${a.titres.length ? `<p class="aide">Titres trouvés : ${a.titres.map(esc).join(' · ')}</p>` : ''}
    </div>`;
  }

  function champ(c, f) {
    const v = f[c.n] ?? '';
    const ctrl = c.t === 'select'
      ? `<select name="${c.n}"><option value="">—</option>${optionsListe(c.o, v)}</select>`
      : `<input name="${c.n}" type="${c.t}" value="${esc(v)}"${c.req ? ' required' : ''}${c.dl ? ` list="${c.dl}"` : ''}${c.t === 'number' ? ' min="0" step="any"' : ''}>`;
    return `<label>${c.l}${ctrl}</label>`;
  }

  function formJeu() {
    const f = etat.form;
    const ph = f.photos || [];
    return `<h2>${f.id ? 'Modifier le jeu' : 'Nouveau jeu'}</h2>
      <div class="photos-edit">
        ${ph.map((p, i) => `<div class="ph">
            <div class="visu" data-photo="${esc(p)}"></div>
            <button type="button" class="ph-x" data-a="photo-retirer" data-i="${i}" title="Retirer">${I('x')}</button>
          </div>`).join('')}
        ${ph.length < 4 ? `<label class="ph ajout">${I('camera')}<span>Photo</span><input id="fichier-photo" type="file" accept="image/*" multiple hidden></label>` : ''}
      </div>
      <div class="lens-bloc">
        <div class="eyebrow">Identifier avec Google Lens</div>
        <div class="ligne-lens">
          <input name="indice" value="${esc(f.indice || '')}" placeholder="Indice facultatif : Donkey Kong, DK-52…">
          <button type="button" class="btn" data-a="lens" ${ph.length ? '' : 'disabled'}>${I('scan')} Lens</button>
        </div>
        ${ph.length ? '' : '<p class="aide">Ajoute d’abord une photo pour utiliser Lens.</p>'}
        <div id="lens-res">${lensHtml()}</div>
      </div>
      <form id="f-jeu" class="form" onsubmit="return false">
        ${CHAMPS_JEU.map(c => champ(c, f)).join('')}
        <label class="case"><input type="checkbox" name="favori" ${f.favori ? 'checked' : ''}><span>Favori</span></label>
        <label class="plein">Notes<textarea name="notes" placeholder="Écran, son, piles, boîte, provenance…">${esc(f.notes || '')}</textarea></label>
      </form>
      ${estimBloc(f, 'form')}
      <div class="wactions">
        <button type="button" class="btn btn-rouge" data-a="enregistrer">${I('check')} Enregistrer</button>
        <button type="button" class="btn" data-a="fermer">Annuler</button>
      </div>`;
  }

  function formRecherche() {
    const f = etat.form;
    return `<h2>${f.id ? 'Modifier la recherche' : 'Nouveau jeu recherché'}</h2>
      <form id="f-jeu" class="form" onsubmit="return false">
        ${CHAMPS_RECHERCHE.map(c => champ(c, f)).join('')}
        <label class="plein">Notes<textarea name="notes">${esc(f.notes || '')}</textarea></label>
      </form>
      <div class="wactions">
        <button type="button" class="btn btn-rouge" data-a="enregistrer-recherche">${I('check')} Enregistrer</button>
        <button type="button" class="btn" data-a="fermer">Annuler</button>
      </div>`;
  }

  function modal() {
    if (!etat.modal) return '';
    let html = '';
    if (etat.modal === 'fiche') {
      const j = collection.find(x => x.id === etat.ficheId);
      html = j ? ficheJeu(j) : '';
    } else if (etat.modal === 'fiche-recherche') {
      const r = recherches.find(x => x.id === etat.ficheId);
      html = r ? ficheRecherche(r) : '';
    } else if (etat.modal === 'form') {
      html = formJeu();
    } else if (etat.modal === 'recherche') {
      html = formRecherche();
    }
    if (!html) { etat.modal = null; return ''; }
    return `<div class="voile" data-a="fermer-voile">
      <div class="modal" role="dialog">
        <button type="button" class="fermer" data-a="fermer" title="Fermer">${I('x')}</button>
        ${html}
      </div>
    </div>`;
  }

  function datalists() {
    return `<datalist id="dl-fabricants">${FABRICANTS.map(x => `<option value="${esc(x)}">`).join('')}</datalist>`;
  }

  /* ========== Rendu ========== */
  function rendre() {
    lireFormulaire();
    const root = $('#app');
    const md = $('.modal');
    const sc = md ? md.scrollTop : 0;
    root.innerHTML = `${entete()}<main>${pageCourante()}</main>${barre()}${modal()}${datalists()}`;
    const m2 = $('.modal');
    if (m2) m2.scrollTop = sc;
    document.body.classList.toggle('bloque', !!etat.modal);
    chargerPhotos();
  }

  let toastTimer = 0;
  function toast(msg, fixe) {
    let t = $('#toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    if (!fixe) toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
  }

  /* Lit le formulaire ouvert pour ne pas perdre la saisie lors d'un nouveau rendu */
  function lireFormulaire() {
    if (!etat.form || !(etat.modal === 'form' || etat.modal === 'recherche')) return;
    const form = $('#f-jeu');
    if (!form) return;
    form.querySelectorAll('[name]').forEach(el => {
      etat.form[el.name] = el.type === 'checkbox' ? el.checked : el.value.trim();
    });
    const ind = $('[name="indice"]');
    if (ind) etat.form.indice = ind.value.trim();
  }

  /* ========== Ouverture et fermeture des modales ========== */
  function ouvrirForm(j) {
    const base = {
      titre: '', fabricant: '', reference: '', gamme: '', annee: '', region: '', format: '',
      typeEcran: 'LCD', couleur: '', licence: '', etat: '', fonctionnement: '', completude: '',
      numeroSerie: '', prixAchat: '', dateAchat: '', notes: '', favori: false,
      photos: [], nouvellesPhotos: [], supprimees: [], indice: ''
    };
    etat.form = Object.assign(base, j ? JSON.parse(JSON.stringify(j)) : {});
    etat.form.photos = [...(etat.form.photos || [])];
    etat.form.nouvellesPhotos = [];
    etat.form.supprimees = [];
    etat.lens = null;
    etat.annoncesOuvertes = '';
    etat.modal = 'form';
    rendre();
  }

  function ouvrirFormRecherche(r) {
    etat.form = Object.assign({ titre: '', fabricant: '', reference: '', gamme: '', annee: '', budget: '', notes: '' }, r ? JSON.parse(JSON.stringify(r)) : {});
    etat.modal = 'recherche';
    rendre();
  }

  async function fermerModal() {
    const f = etat.form;
    etat.form = null;
    etat.modal = null;
    etat.lens = null;
    etat.annoncesOuvertes = '';
    if (f && f.nouvellesPhotos) {
      for (const id of f.nouvellesPhotos) await photoSupprimer(id);
    }
    rendre();
  }

  /* ========== Photos du formulaire ========== */
  async function ajouterPhotos(files) {
    lireFormulaire();
    const f = etat.form;
    if (!f) return;
    const libres = 4 - f.photos.length;
    const liste = [...files].slice(0, Math.max(0, libres));
    if (!liste.length) return toast('4 photos maximum.');
    toast('Ajout des photos…', true);
    for (const file of liste) {
      try {
        const petit = await compresser(await lireFichier(file), 1000, 0.82);
        const id = 'ph_' + uid();
        await photoSauver(id, petit);
        f.photos.push(id);
        f.nouvellesPhotos.push(id);
      } catch (e) { toast('Photo illisible : ' + file.name); }
    }
    rendre();
    toast('Photos ajoutées.');
  }

  async function retirerPhoto(i) {
    lireFormulaire();
    const f = etat.form;
    const id = f.photos[i];
    if (!id) return;
    f.photos.splice(i, 1);
    if (f.nouvellesPhotos.includes(id)) {
      f.nouvellesPhotos = f.nouvellesPhotos.filter(x => x !== id);
      await photoSupprimer(id);
    } else {
      f.supprimees.push(id);
    }
    rendre();
  }

  /* ========== Enregistrement ========== */
  function enregistrerJeu() {
    lireFormulaire();
    const f = etat.form;
    if (!f || !f.titre) return toast('Indique au moins le titre.');

    const data = {
      id: f.id || uid(),
      date: f.date || Date.now(),
      titre: f.titre,
      fabricant: f.fabricant || '',
      reference: f.reference || '',
      gamme: f.gamme || '',
      annee: Number(f.annee) || null,
      region: f.region || '',
      format: f.format || '',
      typeEcran: f.typeEcran || '',
      couleur: f.couleur || '',
      licence: f.licence || '',
      etat: f.etat || '',
      fonctionnement: f.fonctionnement || '',
      completude: f.completude || '',
      numeroSerie: f.numeroSerie || '',
      prixAchat: Number(f.prixAchat) > 0 ? Number(f.prixAchat) : null,
      dateAchat: f.dateAchat || '',
      notes: f.notes || '',
      favori: !!f.favori,
      photos: [...(f.photos || [])],
      imageWeb: f.imageWeb || '',
      valeur: f.valeur || null,
      dateEstimation: f.dateEstimation || null,
      releve: f.releve || null
    };

    for (const id of f.supprimees || []) photoSupprimer(id);

    const i = collection.findIndex(j => j.id === data.id);
    if (i >= 0) collection[i] = data; else collection.unshift(data);
    if (f.depuisRecherche) recherches = recherches.filter(r => r.id !== f.depuisRecherche);

    sauver();
    etat.form = null;
    etat.lens = null;
    etat.annoncesOuvertes = '';
    etat.modal = 'fiche';
    etat.ficheId = data.id;
    etat.index = 0;
    rendre();
    toast(i >= 0 ? 'Jeu modifié.' : 'Jeu ajouté à ta collection.');
  }

  function enregistrerRecherche() {
    lireFormulaire();
    const f = etat.form;
    if (!f || !f.titre) return toast('Indique au moins le titre.');
    const data = {
      id: f.id || uid(),
      date: f.date || Date.now(),
      statut: f.statut || 'suivi',
      titre: f.titre,
      fabricant: f.fabricant || '',
      reference: f.reference || '',
      gamme: f.gamme || '',
      annee: Number(f.annee) || null,
      budget: Number(f.budget) > 0 ? Number(f.budget) : null,
      notes: f.notes || '',
      valeur: f.valeur || null,
      releve: f.releve || null,
      dateEstimation: f.dateEstimation || null
    };
    const i = recherches.findIndex(r => r.id === data.id);
    if (i >= 0) recherches[i] = data; else recherches.unshift(data);
    etat.form = null;
    etat.modal = null;
    sauver();
    rendre();
    toast('Recherche enregistrée.');
  }

  /* ========== Réglages, export, import ========== */
  function sauverReglages() {
    params.prenom = ($('#prenom')?.value || '').trim();
    params.relais = ($('#relais')?.value || '').trim().replace(/\/+$/, '');
    params.code = ($('#code')?.value || '').trim();
    sauver();
  }

  async function tester() {
    sauverReglages();
    const el = $('#res-test');
    if (el) el.textContent = 'Test en cours…';
    try {
      const j = await relais('test');
      if (el) el.innerHTML = `Connexion OK · version ${esc(j.version)}<br>SerpApi ${j.serpapi ? 'OK' : 'absent'} · Lens ${j.lens ? 'OK' : 'absent'} · eBay ${j.ebay ? 'OK' : 'absent'} · KV ${j.kv ? 'OK' : 'absent'}`;
    } catch (e) {
      if (el) el.innerHTML = `<span class="rouge">Échec : ${esc(e.message)}</span>`;
    }
  }

  async function exporter() {
    toast('Préparation de la sauvegarde…', true);
    const photos = await photosToutes();
    const contenu = { app: 'pocket-museum', version: VERSION, date: new Date().toISOString(), collection, recherches, photos };
    const blob = new Blob([JSON.stringify(contenu)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pocket-museum-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    toast('Sauvegarde téléchargée.');
  }

  async function importer(file) {
    try {
      const d = JSON.parse(await file.text());
      if (d.app !== 'pocket-museum' || !Array.isArray(d.collection)) throw new Error('fichier non reconnu');
      if (!confirm(`Remplacer la collection actuelle par ${d.collection.length} jeu(x) du fichier ?`)) return;
      collection = d.collection;
      recherches = Array.isArray(d.recherches) ? d.recherches : [];
      for (const [id, data] of Object.entries(d.photos || {})) await photoSauver(id, data);
      sauver();
      rendre();
      toast('Sauvegarde restaurée.');
    } catch (e) { toast('Import impossible : ' + e.message); }
  }

  async function toutEffacer() {
    if (!confirm('Effacer toute la collection, les recherches et les photos de ce navigateur ?')) return;
    collection = [];
    recherches = [];
    sauver();
    const d = await db();
    await new Promise((res, rej) => {
      const tx = d.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).clear();
      tx.oncomplete = res;
      tx.onerror = () => rej(tx.error);
    });
    etat.page = 'accueil';
    rendre();
    toast('Données effacées.');
  }

  /* ========== Événements ========== */
  function brancher() {
    const root = $('#app');

    root.addEventListener('click', async e => {
      const b = e.target.closest('[data-a]');
      if (!b || !root.contains(b)) return;
      const a = b.dataset.a;
      const id = b.dataset.id;

      if (a === 'fermer-voile' && e.target !== b) return;

      try {
        switch (a) {
          case 'page':
            etat.page = b.dataset.p;
            rendre();
            window.scrollTo(0, 0);
            break;

          case 'ajouter': ouvrirForm(null); break;
          case 'ajouter-recherche': ouvrirFormRecherche(null); break;

          case 'fiche':
            etat.modal = 'fiche'; etat.ficheId = id; etat.index = 0; etat.annoncesOuvertes = '';
            rendre();
            break;

          case 'voir-recherche':
            etat.modal = 'fiche-recherche'; etat.ficheId = id; etat.annoncesOuvertes = '';
            rendre();
            break;

          case 'favori': {
            const j = collection.find(x => x.id === id);
            if (j) { j.favori = !j.favori; sauver(); rendre(); }
            break;
          }

          case 'modifier': {
            const j = collection.find(x => x.id === id);
            if (j) ouvrirForm(j);
            break;
          }

          case 'supprimer': {
            const j = collection.find(x => x.id === id);
            if (j && confirm(`Supprimer « ${j.titre} » de ta collection ?`)) {
              for (const p of j.photos || []) await photoSupprimer(p);
              collection = collection.filter(x => x.id !== id);
              sauver();
              etat.modal = null;
              rendre();
              toast('Jeu supprimé.');
            }
            break;
          }

          case 'carrousel':
            etat.index += Number(b.dataset.d) || 0;
            rendre();
            break;

          case 'estimer': await estimer(b.dataset.c); break;

          case 'toggle-annonces':
            etat.annoncesOuvertes = etat.annoncesOuvertes === b.dataset.c ? '' : b.dataset.c;
            rendre();
            break;

          case 'photo-web': await photoWeb(b.dataset.c); break;

          case 'photo-retirer': await retirerPhoto(Number(b.dataset.i)); break;

          case 'lens': await lens(); break;
          case 'lens-appliquer': appliquerLens(Number(b.dataset.i)); break;

          case 'enregistrer': enregistrerJeu(); break;
          case 'enregistrer-recherche': enregistrerRecherche(); break;

          case 'fermer':
          case 'fermer-voile':
            await fermerModal();
            break;

          case 'modifier-recherche': {
            const r = recherches.find(x => x.id === id);
            if (r) ouvrirFormRecherche(r);
            break;
          }

          case 'verifier-recherche': await estimer('r:' + id); break;

          case 'verifier-tout':
            for (const r of recherches.filter(x => x.statut !== 'trouve')) await estimer('r:' + r.id);
            break;

          case 'recherche-trouvee': {
            const r = recherches.find(x => x.id === id);
            if (r) { r.statut = 'trouve'; sauver(); rendre(); toast('Bravo, retrouvé !'); }
            break;
          }

          case 'recherche-vers-collection': {
            const r = recherches.find(x => x.id === id);
            if (r) {
              ouvrirForm({
                titre: r.titre, fabricant: r.fabricant, reference: r.reference, gamme: r.gamme,
                annee: r.annee || '', notes: r.notes || '', depuisRecherche: r.id
              });
            }
            break;
          }

          case 'supprimer-recherche': {
            const r = recherches.find(x => x.id === id);
            if (r && confirm(`Retirer « ${r.titre} » des jeux recherchés ?`)) {
              recherches = recherches.filter(x => x.id !== id);
              etat.modal = null;
              sauver();
              rendre();
            }
            break;
          }

          case 'sauver-reglages':
            sauverReglages();
            rendre();
            toast('Réglages enregistrés.');
            break;

          case 'tester': await tester(); break;
          case 'exporter': await exporter(); break;
          case 'tout-effacer': await toutEffacer(); break;
        }
      } catch (err) {
        console.error(err);
        toast('Oups : ' + (err.message || err));
      }
    });

    root.addEventListener('input', e => {
      if (e.target.id === 'recherche') {
        etat.recherche = e.target.value;
        const z = $('#zone-liste');
        if (z) { z.innerHTML = listeCollection(); chargerPhotos(); }
      }
    });

    root.addEventListener('change', async e => {
      const t = e.target;
      if (t.dataset.filtre) {
        etat.filtre[t.dataset.filtre] = t.value;
        rendre();
      } else if (t.id === 'fichier-photo') {
        const liste = [...t.files];
        t.value = '';
        await ajouterPhotos(liste);
      } else if (t.id === 'fichier-import' && t.files[0]) {
        const fichier = t.files[0];
        t.value = '';
        await importer(fichier);
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && etat.modal) fermerModal();
    });
  }

  async function demarrer() {
    brancher();
    rendre();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
