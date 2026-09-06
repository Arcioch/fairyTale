#!/usr/bin/env node
// Deterministyczne sprawdzenie jednej bajki. Bez zależności, tylko Node.
//
//   node narzędzia/sprawdz.js NN            raport dla bajki o numerze NN
//   node narzędzia/sprawdz.js "bajki/03 X"  raport dla folderu
//   node narzędzia/sprawdz.js NN --metryka  dodatkowo wpisuje słowa i czas czytania do metryki w bajka.md
//
// Skrypt robi to, czego model nie powinien robić z pamięci: liczy, grepuje, sprawdza istnienie plików.
// Ocenę jakości zostawia skillowi /sprawdz.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SLOWA_NA_MINUTE = 120;
const MAX_SLOW_W_ZDANIU = 15;
const MIN_SLOW = 600;
const MAX_SLOW = 1000;

// ---------- maniery (patrz .claude/skills/sprawdz/maniery.md) ----------
// Każdy wpis: [etykieta, regex]. Flaga u dla polskich liter, i dla wielkości.
const L = "\\p{L}"; // dowolna litera
const brzeg = (s) => `(?<![${"\\p{L}"}])(?:${s})(?![${"\\p{L}"}])`;
const MANIERY = [
  ["słowo-sygnał: nagle/wtem/niespodziewanie", brzeg(`nagle|wtem|niespodziewanie|znienacka`)],
  ["słowo-sygnał: i wtedy / a wtedy / wtedy", brzeg(`(?:i |a )?wtedy`)],
  ["przymiotnik z szuflady: magiczny, niesamowity, wspaniały, ogromny, cudowny", brzeg(`magiczn${L}*|niesamowit${L}*|wspania${L}*|ogromn${L}*|cudown${L}*|przepiękn${L}*`)],
  ["„przygoda” zamiast konkretu", brzeg(`przygod${L}*`)],
  ["„mały/mała” jako epitet przy imieniu", brzeg(`mał[ay] (?:ada|antek|olek|zuzia|ado|antka|olka|zuzię|adę)`)],
  ["didaskalium: z zapałem / z entuzjazmem / z ciekawością / z uśmiechem", brzeg(`z (?:zapałem|entuzjazmem|ciekawością|uśmiechem|radością|przejęciem)`)],
  ["„postanowił/a” zamiast działania", brzeg(`postanowi${L}*`)],
  ["zbiorowość zamiast imion: każdy z nich / wszyscy razem / cała czwórka", brzeg(`każd${L}* z nich|wszyscy razem|cała czwórka|cała gromad${L}*`)],
  ["wzmacniacz: naprawdę / bardzo / tak bardzo", brzeg(`naprawdę|bardzo|strasznie|okropnie`)],
  ["morał wypowiedziany", brzeg(`nauczy${L}* się|zrozumie${L}*, że|zrozumia${L}*, że|najważniejsze (?:jest|było)|od tego dnia|od tej pory|ważn${L}* lekcj${L}*`)],
  ["zbiorowy śmiech na koniec", brzeg(`(?:wszyscy )?(?:się )?roześmia${L}*|wybuchn${L}* śmiechem|zaśmiali się wszyscy`)],
  ["zapowiedź / pytanie do słuchacza", brzeg(`to już inna historia|następn${L}* przygod${L}*|a ty co byś|a wy co byście`)],
  ["przyjaźń jako wniosek", brzeg(`razem mog${L}* wszystko|przyjaźń jest najważniejsza|prawdziw${L}* przyjaci${L}*`)],
  ["pełen brzuch: zmęczeni, ale szczęśliwi", brzeg(`zmęczen${L}*,? ale szczęśliw${L}*|poszli spać z uśmiechem`)],
  ["uczucie nazwane: był/a smutny, zły, szczęśliwy", brzeg(`by${L}* (?:smutn${L}*|zł[aye]|szczęśliw${L}*|przestraszon${L}*|zawstydzon${L}*|rozczarowan${L}*|dumn${L}*|wściek${L}*)`)],
  ["uczucie nazwane: poczuł/a strach, radość", brzeg(`poczu${L}* (?:strach|radość|złość|smutek|ulgę|dumę|wstyd)`)],
  ["uczucie nazwane: ucieszył/a się", brzeg(`ucieszy${L}* się`)],
  ["myśl zamiast czynu: pomyślał/a sobie, wiedział/a co robić", brzeg(`pomyśla${L}* sobie|wiedzia${L}*, co robić|wiedzia${L}* już, co`)],
  ["didaskalium: wykrzyknął, zawołał z", brzeg(`wykrzykn${L}*|zawoła${L}* z ${L}+em`)],
  ["słowo dorosłe (kandydat na „jedno nowe słowo”)", brzeg(`eksperyment${L}*|hipotez${L}*|konsekwencj${L}*|koncentr${L}*|atmosfer${L}*|reakcj${L}*|mechanizm${L}*|proces${L}*|obserwacj${L}*|współprac${L}*|odpowiedzialn${L}*|przeanalizowa${L}*|interesując${L}*`)],
  ["dziecko mówi jak dorosły", brzeg(`to bardzo interesujące|musimy przeanalizować|zastanówmy się|proponuję, abyśmy`)],
];

