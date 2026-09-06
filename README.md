# fairyTale

Animowana seria 3D na YouTube dla dzieci w wieku przedszkolnym o czwórce przyjaciół: Adzie, Antku, Olku i Zuzi. Odcinek to około 9 minut historii (z czołówką i napisami 10 do 12), każda postać mówi własnym głosem, narratora nie ma. Repozytorium zawiera karty postaci i miejsc, biblię świata, analizy seriali wzorcowych, szablony i skille do pisania scenariuszy oraz (docelowo) gotowe scenariusze.

## Zawartość

| Ścieżka | Co jest w środku |
|---|---|
| `świat.md` | biblia świata: ustalenia (przyjaciele od żłobka, Wrocław, rodzice, przedszkole, Luna), wątki na przyszłość, format serii |
| `TODO.md` | lista pytań i zadań dla autorki |
| `postacie/` | karty czterech bohaterów (`.docx` i obraz 3D od autorki, `.md` do pisania), `dorośli.md` z rodzicami i paniami z przedszkola, indeks grupy, szablon |
| `miejsca/` | karty stałych miejsc: domy czwórki, przedszkole, plac zabaw, szablon |
| `odcinki/` | scenariusze, jeden odcinek na folder (`konspekt.md`, `scenariusz.md`, `sprawdzenie.md`), indeks, szablony, `kanon.md` z faktami ustalonymi przez gotowe odcinki, `czołówka.md` |
| `narzędzia/` | `sprawdz.js`: skrypt liczący czas, sprawdzający sceny, kwestie, maniery, zwroty z kart, miejsca, kanon i indeks; `hook-sprawdz.js`: uruchamia go automatycznie po każdym zapisie scenariusza |
| `przykłady/` | analizy trzech seriali: „Ada Bambini, naukowczyni” (24 odcinki), „Mądroboty” (16), „Bluey” (52), każdy odcinek w osobnym folderze |
| `.claude/skills/` | skille Claude Code: `/odcinek`, `/sprawdz`, `/pomysly`, `/nowa-postac`, `/nowe-miejsce` |

Instrukcje pracy w repozytorium są w `AGENTS.md`.

## Jak powstaje odcinek

1. `/pomysly` daje tabelę tematów (zjawisko, para postaci, miejsce, pora roku, dorosły i jego cel).
2. `/odcinek <temat>` proponuje trzy konspekty, po wyborze pisze `konspekt.md` i `scenariusz.md` w `odcinki/NN tytuł/`. Hook uruchamia skrypt sprawdzający przy każdym zapisie scenariusza.
3. `/sprawdz NN` najpierw uruchamia `narzędzia/sprawdz.js` (twarde liczby: czas, sceny, maniery z numerami linii, zwroty z kart, kanon), potem recenzuje warstwami: struktura i czas, postacie, język i zapis, prawda, a na końcu oczami czterolatka oglądającego, rodzica oglądającego razem i aktora głosowego. Raport ląduje w `sprawdzenie.md`.
4. Autorka zatwierdza, status zmienia się na „gotowy”, a fakty ustalone przez odcinek trafiają do `odcinki/kanon.md` i obowiązują w następnych.

## Bohaterowie w skrócie

- **Ada** (najmłodsza): „Dobra, robimy!”. Działa, zanim ktoś skończy tłumaczyć. Mieszka w domu.
- **Antek**: „Ja spróbuję!”. Milion pomysłów na minutę, pilnuje, żeby wszyscy byli mili.
- **Olek**: „Poczekaj, wytłumaczę.”. Chce wiedzieć, jak coś działa, i dzieli po równo. Kieszenie pełne skarbów. Marzy o zwierzaku.
- **Zuzia** (najstarsza): „To wygląda jak…”. Widzi świat obrazami, uparta, z białym kotkiem Luną, która wychodzi z domu.

Przyjaciele od żłobka, około 4 lat, każde z własnymi rodzicami; rodziny się przyjaźnią i jeżdżą razem na wyjazdy. Szczegóły i dynamika grupy: `postacie/README.md`, dorośli: `postacie/dorośli.md`.

## Z czego się uczymy

- Szkielet historii z problemem i trzema próbami: Ada Bambini.
- Wyjaśnianie zjawisk krok po kroku: Mądroboty.
- Dialogi dzieci, humor rodziców, morał bez wykładu: Bluey.

Indeks i wskazówki: `przykłady/README.md`.

## Stan projektu

- Analizy seriali: gotowe.
- Karty czterech postaci: gotowe. Rodzice i panie z przedszkola: opisani w `postacie/dorośli.md`.
- Świat: ustalony w zakresie potrzebnym do pisania (patrz `świat.md`).
- Karty miejsc: szkice, do uzupełnienia przez autorkę przed użyciem miejsca.
- Skille, szablony, skrypt i hook: gotowe.
- Czołówka: do napisania.
- Odcinki: jeszcze nie ma.
