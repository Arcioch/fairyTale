# AGENTS.md

Instrukcje dla agentów i asystentów pracujących w tym repozytorium. Claude Code czyta ten plik przez `CLAUDE.md`.

## Czym jest ten projekt

To nie jest projekt programistyczny. Piszemy scenariusze odcinków animowanej serii 3D na YouTube dla dzieci w wieku przedszkolnym (około 4 lat) z czwórką bohaterów: Ada, Antek, Olek, Zuzia. Każdy odcinek to około 9 minut historii, każda postać mówi własnym głosem, narratora nie ma. Format serii jest opisany w `świat.md`, sekcja „Format serii”. Wzorcem są trzy seriale przeanalizowane w `przykłady/`: „Ada Bambini, naukowczyni” (szkielet historii i metoda naukowa), „Mądroboty” (tłumaczenie zjawisk) i „Bluey” (relacje, humor rodziców).

Słowa „odcinek” i „bajka” znaczą w tym repo to samo: odcinek to jednostka produkcji, bajka to historia w nim.

Język projektu: **polski**. Wszystkie pliki, nazwy folderów, komentarze i odpowiedzi dla autorki są po polsku. Nazwy plików mogą zawierać polskie znaki i spacje (np. `przykłady/`, `Postać - Ada.docx`); w poleceniach powłoki zawsze cytuj ścieżki. Wyjątek: nazwy folderów skilli w `.claude/skills/` są bez polskich znaków, bo tak wymaga narzędzie.

Autorką serii jest żona właściciela repozytorium; ona podejmuje decyzje o świecie i zatwierdza odcinki. Pytania kierujemy do niej.

## Struktura

```
fairyTale/
├── AGENTS.md              ten plik
├── CLAUDE.md              odsyłacz do AGENTS.md
├── README.md              opis projektu
├── TODO.md                lista pytań i zadań dla autorki
├── świat.md               biblia świata: ustalenia, wątki na przyszłość, format serii
├── postacie/              bohaterowie, folder na postać
│   ├── README.md          indeks, dynamika grupy, pary, rekwizyty
│   ├── dorośli.md         rodzice czwórki, panie z przedszkola (źródło prawdy o dorosłych)
│   ├── _szablon.md        szablon karty postaci
│   └── <imię>/
│       ├── Postać - <Imię>.docx   karta źródłowa od autorki (nie edytować)
│       ├── <imię>.webp            obraz referencyjny 3D (opcjonalny)
│       └── <imię>.md              karta do pisania (źródło prawdy)
├── miejsca/               stałe miejsca akcji, folder na miejsce
│   ├── README.md          indeks, statusy, mapa okolicy
│   ├── _szablon.md        szablon karty miejsca
│   └── <nazwa>/<nazwa>.md domy czwórki, przedszkole, plac zabaw
├── odcinki/               scenariusze odcinków
│   ├── README.md          indeks z tematem, porą roku, zjawiskiem, czasem, statusem
│   ├── kanon.md           fakty ustalone przez gotowe odcinki; obowiązują w następnych
│   ├── czołówka.md        wspólna śpiewana czołówka (do napisania)
│   ├── _szablon/          konspekt.md i scenariusz.md
│   └── NN tytuł/          konspekt.md, scenariusz.md, sprawdzenie.md
├── narzędzia/
│   ├── sprawdz.js         deterministyczne sprawdzenie scenariusza (Node): czas, sceny, kwestie, maniery, zwroty, kanon, indeks
│   └── hook-sprawdz.js    hook Claude Code: odpala sprawdz.js po każdym zapisie scenariusz.md
├── .claude/
│   ├── settings.json      hook PostToolUse (Write|Edit) → hook-sprawdz.js
│   └── skills/            skille projektu (poniżej)
└── przykłady/             analizy seriali wzorcowych (bez plików napisów)
    ├── README.md          co z którego serialu brać
    ├── ada bambini naukowczyni/   styl.md, postacie.md, odcinki/
    ├── madroboty/                 styl.md, nauka-katalog.md, odcinki/
    └── blue/                      styl.md, rodzenstwo.md, rodzice.md, postacie.md, odcinki/
```

## Skille

Cała procedura pisania jest w skillach. Agent bez dostępu do skilli czyta je jako zwykłe pliki markdown.

| Skill | Plik | Do czego |
|---|---|---|
| `/odcinek` | `.claude/skills/odcinek/SKILL.md` | od tematu przez konspekt do scenariusza w `odcinki/NN tytuł/`; zawiera wszystkie zasady pisania |
| `/sprawdz` | `.claude/skills/sprawdz/SKILL.md` | recenzja warstwami: struktura i czas, postacie, język i zapis, prawda, widzowie; raport do `sprawdzenie.md` |
| `/pomysly` | `.claude/skills/pomysly/SKILL.md` | tabela tematów: zjawisko × para postaci × miejsce × pora roku |
| `/nowa-postac` | `.claude/skills/nowa-postac/SKILL.md` | karta postaci z docx lub opisu, indeks, `świat.md` |
| `/nowe-miejsce` | `.claude/skills/nowe-miejsce/SKILL.md` | karta miejsca, indeks, `świat.md` |

Pliki pomocnicze `/sprawdz`: `maniery.md` (polskie nawyki modelu, których unikać, w tym sekcja 8 o scenariuszu) i `czytelnicy.md` (persony: czterolatek oglądający, rodzic oglądający razem, aktor głosowy). `/odcinek` czyta `maniery.md` przed pisaniem.