// ---------- pomocnicze ----------
function czytaj(p) {
  return fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
}
function istnieje(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}
function liczSlowa(t) {
  return (t.match(/[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu) || []).length;
}
function bezOgonka(s) {
  return s.replace(/[.!?…,;:]+$/u, "").trim();
}

// ---------- znajdź bajkę ----------
function znajdzFolder(arg) {
  if (!arg) throw new Error("Podaj numer bajki (NN) albo ścieżkę do folderu.");
  const bezposredni = path.resolve(ROOT, arg);
  if (istnieje(path.join(bezposredni, "bajka.md"))) return bezposredni;
  const dir = path.join(ROOT, "bajki");
  const nn = arg.padStart(2, "0");
  const kandydaci = fs.readdirSync(dir).filter((d) => d.startsWith(nn + " "));
  if (kandydaci.length === 0) throw new Error(`Nie ma folderu bajki/${nn} … .`);
  if (kandydaci.length > 1) throw new Error(`Kilka folderów z numerem ${nn}: ${kandydaci.join(", ")}`);
  return path.join(dir, kandydaci[0]);
}

// ---------- metryka i tekst ----------
function parsujBajke(md) {
  const linie = md.split("\n");
  const metryka = {};
  for (const l of linie) {
    const m = l.match(/^\|\s*([^|]+?)\s*\|\s*(.*?)\s*\|\s*$/);
    if (m && m[1] && !/^-+$/.test(m[1]) && m[1] !== "") metryka[m[1]] = m[2];
  }
  // tekst = między pierwszą a drugą linią "---" (po metryce)
  const idx = [];
  linie.forEach((l, i) => { if (/^---\s*$/.test(l)) idx.push(i); });
  let od = 0, doL = linie.length;
  if (idx.length >= 1) od = idx[0] + 1;
  if (idx.length >= 2) doL = idx[1];
  const tekstLinie = linie.slice(od, doL);
  return { metryka, tekstLinie, od, linie };
}

function zdania(tekstLinie, offset) {
  const wynik = [];
  tekstLinie.forEach((l, i) => {
    const czyste = l.replace(/^[\s–—-]+/, "");
    if (!czyste.trim()) return;
    for (const z of czyste.split(/(?<=[.!?…])\s+/u)) {
      const n = liczSlowa(z);
      if (n > 0) wynik.push({ linia: offset + i + 1, slowa: n, tekst: z.trim() });
    }
  });
  return wynik;
}

// ---------- karty ----------
function zwrotyPostaci(imie) {
  const f = imie.toLowerCase();
  const p = path.join(ROOT, "postacie", f, `${f}.md`);
  if (!istnieje(p)) return null;
  const md = czytaj(p);
  const m = md.match(/Ulubione zwroty:\s*(.+)/u);
  if (!m) return [];
  return Array.from(m[1].matchAll(/„([^”]+)”/gu)).map((x) => bezOgonka(x[1]));
}

function faktyKanonu(dotyczy) {
  const p = path.join(ROOT, "bajki", "kanon.md");
  if (!istnieje(p)) return [];
  const md = czytaj(p);
  const sekcja = md.split(/^## Fakty wycofane/m)[0];
  const wynik = [];
  for (const l of sekcja.split("\n")) {
    const m = l.match(/^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.*?)\s*\|\s*$/);
    if (!m) continue;
    const cele = m[4].toLowerCase().split(",").map((s) => s.trim());
    if (cele.some((c) => dotyczy.includes(c) || c === "świat")) {
      wynik.push({ nr: m[1], fakt: m[2], zrodlo: m[3], dotyczy: m[4], wKarcie: m[5] });
    }
  }
  return wynik;
}

function wierszIndeksu(nn) {
  const p = path.join(ROOT, "bajki", "README.md");
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

// ---------- główna ----------
function main() {
  const args = process.argv.slice(2);
  const flagi = new Set(args.filter((a) => a.startsWith("--")));
  const cel = args.find((a) => !a.startsWith("--"));
  const folder = znajdzFolder(cel);
  const nazwa = path.basename(folder);
  const nn = (nazwa.match(/^(\d+)/) || [null, "??"])[1].padStart(2, "0");
  const plik = path.join(folder, "bajka.md");
  const md = czytaj(plik);
  const { metryka, tekstLinie, od } = parsujBajke(md);
  const tekst = tekstLinie.join("\n");
  const out = [];
  const p = (s = "") => out.push(s);

  p(`# Sprawdzenie skryptem: ${nazwa}`);
  p();

  // 1. długość
  const slowa = liczSlowa(tekst);
  const minuty = Math.round((slowa / SLOWA_NA_MINUTE) * 10) / 10;
  p(`## Długość`);
  p(`- Słowa w tekście (bez metryki i notatek): ${slowa}`);
  p(`- Czas czytania na głos: ok. ${minuty} min (${SLOWA_NA_MINUTE} słów/min)`);
  if (slowa < MIN_SLOW) p(`- UWAGA: poniżej ${MIN_SLOW} słów.`);
  if (slowa > MAX_SLOW) p(`- UWAGA: powyżej ${MAX_SLOW} słów.`);
  const status = metryka["Status"] || "?";
  p(`- Status w metryce: ${status}`);
  p();

  // 2. zdania
  const zd = zdania(tekstLinie, od);
  const dlugie = zd.filter((z) => z.slowa > MAX_SLOW_W_ZDANIU);
  const srednia = zd.length ? Math.round((zd.reduce((a, z) => a + z.slowa, 0) / zd.length) * 10) / 10 : 0;
  p(`## Zdania`);
  p(`- Liczba zdań: ${zd.length}, średnio ${srednia} słów.`);
  if (dlugie.length) {
    p(`- Zdania dłuższe niż ${MAX_SLOW_W_ZDANIU} słów (${dlugie.length}):`);
    for (const z of dlugie) p(`  - linia ${z.linia} (${z.slowa} słów): ${z.tekst}`);
  } else p(`- Brak zdań dłuższych niż ${MAX_SLOW_W_ZDANIU} słów.`);
  // dialog vs narracja
  const dialog = tekstLinie.filter((l) => /^\s*[–—-]\s/.test(l)).length;
  const narracja = tekstLinie.filter((l) => l.trim() && !/^\s*[–—-]\s/.test(l)).length;
  p(`- Wiersze dialogu: ${dialog}, wiersze narracji: ${narracja}.`);
  // wykrzykniki i wielokropki w narracji
  const wykrzNarr = [];
  const wielokr = [];
  const wtracenia = [];
  tekstLinie.forEach((l, i) => {
    const nr = od + i + 1;
    const czyDialog = /^\s*[–—-]\s/.test(l);
    if (!czyDialog && /!/.test(l)) wykrzNarr.push(nr);
    if (/\.\.\.|…/.test(l)) wielokr.push(nr);
    if (!czyDialog && /\s[–—]\s/.test(l)) wtracenia.push(nr);
    if (czyDialog && (l.match(/!/g) || []).length > 1) wykrzNarr.push(`${nr} (dialog, ${(l.match(/!/g) || []).length} wykrzykniki)`);
  });
  if (wykrzNarr.length) p(`- Wykrzykniki poza dialogiem lub nadmiar w kwestii: linie ${wykrzNarr.join(", ")}`);
  if (wielokr.length) p(`- Wielokropki: linie ${wielokr.join(", ")}`);
  if (wtracenia.length) p(`- Myślnik jako wtrącenie w narracji: linie ${wtracenia.join(", ")}`);
  p();

  // 3. maniery
  p(`## Maniery (z maniery.md)`);
  let trafien = 0;
  for (const [etykieta, wzor] of MANIERY) {
    const re = new RegExp(wzor, "giu");
    const lista = [];
    tekstLinie.forEach((l, i) => {
      for (const m of l.matchAll(re)) lista.push(`${od + i + 1}: „${m[0]}”`);
    });
    if (lista.length) {
      trafien += lista.length;
      p(`- ${etykieta} (${lista.length}): ${lista.join("; ")}`);
    }
  }
  if (!trafien) p(`- Brak trafień.`);
  p();

  // 4. postacie i zwroty
  const postacie = (metryka["Postacie"] || "Ada, Antek, Olek, Zuzia").split(",").map((s) => s.trim()).filter(Boolean);
  const tekstLow = tekst.toLowerCase();
  p(`## Postacie i zwroty z kart`);
  for (const imie of postacie) {
    const zw = zwrotyPostaci(imie);
    if (zw === null) { p(`- ${imie}: BRAK KARTY w postacie/`); continue; }
    if (!tekstLow.includes(imie.toLowerCase().slice(0, 3))) p(`- ${imie}: imię nie pada w tekście?`);
    const uzyte = zw.filter((z) => tekstLow.includes(z.toLowerCase()));
    if (!zw.length) p(`- ${imie}: karta nie ma listy zwrotów.`);
    else if (!uzyte.length) p(`- ${imie}: ŻADEN zwrot z karty nie padł (${zw.map((z) => `„${z}”`).join(", ")}).`);
    else p(`- ${imie}: użyte zwroty: ${uzyte.map((z) => `„${z}”`).join(", ")}${uzyte.length < zw.length ? `; nieużyte: ${zw.filter((z) => !uzyte.includes(z)).map((z) => `„${z}”`).join(", ")}` : ""}`);
  }
  const detale = [
    ["Luna (Zuzia)", /luna|lunę|luny|lunie|luną/u, postacie.includes("Zuzia")],
    ["kieszeń Olka", /kiesze/u, postacie.includes("Olek")],
    ["„po równo” (Olek)", /po równo|równo|po tyle samo/u, postacie.includes("Olek")],
    ["porównanie Zuzi „wygląda jak”", /wygląda jak|wyglądało jak|wyglądały jak|jak /u, postacie.includes("Zuzia")],
    ["odliczanie Ady", /trzy, dwa, jeden|trzy… dwa… jeden|3, 2, 1/u, postacie.includes("Ada")],
    ["„a może tak” (Antek)", /a może tak/u, postacie.includes("Antek")],
  ];
  for (const [nazwaD, re, wymagany] of detale) {
    if (!wymagany) continue;
    p(`- detal ${nazwaD}: ${re.test(tekstLow) ? "jest" : "BRAK"}`);
  }
  p();

  // 5. miejsce
  p(`## Miejsce`);
  const miejsce = (metryka["Miejsce"] || "").trim();
  if (!miejsce) p(`- Metryka nie ma miejsca.`);
  else if (/jednorazow/i.test(miejsce)) p(`- Miejsce jednorazowe: ${miejsce}. Sprawdź, czy opis jest w konspekcie.`);
  else {
    const f = miejsce.toLowerCase().replace(/`/g, "").trim();
    const kp = path.join(ROOT, "miejsca", f, `${f}.md`);
    if (istnieje(kp)) {
      const st = (czytaj(kp).match(/^Status:\s*([^.]+)/m) || [null, "?"])[1].trim();
      p(`- Karta miejsca: miejsca/${f}/${f}.md (status: ${st})`);
    } else p(`- BRAK karty miejsca dla „${miejsce}” (szukano miejsca/${f}/${f}.md).`);
  }
  p();

  // 6. kanon
  p(`## Kanon (bajki/kanon.md)`);
  const dotyczy = postacie.map((s) => s.toLowerCase()).concat([miejsce.toLowerCase()]);
  const fakty = faktyKanonu(dotyczy);
  if (!fakty.length) p(`- Brak faktów w kanonie dla tego miejsca i tych postaci.`);
  else for (const f of fakty) p(`- [${f.nr}] ${f.fakt} (źródło: ${f.zrodlo}; dotyczy: ${f.dotyczy}; w karcie: ${f.wKarcie || "nie"})`);
  p();

  // 7. indeks
  p(`## Indeks bajki/README.md`);
  const w = wierszIndeksu(nn);
  if (!w) p(`- BRAK wiersza dla numeru ${nn}.`);
  else if (w.status !== status) p(`- Status w indeksie („${w.status}”) różni się od metryki („${status}”).`);
  else p(`- Wiersz jest, status zgodny („${status}”).`);
  const konspekt = istnieje(path.join(folder, "konspekt.md"));
  p(`- konspekt.md: ${konspekt ? "jest" : "BRAK"}`);
  p();

  // 8. metryka
  if (flagi.has("--metryka")) {
    let nowy = md;
    nowy = nowy.replace(/^(\|\s*Słowa\s*\|)[^\n]*\|\s*$/m, `$1 ${slowa} |`);
    nowy = nowy.replace(/^(\|\s*Czas czytania\s*\|)[^\n]*\|\s*$/m, `$1 ok. ${minuty} min |`);
    if (nowy !== md) {
      fs.writeFileSync(plik, nowy, "utf8");
      p(`Metryka zaktualizowana: Słowa = ${slowa}, Czas czytania = ok. ${minuty} min.`);
    } else p(`Nie znaleziono wierszy „Słowa” i „Czas czytania” w metryce; nic nie zmieniono.`);
  } else {
    p(`Do wpisania w metrykę (albo uruchom z --metryka): Słowa = ${slowa}, Czas czytania = ok. ${minuty} min.`);
  }

  process.stdout.write(out.join("\n") + "\n");
}

try { main(); } catch (e) { console.error("Błąd: " + e.message); process.exit(1); }
