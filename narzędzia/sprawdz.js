#!/usr/bin/env node
// Deterministyczne sprawdzenie jednego scenariusza odcinka. Bez zależności, tylko Node.
//
//   node narzędzia/sprawdz.js NN              raport dla odcinka o numerze NN
//   node narzędzia/sprawdz.js "odcinki/03 X"  raport dla folderu
//   node narzędzia/sprawdz.js NN --metryka    dodatkowo wpisuje sceny, kwestie, słowa i czas do metryki w scenariusz.md
//
// Skrypt robi to, czego model nie powinien robić z pamięci: liczy, grepuje, sprawdza istnienie plików.
// Ocenę jakości zostawia skillowi /sprawdz.
//
// Format scenariusza (odcinki/_szablon/scenariusz.md):
//   ## Scena N. Miejsce, pora        nagłówek sceny
//   **IMIĘ:** tekst kwestii          kwestia; imię wielkimi literami
//   (didaskalia)                     akapit w nawiasie albo nawias na początku kwestii
//   Narratora nie ma: każdy akapit poza nagłówkiem, kwestią i nawiasem jest błędem.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SLOW_DIALOGU_NA_MINUTE = 140; // tempo mówienia w animacji dla dzieci
const SEKUND_NA_DIDASKALIUM = 4;     // średni czas akcji opisanej jednym akapitem
const MIN_MINUT = 8.5;
const MAX_MINUT = 9.5;
const MAX_SLOW_W_ZDANIU = 15;
const MAX_SLOW_W_KWESTII = 40;
const MIN_SCEN = 4;
const MAX_SCEN = 9;

// ---------- maniery (patrz .claude/skills/sprawdz/maniery.md) ----------
const L = "\\p{L}";
const brzeg = (s) => `(?<![${"\\p{L}"}])(?:${s})(?![${"\\p{L}"}])`;
const MANIERY = [
  ["słowo-sygnał: nagle/wtem/niespodziewanie", brzeg(`nagle|wtem|niespodziewanie|znienacka`)],
  ["słowo-sygnał: i wtedy / a wtedy / wtedy", brzeg(`(?:i |a )?wtedy`)],
  ["przymiotnik z szuflady: magiczny, niesamowity, wspaniały, ogromny, cudowny", brzeg(`magiczn${L}*|niesamowit${L}*|wspania${L}*|ogromn${L}*|cudown${L}*|przepiękn${L}*`)],
  ["„przygoda” zamiast konkretu", brzeg(`przygod${L}*`)],
  ["„mały/mała” jako epitet przy imieniu", brzeg(`mał[ay] (?:ada|antek|olek|zuzia|ado|antka|olka|zuzię|adę)`)],
  ["didaskalium o uczuciu zamiast o czynie: z zapałem / z entuzjazmem / ze smutkiem", brzeg(`z (?:zapałem|entuzjazmem|ciekawością|uśmiechem|radością|przejęciem|niepokojem)|ze (?:smutkiem|strachem|złością|wstydem)`)],
  ["„postanowił/a” zamiast działania", brzeg(`postanowi${L}*`)],
  ["zbiorowość zamiast imion: każdy z nich / wszyscy razem / cała czwórka", brzeg(`każd${L}* z nich|wszyscy razem|cała czwórka|cała gromad${L}*`)],
  ["wzmacniacz: naprawdę / bardzo / tak bardzo", brzeg(`naprawdę|bardzo|strasznie|okropnie`)],
  ["morał wypowiedziany", brzeg(`nauczy${L}* się|zrozumie${L}*, że|zrozumia${L}*, że|najważniejsze (?:jest|było)|od tego dnia|od tej pory|ważn${L}* lekcj${L}*|morał`)],
  ["zbiorowy śmiech na koniec", brzeg(`(?:wszyscy )?(?:się )?roześmia${L}*|wybuchn${L}* śmiechem|zaśmiali się wszyscy|wszyscy się śmieją`)],
  ["zapowiedź / pytanie do widza", brzeg(`to już inna historia|następn${L}* przygod${L}*|a ty co byś|a wy co byście|do zobaczenia w następnym`)],
  ["przyjaźń jako wniosek", brzeg(`razem mog${L}* wszystko|przyjaźń jest najważniejsza|prawdziw${L}* przyjaci${L}*`)],
  ["uczucie nazwane: był/a smutny, zły, szczęśliwy / jest smutna", brzeg(`(?:by${L}*|jest|są) (?:smutn${L}*|zł[aye]|szczęśliw${L}*|przestraszon${L}*|zawstydzon${L}*|rozczarowan${L}*|dumn${L}*|wściek${L}*|zdenerwowan${L}*)`)],
  ["uczucie nazwane: poczuł/a strach, radość", brzeg(`poczu${L}* (?:strach|radość|złość|smutek|ulgę|dumę|wstyd)|czuje (?:strach|radość|złość|smutek|ulgę|dumę|wstyd)`)],
  ["uczucie nazwane: ucieszył/a się, cieszy się", brzeg(`ucieszy${L}* się|cieszy się`)],
  ["myśl zamiast czynu: pomyślał/a sobie, wiedział/a co robić, myśli", brzeg(`pomyśla${L}* sobie|wiedzia${L}*, co robić|wiedzia${L}* już, co|myśli, że|myśli o`)],
  ["didaskalium: wykrzyknął, zawołał z", brzeg(`wykrzykn${L}*|zawoła${L}* z ${L}+em`)],
  ["słowo dorosłe (kandydat na „jedno nowe słowo”)", brzeg(`eksperyment${L}*|hipotez${L}*|konsekwencj${L}*|koncentr${L}*|atmosfer${L}*|reakcj${L}*|mechanizm${L}*|proces${L}*|obserwacj${L}*|współprac${L}*|odpowiedzialn${L}*|przeanalizowa${L}*|interesując${L}*`)],
  ["dziecko mówi jak dorosły", brzeg(`to bardzo interesujące|musimy przeanalizować|zastanówmy się|proponuję, abyśmy`)],
  ["dialog opisuje to, co widać: „patrz, pada deszcz”, „jesteśmy na placu”", brzeg(`jesteśmy (?:na|w) ${L}+|patrz(?:cie)?, (?:pada|świeci|jest ciemno)`)],
  ["termin filmowy w didaskaliach (reżyser to zrobi)", brzeg(`zbliżenie|cięcie|kamera|ujęcie|zoom|najazd|plan ogólny|montaż|fade`)],
];