Skrypt `narzędzia/sprawdz.js` (Node, bez zależności) jest obowiązkowym pierwszym krokiem `/sprawdz` i ostatnim krokiem `/odcinek`:

```bash
node "narzędzia/sprawdz.js" NN --metryka
```

Liczy szacowany czas (słowa dialogu przez 140 na minutę plus 4 s na didaskalium) i wpisuje go do metryki; sprawdza sceny (nagłówek z miejscem i porą, didaskalium na start, brak narracji poza nawiasem), mówców (nieznani, narrator, nie w metryce), długość kwestii i zdań, maniery z numerami linii, zwroty z kart w kwestiach właściwej postaci, detale, karty miejsc, fakty z kanonu, zgodność z indeksem. Rzeczy, które da się policzyć, liczy skrypt, nie model.

**Hook.** `.claude/settings.json` ma hook `PostToolUse` na `Write|Edit`: po każdym zapisie pliku `odcinki/<NN tytuł>/scenariusz.md` uruchamia się `narzędzia/hook-sprawdz.js`, który odpala `sprawdz.js` (bez `--metryka`) i oddaje wynik modelowi jako kontekst. Nie da się więc zapisać scenariusza bez sprawdzenia. Wynik hooka trzeba przeczytać i zareagować: naprawić trafienia albo wpisać do notatek, dlaczego zostają. Inne pliki hook ignoruje. Agent bez hooków uruchamia skrypt ręcznie.

## Zasady

1. **Źródła prawdy.** Przy pisaniu obowiązują: karty `.md` w `postacie/`, `postacie/dorośli.md`, karty w `miejsca/`, `świat.md`, `odcinki/kanon.md`. Nie dodawaj postaciom ani miejscom cech spoza kart bez zaznaczenia tego autorce w notatkach odcinka.
2. **Punkty otwarte.** Wiersze ze statusem „otwarte” w `świat.md` nie są rozstrzygane w odcinkach. Wątki z „Wątki na przyszłość” robią w jednym odcinku najwyżej jeden krok.
3. **Pliki `.docx` i obrazy w `postacie/` i `miejsca/`** są własnością autorki. Nie edytuj ich. Gdy autorka je zmieni, zaktualizuj odpowiedni `.md` i tabelę indeksu.
4. **Analizy w `przykłady/`** są kompletne. Pliki napisów zostały usunięte; nie szukaj ich, nie pobieraj, nie szukaj w internecie materiałów o serialach. Nie kopiuj z analiz dialogów ani nazw własnych.
5. **Zjawiska są prawdziwe** i muszą dać się pokazać w kadrze. Jeśli nauka nie zgadza się z pomysłem, zmień pomysł. Wątpliwość zapisz, nie zgaduj.
6. **Morał nie pada wprost.** Odcinek kończy się obrazem albo jednym pytaniem.
7. **Bez narratora.** Każdy akapit scenariusza jest kwestią albo didaskalium w nawiasie. Didaskalia mówią, co widać i słychać, nie co postać czuje.
8. **Miejsce bez karty** może pojawić się w odcinku raz (opis w konspekcie). Drugi raz wymaga karty w `miejsca/`.
9. **Kanon.** Fakt, który padł w gotowym odcinku, jest wpisany do `odcinki/kanon.md` i obowiązuje w każdym następnym. Zmiana kanonu wymaga poprawki odcinka źródłowego i wpisu do „Fakty wycofane”.
10. **Bezpieczeństwo.** Wszyscy dorośli są wymyśleni. Bez nazwisk, adresów, nazwy prawdziwego przedszkola, prawdziwego miasta (świat dzieje się we Wrocławiu celowo).

## Skrót zasad pisania (pełna wersja w `/odcinek`)

- Szkielet: zwykła sytuacja, zdarzenie wywołujące do 1,5 min, trzy próby (każda innej postaci, dwie nie wychodzą), rozwiązanie łączące wkłady, powrót z jedną zmianą. Razem 8,5 do 9,5 min.
- Ada sprawdza ciałem, Antek buduje i ma pięć pomysłów, Olek tłumaczy w krokach i dzieli po równo, Zuzia patrzy i daje porównanie. Ada i Antek nie są wymienni.
- Jedno miejsce główne (plus najwyżej poboczne), jedno zjawisko lub emocja, jedno nowe słowo, jedna zmiana zachowania. Pora roku inna niż w ostatnich odcinkach.
- Kwestie do 40 słów, zdania do 15. Dialog nie opisuje tego, co widać. Uczucia w ciele, nie w słowie. Jeden żart dla rodzica, w ustach dorosłego. Humor cichnie przy prawdziwym smutku.
- Koniec to obraz.

## Konwencje plików

- Markdown, nagłówki `#`/`##`, tabele do indeksów, listy do cech.
- Foldery odcinków: `NN tytuł` (numer dwucyfrowy, spacja, tytuł po polsku). Foldery miejsc i postaci: małe litery, ze spacjami.
- Bez emoji w plikach projektu.
- Nie zmieniaj nazw istniejących folderów w `przykłady/` (są cytowane w wielu plikach). Numeracja odcinków seriali różni się celowo (`S1-01`, `S2-01`, `01`); nie ujednolicaj.
- Szablony zaczynają się od `_szablon`.

## Git

Gałąź `main`. Nie commituj i nie pushuj bez wyraźnej prośby. `.gitignore` wyklucza tylko pliki tymczasowe Worda, systemowe i lokalne ustawienia Claude Code; `.gitattributes` trzyma końce linii LF i oznacza `.docx` oraz obrazy jako binaria.
