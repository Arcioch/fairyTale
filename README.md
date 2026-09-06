# fairyTale

Bajki na dobranoc dla dzieci w wieku przedszkolnym o czwórce bohaterów: Adzie, Antku, Olku i Zuzi. Repozytorium zawiera karty postaci i miejsc, analizy seriali wzorcowych, szablony i skille do pisania oraz (docelowo) gotowe bajki.

## Zawartość

| Ścieżka | Co jest w środku |
|---|---|
| `świat.md` | biblia świata: co ustalone, co jeszcze otwarte (pokrewieństwo, dorośli, miejsce akcji) |
| `postacie/` | karty czterech bohaterów (`.docx` od autora, `.md` do pisania), indeks grupy, szablon |
| `miejsca/` | karty stałych miejsc: domy czwórki, przedszkole, plac zabaw (na start szkice do uzupełnienia), szablon |
| `TODO.md` | lista pytań i zadań dla autorki przed pierwszą bajką |
| `bajki/` | gotowe bajki i szkice, jedna na folder (`konspekt.md`, `bajka.md`, `sprawdzenie.md`), indeks, szablony, `kanon.md` z faktami ustalonymi przez gotowe bajki |
| `narzędzia/` | `sprawdz.js`: skrypt liczący słowa, wyłapujący maniery i sprawdzający zwroty, miejsce, kanon i indeks; `hook-sprawdz.js`: uruchamia go automatycznie po każdym zapisie bajki (hook w `.claude/settings.json`) |
| `przykłady/` | analizy trzech seriali: „Ada Bambini, naukowczyni” (24 odcinki), „Mądroboty” (16), „Bluey” (52), każdy odcinek w osobnym folderze |
| `.claude/skills/` | skille Claude Code: `/bajka`, `/sprawdz`, `/pomysly`, `/nowa-postac`, `/nowe-miejsce` |

Instrukcje pracy w repozytorium są w `AGENTS.md`.

## Jak powstaje bajka

1. `/pomysly` daje tabelę tematów (zjawisko, para postaci, miejsce, zdarzenie).
2. `/bajka <temat>` proponuje trzy konspekty, po wyborze pisze `konspekt.md` i `bajka.md` w `bajki/NN tytuł/`.
3. `/sprawdz NN` najpierw uruchamia `narzędzia/sprawdz.js` (twarde liczby: słowa, maniery z numerami linii, zwroty z kart, kanon), potem recenzuje warstwami: struktura, postacie, język, prawda, a na końcu oczami czterolatka i rodzica czytającego na głos. Raport ląduje w `sprawdzenie.md`.
4. Autor zatwierdza, status zmienia się na „gotowa”, a fakty ustalone przez bajkę trafiają do `bajki/kanon.md` i obowiązują w następnych.

## Bohaterowie w skrócie

- **Ada** (najmłodsza): „Dobra, robimy!”. Działa, zanim ktoś skończy tłumaczyć.
- **Antek** (najstarszy): „Ja spróbuję!”. Milion pomysłów na minutę, pilnuje, żeby wszyscy byli mili.
- **Olek**: „Poczekaj, wytłumaczę.”. Chce wiedzieć, jak coś działa, i dzieli po równo. Kieszenie pełne skarbów.
- **Zuzia** (najstarsza): „To wygląda jak…”. Widzi świat obrazami, uparta, z białym kotkiem Luną.

Szczegóły i dynamika grupy: `postacie/README.md`.

## Z czego się uczymy

- Szkielet historii z problemem i trzema próbami: Ada Bambini.
- Wyjaśnianie zjawisk krok po kroku: Mądroboty.
- Dialogi rodzeństwa, humor rodziców, morał bez wykładu: Bluey.

Indeks i wskazówki: `przykłady/README.md`.

## Stan projektu

- Analizy seriali: gotowe. Pliki napisów usunięte po analizie.
- Karty czterech postaci: gotowe. Kolejne postacie (rodzice, pani z przedszkola) dopisze autor.
- Karty miejsc: sześć szkiców z pytaniami do autora.
- Skille i szablony: gotowe.
- Bajki: jeszcze nie ma. Przed pierwszą warto rozstrzygnąć punkty otwarte w `świat.md`; do tego czasu bajki ich nie dotykają.