// ---------- pomocnicze ----------
function czytaj(p) { return fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n"); }
function istnieje(p) { try { fs.accessSync(p); return true; } catch { return false; } }
function liczSlowa(t) { return (t.match(/[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu) || []).length; }
function bezOgonka(s) { return s.replace(/[.!?…,;:]+$/u, "").trim(); }
function tytulowe(s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); }

// ---------- znajdź odcinek ----------
function znajdzFolder(arg) {
  if (!arg) throw new Error("Podaj numer odcinka (NN) albo ścieżkę do folderu.");
  const bezposredni = path.resolve(ROOT, arg);
  if (istnieje(path.join(bezposredni, "scenariusz.md"))) return bezposredni;
  const dir = path.join(ROOT, "odcinki");
  const nn = arg.padStart(2, "0");
  const kandydaci = fs.readdirSync(dir).filter((d) => d.startsWith(nn + " "));
  if (kandydaci.length === 0) throw new Error(`Nie ma folderu odcinki/${nn} … .`);
  if (kandydaci.length > 1) throw new Error(`Kilka folderów z numerem ${nn}: ${kandydaci.join(", ")}`);
  return path.join(dir, kandydaci[0]);
}

// ---------- parsowanie scenariusza ----------
function parsuj(md) {
  const linie = md.split("\n");
  const metryka = {};
  for (const l of linie) {
    const m = l.match(/^\|\s*([^|]+?)\s*\|\s*(.*?)\s*\|\s*$/);
    if (m && m[1] && !/^-+$/.test(m[1])) metryka[m[1]] = m[2];
  }
  const idx = [];
  linie.forEach((l, i) => { if (/^---\s*$/.test(l)) idx.push(i); });
  const od = idx.length >= 1 ? idx[0] + 1 : 0;
  const doL = idx.length >= 2 ? idx[1] : linie.length;

  const sceny = [];       // {nr, naglowek, linia, kwestie: [], didaskalia: [], narracja: []}
  const kwestie = [];     // {linia, kto, tekst, scena}
  const didaskalia = [];  // {linia, tekst, scena}
  const narracja = [];    // akapity bez nawiasu i bez mówcy
  let biezaca = null;

  for (let i = od; i < doL; i++) {
    const nr = i + 1;
    const l = linie[i];
    if (!l.trim()) continue;
    let m;
    if ((m = l.match(/^##\s+Scena\s+(\d+)\.?\s*(.*)$/i))) {
      biezaca = { nr: Number(m[1]), naglowek: m[2].trim(), linia: nr, kwestie: [], didaskalia: [], narracja: [] };
      sceny.push(biezaca);
      continue;
    }
    if (/^#/.test(l)) continue; // inne nagłówki (np. Zasady zapisu w szablonie)
    if ((m = l.match(/^\*\*([^*:]+):\*\*\s*(.*)$/))) {
      const kto = m[1].trim();
      let tekst = m[2].trim();
      // didaskalium na początku kwestii
      const d = tekst.match(/^\((.*?)\)\s*(.*)$/);
      if (d) {
        didaskalia.push({ linia: nr, tekst: d[1], scena: biezaca ? biezaca.nr : 0 });
        tekst = d[2];
      }
      const k = { linia: nr, kto, tekst, scena: biezaca ? biezaca.nr : 0 };
      kwestie.push(k);
      if (biezaca) biezaca.kwestie.push(k);
      continue;
    }
    if (/^\(.*\)\s*$/.test(l.trim())) {
      const d = { linia: nr, tekst: l.trim().slice(1, -1), scena: biezaca ? biezaca.nr : 0 };
      didaskalia.push(d);
      if (biezaca) biezaca.didaskalia.push(d);
      continue;
    }
    const n = { linia: nr, tekst: l.trim(), scena: biezaca ? biezaca.nr : 0 };
    narracja.push(n);
    if (biezaca) biezaca.narracja.push(n);
  }
  return { metryka, sceny, kwestie, didaskalia, narracja, od, doL, linie };
}

// ---------- karty ----------
function zwrotyPostaci(imie) {
  const f = imie.toLowerCase();
  const p = path.join(ROOT, "postacie", f, `${f}.md`);
  if (!istnieje(p)) return null;
  const m = czytaj(p).match(/Ulubione zwroty:\s*(.+)/u);
  if (!m) return [];
  return Array.from(m[1].matchAll(/„([^”]+)”/gu)).map((x) => bezOgonka(x[1]));
}

function dorosli() {
  const p = path.join(ROOT, "postacie", "dorośli.md");
  if (!istnieje(p)) return [];
  const wynik = [];
  for (const l of czytaj(p).split("\n")) {
    if (!l.startsWith("|")) continue;
    for (const m of l.matchAll(/\*\*(?:pani |pan )?([\p{L}]+)\*\*/gu)) {
      const imie = m[1];
      if (/^(Ada|Antek|Olek|Zuzia|Dziecko|Rodzic|Osoba)$/i.test(imie)) continue;
      wynik.push(imie);
    }
  }
  return Array.from(new Set(wynik));
}

function faktyKanonu(dotyczy) {
  const p = path.join(ROOT, "odcinki", "kanon.md");
  if (!istnieje(p)) return [];
  const sekcja = czytaj(p).split(/^## Fakty wycofane/m)[0];
  const wynik = [];
  for (const l of sekcja.split("\n")) {
    const m = l.match(/^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.*?)\s*\|\s*$/);
    if (!m) continue;
    const cele = m[4].toLowerCase().split(",").map((s) => s.trim());
    if (cele.some((c) => dotyczy.includes(c) || c === "świat")) wynik.push({ nr: m[1], fakt: m[2], zrodlo: m[3], dotyczy: m[4], wKarcie: m[5] });
  }
  return wynik;
}

function wierszIndeksu(nn) {
  const p = path.join(ROOT, "odcinki", "README.md");
  if (!istnieje(p)) return null;
  for (const l of czytaj(p).split("\n")) {
    const m = l.match(/^\|\s*(\d+)\s*\|(.*)\|\s*$/);
    if (m && m[1].padStart(2, "0") === nn) {
      const kol = l.split("|").map((s) => s.trim());
      return { status: kol[kol.length - 2], linia: l };
    }
  }
  return null;
}

function kartaMiejsca(nazwa) {
  const f = nazwa.toLowerCase().replace(/`/g, "").trim();
  const kp = path.join(ROOT, "miejsca", f, `${f}.md`);
  if (!istnieje(kp)) return null;
  const st = (czytaj(kp).match(/^Status:\s*([^.]+)/m) || [null, "?"])[1].trim();
  return { sciezka: `miejsca/${f}/${f}.md`, status: st };
}

// ---------- główna ----------
function main() {
  const args = process.argv.slice(2);
  const flagi = new Set(args.filter((a) => a.startsWith("--")));
  const cel = args.find((a) => !a.startsWith("--"));
  const folder = znajdzFolder(cel);
  const nazwa = path.basename(folder);
  const nn = (nazwa.match(/^(\d+)/) || [null, "??"])[1].padStart(2, "0");
  const plik = path.join(folder, "scenariusz.md");
  const md = czytaj(plik);
  const { metryka, sceny, kwestie, didaskalia, narracja } = parsuj(md);
  const out = [];
  const p = (s = "") => out.push(s);

  p(`# Sprawdzenie skryptem: ${nazwa}`);
  p();

  // 1. czas
  const slowaDialogu = kwestie.reduce((a, k) => a + liczSlowa(k.tekst), 0);
  const minuty = Math.round(((slowaDialogu / SLOW_DIALOGU_NA_MINUTE) + (didaskalia.length * SEKUND_NA_DIDASKALIUM) / 60) * 10) / 10;
  const status = metryka["Status"] || "?";
  p(`## Czas`);
  p(`- Sceny: ${sceny.length}, kwestie: ${kwestie.length}, didaskalia: ${didaskalia.length}, słowa dialogu: ${slowaDialogu}.`);
  p(`- Szacowany czas historii: ok. ${minuty} min (dialog ${SLOW_DIALOGU_NA_MINUTE} słów/min + ${SEKUND_NA_DIDASKALIUM} s na didaskalium). Cel: ${MIN_MINUT} do ${MAX_MINUT} min bez czołówki i napisów.`);
  if (minuty < MIN_MINUT) p(`- UWAGA: za krótko o ok. ${Math.round((MIN_MINUT - minuty) * 10) / 10} min.`);
  if (minuty > MAX_MINUT) p(`- UWAGA: za długo o ok. ${Math.round((minuty - MAX_MINUT) * 10) / 10} min.`);
  p(`- Status w metryce: ${status}`);
  p();

  // 2. sceny
  p(`## Sceny`);
  if (!sceny.length) p(`- BRAK nagłówków scen (oczekiwane: „## Scena 1. Miejsce, pora”).`);
  if (sceny.length && (sceny.length < MIN_SCEN || sceny.length > MAX_SCEN)) p(`- UWAGA: ${sceny.length} scen; typowo ${MIN_SCEN} do ${MAX_SCEN} na 9 minut.`);
  sceny.forEach((s, i) => {
    const problemy = [];
    if (s.nr !== i + 1) problemy.push(`numer ${s.nr}, oczekiwany ${i + 1}`);
    if (!s.naglowek) problemy.push("brak miejsca i pory w nagłówku");
    else if (!/,/.test(s.naglowek)) problemy.push("nagłówek bez pory dnia (oczekiwane „Miejsce, pora”)");
    const pierwsza = [...s.kwestie, ...s.didaskalia].sort((a, b) => a.linia - b.linia)[0];
    if (pierwsza && s.kwestie.includes(pierwsza)) problemy.push("scena zaczyna się od kwestii, nie od didaskalium (co widać?)");
    if (!s.kwestie.length) problemy.push("scena bez kwestii");
    const slowa = s.kwestie.reduce((a, k) => a + liczSlowa(k.tekst), 0);
    const min = Math.round(((slowa / SLOW_DIALOGU_NA_MINUTE) + (s.didaskalia.length * SEKUND_NA_DIDASKALIUM) / 60) * 10) / 10;
    p(`- Scena ${s.nr} (linia ${s.linia}): „${s.naglowek}”, ${s.kwestie.length} kwestii, ok. ${min} min${problemy.length ? ". PROBLEMY: " + problemy.join("; ") : ""}`);
  });
  if (narracja.length) {
    p(`- NARRACJA POZA NAWIASEM (${narracja.length}); narratora nie ma, akapit musi być kwestią albo didaskalium w nawiasie:`);
    for (const n of narracja.slice(0, 15)) p(`  - linia ${n.linia}: ${n.tekst.slice(0, 90)}`);
  }
  p();

  // 3. kwestie i zdania
  p(`## Kwestie i zdania`);
  const mowcy = {};
  for (const k of kwestie) {
    const key = k.kto.toUpperCase();
    mowcy[key] = mowcy[key] || { kwestie: 0, slowa: 0 };
    mowcy[key].kwestie++;
    mowcy[key].slowa += liczSlowa(k.tekst);
  }
  const postacie = (metryka["Postacie"] || "Ada, Antek, Olek, Zuzia").split(",").map((s) => s.trim()).filter(Boolean);
  const dorosliMetryka = (metryka["Dorośli"] || "").split(",").map((s) => s.trim()).filter((s) => s && !/^brak/i.test(s));
  const znani = new Set([...postacie, ...dorosli()].map((s) => s.toUpperCase()));
  const dozwoleni = new Set([...postacie, ...dorosliMetryka].map((s) => s.toUpperCase().replace(/^(PANI|PAN)\s+/, "")));
  const rozklad = Object.entries(mowcy).sort((a, b) => b[1].slowa - a[1].slowa).map(([k, v]) => `${tytulowe(k)} ${v.kwestie} kw./${v.slowa} sł.`);
  p(`- Rozkład: ${rozklad.join(", ") || "brak kwestii"}.`);
  for (const key of Object.keys(mowcy)) {
    const czysty = key.replace(/^(PANI|PAN)\s+/, "");
    if (/^(NARRATOR|LEKTOR|GŁOS|NARRATORKA)$/.test(czysty)) p(`- NARRATOR w scenariuszu (${mowcy[key].kwestie} kw.); narratora nie ma.`);
    else if (/^PIOSENKA$/.test(czysty)) p(`- Piosenka w odcinku: ${mowcy[key].kwestie} blok(i), ${mowcy[key].slowa} słów.`);
    else if (/^(WSZYSCY|RAZEM|DZIECI)$/.test(czysty)) p(`- Kwestia zbiorowa „${tytulowe(key)}” (${mowcy[key].kwestie}): dopuszczalna dla zawołania, nie dla zdania.`);
    else if (!znani.has(czysty)) p(`- NIEZNANY MÓWCA „${tytulowe(key)}” (${mowcy[key].kwestie} kw.): nie ma go w kartach postaci ani w dorośli.md.`);
    else if (!dozwoleni.has(czysty)) p(`- Mówca „${tytulowe(key)}” nie jest wpisany w metryce (Postacie / Dorośli).`);
  }
  for (const imie of postacie) if (!mowcy[imie.toUpperCase()]) p(`- ${imie} jest w metryce, ale nie ma ani jednej kwestii.`);
  const dlugieKw = kwestie.filter((k) => liczSlowa(k.tekst) > MAX_SLOW_W_KWESTII);
  if (dlugieKw.length) {
    p(`- Kwestie dłuższe niż ${MAX_SLOW_W_KWESTII} słów (monolog; rozbij działaniem) (${dlugieKw.length}):`);
    for (const k of dlugieKw) p(`  - linia ${k.linia}, ${tytulowe(k.kto)} (${liczSlowa(k.tekst)} słów)`);
  }
  const dlugieZd = [];
  let zdan = 0, sumaZd = 0;
  for (const k of kwestie) {
    for (const z of k.tekst.split(/(?<=[.!?…])\s+/u)) {
      const n = liczSlowa(z);
      if (!n) continue;
      zdan++; sumaZd += n;
      if (n > MAX_SLOW_W_ZDANIU) dlugieZd.push({ linia: k.linia, kto: k.kto, n, z: z.trim() });
    }
  }
  p(`- Zdania w dialogu: ${zdan}, średnio ${zdan ? Math.round((sumaZd / zdan) * 10) / 10 : 0} słów.`);
  if (dlugieZd.length) {
    p(`- Zdania dłuższe niż ${MAX_SLOW_W_ZDANIU} słów (${dlugieZd.length}):`);
    for (const d of dlugieZd) p(`  - linia ${d.linia}, ${tytulowe(d.kto)} (${d.n}): ${d.z}`);
  }
  const wykrz = kwestie.filter((k) => (k.tekst.match(/!/g) || []).length > 1).map((k) => k.linia);
  if (wykrz.length) p(`- Więcej niż jeden wykrzyknik w kwestii: linie ${wykrz.join(", ")}`);
  const wielokr = kwestie.filter((k) => /\.\.\.|…/.test(k.tekst)).map((k) => k.linia);
  if (wielokr.length) p(`- Wielokropki w kwestiach: linie ${wielokr.join(", ")}`);
  const didWykrz = didaskalia.filter((d) => /!/.test(d.tekst)).map((d) => d.linia);
  if (didWykrz.length) p(`- Wykrzykniki w didaskaliach: linie ${didWykrz.join(", ")}`);
  p();

  // 4. maniery
  p(`## Maniery (z maniery.md)`);
  let trafien = 0;
  const zrodla = [
    ...kwestie.map((k) => ({ linia: k.linia, tekst: k.tekst, typ: "dialog" })),
    ...didaskalia.map((d) => ({ linia: d.linia, tekst: d.tekst, typ: "didaskalia" })),
    ...narracja.map((n) => ({ linia: n.linia, tekst: n.tekst, typ: "narracja" })),
  ];
  for (const [etykieta, wzor] of MANIERY) {
    const re = new RegExp(wzor, "giu");
    const lista = [];
    for (const z of zrodla) for (const m of z.tekst.matchAll(re)) lista.push(`${z.linia} (${z.typ}): „${m[0]}”`);
    if (lista.length) { trafien += lista.length; p(`- ${etykieta} (${lista.length}): ${lista.join("; ")}`); }
  }
  if (!trafien) p(`- Brak trafień.`);
  p();

  // 5. postacie i zwroty (w kwestiach danej postaci)
  p(`## Postacie i zwroty z kart`);
  const calosc = zrodla.map((z) => z.tekst).join("\n").toLowerCase();
  for (const imie of postacie) {
    const zw = zwrotyPostaci(imie);
    if (zw === null) { p(`- ${imie}: BRAK KARTY w postacie/`); continue; }
    const wlasne = kwestie.filter((k) => k.kto.toUpperCase() === imie.toUpperCase()).map((k) => k.tekst.toLowerCase()).join("\n");
    const uzyte = zw.filter((z) => wlasne.includes(z.toLowerCase()));
    if (!zw.length) p(`- ${imie}: karta nie ma listy zwrotów.`);
    else if (!uzyte.length) p(`- ${imie}: ŻADEN zwrot z karty nie padł w jej/jego kwestiach (${zw.map((z) => `„${z}”`).join(", ")}).`);
    else p(`- ${imie}: użyte zwroty: ${uzyte.map((z) => `„${z}”`).join(", ")}${uzyte.length < zw.length ? `; nieużyte: ${zw.filter((z) => !uzyte.includes(z)).map((z) => `„${z}”`).join(", ")}` : ""}`);
  }
  const lunaMetryka = (metryka["Luna"] || "").toLowerCase();
  const detale = [
    ["Luna w kadrze (didaskalia lub kwestia)", /luna|lunę|luny|lunie|luną/u, postacie.includes("Zuzia") && !/^nie/.test(lunaMetryka)],
    ["kieszeń Olka", /kiesze/u, postacie.includes("Olek")],
    ["„po równo” (Olek)", /po równo|po tyle samo/u, postacie.includes("Olek")],
    ["porównanie Zuzi „wygląda jak”", /wygląda jak|wyglądało jak|wyglądały jak|wyglądają jak/u, postacie.includes("Zuzia")],
    ["odliczanie Ady", /trzy, dwa, jeden|trzy… dwa… jeden|3, 2, 1/u, postacie.includes("Ada")],
    ["„a może tak” (Antek)", /a może tak/u, postacie.includes("Antek")],
    ["„proszę” lub „dziękuję” w kwestii Antka", null, postacie.includes("Antek")],
  ];
  for (const [nazwaD, re, wymagany] of detale) {
    if (!wymagany) continue;
    let jest;
    if (re) jest = re.test(calosc);
    else jest = kwestie.some((k) => k.kto.toUpperCase() === "ANTEK" && /proszę|dziękuję|przepraszam/iu.test(k.tekst));
    p(`- detal ${nazwaD}: ${jest ? "jest" : "BRAK"}`);
  }
  p();

  // 6. miejsca
  p(`## Miejsca`);
  const glowne = (metryka["Miejsce główne"] || metryka["Miejsce"] || "").trim();
  const poboczne = (metryka["Miejsce poboczne"] || "").trim();
  for (const [etykieta, m] of [["główne", glowne], ["poboczne", poboczne]]) {
    if (!m || /^brak/i.test(m)) { if (etykieta === "główne") p(`- Metryka nie ma miejsca głównego.`); continue; }
    if (/jednorazow/i.test(m)) { p(`- Miejsce ${etykieta} jednorazowe: ${m}. Opis musi być w konspekcie.`); continue; }
    const k = kartaMiejsca(m);
    if (k) p(`- Miejsce ${etykieta} „${m}”: karta ${k.sciezka} (status: ${k.status})`);
    else p(`- BRAK karty dla miejsca ${etykieta} „${m}”.`);
  }
  const miejscaScen = new Set(sceny.map((s) => s.naglowek.split(",")[0].trim().toLowerCase()).filter(Boolean));
  const zadeklarowane = [glowne, poboczne].filter((m) => m && !/^brak/i.test(m)).map((m) => m.toLowerCase());
  for (const ms of miejscaScen) {
    if (!zadeklarowane.some((z) => ms.includes(z) || z.includes(ms))) p(`- Scena w miejscu „${ms}”, którego nie ma w metryce (główne/poboczne).`);
  }
  if (miejscaScen.size > 2) p(`- UWAGA: ${miejscaScen.size} różnych miejsc w scenach; odcinek wytrzymuje dwa.`);
  p();

  // 7. kanon
  p(`## Kanon (odcinki/kanon.md)`);
  const dotyczy = [...postacie, ...dorosliMetryka].map((s) => s.toLowerCase()).concat([glowne.toLowerCase(), poboczne.toLowerCase()]).filter(Boolean);
  const fakty = faktyKanonu(dotyczy);
  if (!fakty.length) p(`- Brak faktów w kanonie dla tych miejsc i postaci.`);
  else for (const f of fakty) p(`- [${f.nr}] ${f.fakt} (źródło: ${f.zrodlo}; dotyczy: ${f.dotyczy}; w karcie: ${f.wKarcie || "nie"})`);
  p();

  // 8. indeks
  p(`## Indeks odcinki/README.md`);
  const w = wierszIndeksu(nn);
  if (!w) p(`- BRAK wiersza dla numeru ${nn}.`);
  else if (w.status !== status) p(`- Status w indeksie („${w.status}”) różni się od metryki („${status}”).`);
  else p(`- Wiersz jest, status zgodny („${status}”).`);
  p(`- konspekt.md: ${istnieje(path.join(folder, "konspekt.md")) ? "jest" : "BRAK"}`);
  if (/Zasady zapisu/.test(md)) p(`- W pliku została sekcja „Zasady zapisu” z szablonu; usuń ją w gotowym scenariuszu.`);
  p();

  // 9. metryka
  const wpisy = [["Sceny", String(sceny.length)], ["Kwestie", String(kwestie.length)], ["Słowa dialogu", String(slowaDialogu)], ["Szacowany czas", `ok. ${minuty} min`]];
  if (flagi.has("--metryka")) {
    let nowy = md, zmian = 0;
    for (const [klucz, wartosc] of wpisy) {
      const re = new RegExp(`^(\\|\\s*${klucz}\\s*\\|)[^\\n]*\\|\\s*$`, "m");
      if (re.test(nowy)) { nowy = nowy.replace(re, `$1 ${wartosc} |`); zmian++; }
    }
    if (zmian) { fs.writeFileSync(plik, nowy, "utf8"); p(`Metryka zaktualizowana: ${wpisy.map(([k, v]) => `${k} = ${v}`).join(", ")}.`); }
    else p(`Nie znaleziono wierszy metryki (Sceny, Kwestie, Słowa dialogu, Szacowany czas); nic nie zmieniono.`);
  } else {
    p(`Do wpisania w metrykę (albo uruchom z --metryka): ${wpisy.map(([k, v]) => `${k} = ${v}`).join(", ")}.`);
  }

  process.stdout.write(out.join("\n") + "\n");
}

try { main(); } catch (e) { console.error("Błąd: " + e.message); process.exit(1); }
