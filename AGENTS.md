# AGENTS.md

Instrukcje dla agentów i asystentów pracujących w tym repozytorium. Claude Code czyta ten plik przez `CLAUDE.md`.

## Czym jest ten projekt

To nie jest projekt programistyczny. Piszemy bajki na dobranoc dla dzieci w wieku przedszkolnym (około 4 lat) z czwórką bohaterów: Ada, Antek, Olek, Zuzia. Wzorcem są trzy seriale przeanalizowane w `przykłady/`: „Ada Bambini, naukowczyni” (szkielet historii i metoda naukowa), „Mądroboty” (tłumaczenie zjawisk) i „Bluey” (relacje rodzeństwa, humor rodziców).

Język projektu: **polski**. Wszystkie pliki, nazwy folderów, komentarze i odpowiedzi dla autora są po polsku. Nazwy plików mogą zawierać polskie znaki i spacje (np. `przykłady/`, `Postać - Ada.docx`); w poleceniach powłoki zawsze cytuj ścieżki. Wyjątek: nazwy folderów skilli w `.claude/skills/` są bez polskich znaków, bo tak wymaga narzędzie.

## Struktura

```
fairyTale/
├── AGENTS.md              ten plik
├── CLAUDE.md              odsyłacz do AGENTS.md
├── README.md              opis projektu
├── świat.md               biblia świata: co ustalone, co otwarte (pokrewieństwo, dorośli, miejsce)
├── postacie/              bohaterowie, folder na postać
│   ├── README.md          indeks, dynamika grupy, pary, rekwizyty
│   ├── _szablon.md        szablon karty postaci
│   └── <imię>/
│       ├── Postać - <Imię>.docx   karta źródłowa od autora (nie edytować)
│       ├── <imię>.webp            obraz referencyjny (opcjonalny)
│       └── <imię>.md              karta do pisania (źródło prawdy)
├── miejsca/               stałe miejsca akcji, folder na miejsce
│   ├── README.md          indeks, statusy, uwaga o domach, mapa okolicy
│   ├── _szablon.md        szablon karty miejsca
│   └── <nazwa>/<nazwa>.md domy czwórki, przedszkole, plac zabaw (na start: szkice)
├── bajki/                 gotowe bajki i szkice
│   ├── README.md          indeks z tematem, zjawiskiem, statusem
│   ├── kanon.md           fakty ustalone przez gotowe bajki; obowiązują w następnych
│   ├── _szablon/          konspekt.md i bajka.md
│   └── NN tytuł/          konspekt.md, bajka.md, sprawdzenie.md
├── narzędzia/
│   ├── sprawdz.js         deterministyczne sprawdzenie bajki (Node): słowa, maniery, zwroty, kanon, indeks
│   └── hook-sprawdz.js    hook Claude Code: odpala sprawdz.js po każdym zapisie bajka.md
└── .claude/
    ├── settings.json      hook PostToolUse (Write|Edit) → hook-sprawdz.js
    └── skills/            skille projektu (poniżej)
├── przykłady/             analizy seriali wzorcowych (bez plików napisów)
│   ├── README.md          co z którego serialu brać
│   ├── ada bambini naukowczyni/   styl.md, postacie.md, odcinki/
│   ├── madroboty/                 styl.md, nauka-katalog.md, odcinki/
│   └── blue/                      styl.md, rodzenstwo.md, rodzice.md, postacie.md, odcinki/
```

## Skille

Cała procedura pisania jest w skillach. Agent bez dostępu do skilli czyta je jako zwykłe pliki markdown.

| Skill | Plik | Do czego |
|---|---|---|
| `/bajka` | `.claude/skills/bajka/SKILL.md` | od tematu przez konspekt do tekstu w `bajki/NN tytuł/`; zawiera wszystkie zasady pisania |
| `/sprawdz` | `.claude/skills/sprawdz/SKILL.md` | recenzja warstwami: struktura, postacie, język, prawda, czytelnicy; raport do `sprawdzenie.md` |
| `/pomysly` | `.claude/skills/pomysly/SKILL.md` | tabela tematów: zjawisko × para postaci × miejsce |
| `/nowa-postac` | `.claude/skills/nowa-postac/SKILL.md` | karta postaci z docx lub opisu, indeks, `świat.md` |
| `/nowe-miejsce` | `.claude/skills/nowe-miejsce/SKILL.md` | karta miejsca, indeks, `świat.md` |

Pliki pomocnicze `/sprawdz`: `maniery.md` (polskie nawyki modelu, których unikać) i `czytelnicy.md` (persony: czterolatek słuchający, rodzic czytający na głos). `/bajka` czyta `maniery.md` przed pisaniem.

Skrypt `narzędzia/sprawdz.js` (Node, bez zależności) jest obowiązkowym pierwszym krokiem `/sprawdz` i ostatnim krokiem `/bajka`:

```bash
node "narzędzia/sprawdz.js" NN --metryka
```

Liczy słowa i czas czytania (wpisuje do metryki), wypisuje zdania powyżej 15 słów, trafienia manier z numerami linii, zwroty z kart, detale, kartę miejsca, fakty z kanonu i zgodność z indeksem. Rzeczy, które da się policzyć, liczy skrypt, nie model.

**Hook.** `.claude/settings.json` ma hook `PostToolUse` na `Write|Edit`: po każdym zapisie pliku `bajki/<NN tytuł>/bajka.md` uruchamia się `narzędzia/hook-sprawdz.js`, który odpala `sprawdz.js` (bez `--metryka`) i oddaje wynik modelowi jako kontekst. Nie da się więc zapisać bajki bez sprawdzenia. Wynik hooka trzeba przeczytać i zareagować: naprawić trafienia albo wpisać do notatek, dlaczego zostają. Inne pliki hook ignoruje. Agent bez hooków (inne narzędzie niż Claude Code) uruchamia skrypt ręcznie, tak jak każe `/bajka` i `/sprawdz`.

## Zasady

1. **Źródła prawdy.** Przy pisaniu obowiązują: karty `.md` w `postacie/`, karty w `miejsca/`, `świat.md`. Nie dodawaj postaciom ani miejscom cech spoza kart bez zaznaczenia tego autorowi w notatkach bajki.
2. **Punkty otwarte.** Wiersze ze statusem „otwarte” w `świat.md` (pokrewieństwo czwórki, dorośli, miejsce akcji, droga między miejscami) nie są rozstrzygane w bajkach. Bez imion dorosłych, bez „brat”, bez wspólnego domu, bez „pobiegli do Olka”, dopóki autor nie ustali.
3. **Pliki `.docx` w `postacie/` i `miejsca/`** są własnością autora. Nie edytuj ich. Gdy autor je zmieni, zaktualizuj odpowiedni `.md` i tabelę indeksu.
4. **Analizy w `przykłady/`** są kompletne i gotowe. Pliki napisów zostały usunięte po analizie; nie szukaj ich, nie pobieraj, nie loguj się do serwisów streamingowych, nie szukaj w internecie materiałów o serialach. Nie kopiuj z analiz dialogów ani nazw własnych do bajek.
5. **Zjawiska są prawdziwe.** Jeśli nauka nie zgadza się z pomysłem, zmień pomysł. Wątpliwość zapisz, nie zgaduj.
6. **Morał nie pada wprost.** Jedno pytanie lub jeden obraz na koniec.
7. **Miejsce bez karty** może pojawić się w bajce raz (opis w konspekcie). Drugi raz wymaga karty w `miejsca/`.
8. **Kanon.** Fakt, który padł w gotowej bajce, jest wpisany do `bajki/kanon.md` i obowiązuje w każdej następnej. `/bajka` czyta kanon przed pisaniem, `/sprawdz` sprawdza zgodność i zbiera nowe fakty. Zmiana kanonu wymaga poprawki bajki źródłowej i wpisu do „Fakty wycofane”.

## Skrót zasad pisania (pełna wersja w `/bajka`)

- Szkielet: zwykła sytuacja, zdarzenie wywołujące, trzy próby (każda innej postaci, dwie nie wychodzą), rozwiązanie łączące wkłady, powrót z jedną zmianą.
- Ada sprawdza ciałem, Antek buduje i ma pięć pomysłów, Olek tłumaczy w krokach i dzieli po równo, Zuzia patrzy i daje porównanie. Ada i Antek nie są wymienni.
- Jedno miejsce, jedno zjawisko, jedno nowe słowo, jedna zmiana zachowania. 600 do 1000 słów.
- Zdania krótkie, dużo dialogu, uczucia pokazane, nie nazwane. Humor cichnie przy prawdziwym smutku. Jeden żart dla rodzica.
- Koniec uspokaja.

## Konwencje plików

- Markdown, nagłówki `#`/`##`, tabele do indeksów, listy do cech.
- Foldery bajek: `NN tytuł` (numer dwucyfrowy, spacja, tytuł po polsku). Foldery miejsc i postaci: małe litery, ze spacjami.
- Bez emoji w plikach projektu.
- Nie zmieniaj nazw istniejących folderów w `przykłady/` (są cytowane w wielu plikach). Numeracja odcinków różni się między serialami celowo (`S1-01`, `S2-01`, `01`); nie ujednolicaj.
- Szablony zaczynają się od `_szablon`.

## Git

Gałąź `main`, na razie bez commitów. Nie commituj i nie pushuj bez wyraźnej prośby autora. `.gitignore` wyklucza tylko pliki tymczasowe Worda, systemowe i lokalne ustawienia Claude Code; pliki `.docx` i obrazy są częścią projektu.
