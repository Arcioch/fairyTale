---
name: nowe-miejsce
description: Dodaj lub uzupełnij kartę stałego miejsca akcji w miejsca/ (dom bohatera, przedszkole, plac zabaw, sklep, park). Użyj, gdy autor mówi „dodaj miejsce”, „opisz dom Olka”, „zrób kartę przedszkola”, podaje opis lub plik, albo gdy bajka użyła miejsca bez karty po raz drugi. Wypełnia szablon, aktualizuje indeks miejsc i świat.md.
argument-hint: [nazwa miejsca] [--z-opisu | --z-pliku ścieżka | --z-odcinka NN]
---

# /nowe-miejsce

## Krok 1. Źródło

Trzy możliwości:
- `--z-opisu`: autor opisał miejsce w rozmowie. Pracuj z opisu, nie dodawaj szczegółów, których nie podał, poza sekcją „Do czego służy w bajce”.
- `--z-pliku`: plik `.docx`, `.md` lub obraz w `miejsca/<nazwa>/`. Docx rozpakuj tak jak w `/nowa-postac`. Obraz obejrzyj i opisz, oznaczając „na obrazku:”.
- `--z-odcinka NN`: miejsce pojawiło się w bajce `odcinki/NN …/odcinek.md`. Zacznij od `odcinki/kanon.md`: wiersze z tym miejscem w kolumnie „Dotyczy” i „W karcie” = „nie” przenieś do karty i zmień im „W karcie” na „tak”. Potem wypisz z tekstu bajki wszystko inne, co powiedziała o miejscu (przedmioty, pomieszczenia, zasady), i tylko to wpisz jako ustalone. Resztę zostaw jako pytania.

Jeśli karta już istnieje ze statusem „szkic” (tak jest z sześcioma miejscami założonymi na start), nie twórz nowej: uzupełniaj istniejącą i zmień status na „ustalone” tylko na wyraźne słowo autora.

## Krok 2. Karta

Skopiuj `miejsca/_szablon.md` do `miejsca/<nazwa>/<nazwa>.md` (nazwa małymi literami, ze spacjami, po polsku, np. `sklep na rogu`). Wypełnij obie połowy:

**Jak wygląda.** Krótko. W bajce widać jedno pomieszczenie i dwa, trzy przedmioty; karta ma ich trochę więcej, żeby kolejne bajki mogły wybierać, ale nie jest planem architekta. Kolory domu dziecka zgodne z „Ulubione kolory” z jego karty.

**Do czego służy w bajce.** To ważniejsza połowa. Wymaga:
- 3 do 5 zabaw dopasowanych do rdzenia gospodarza,
- listy kłopotów (to są zdarzenia wywołujące dla `/pomysly`),
- zjawisk, które da się tu pokazać, z odnośnikiem do `przykłady/madroboty/nauka-katalog.md`, gdy pasuje,
- kto jest gospodarzem, a kto gościem, i jak to zmienia zachowanie każdej z czwórki,
- czego unikać.

Miejsce dorosłych (przedszkole, sklep) ma gospodarza-dorosłego z własnym celem; wzór `przykłady/blue/rodzice.md` i przedszkole w `przykłady/blue/postacie.md`.

## Krok 3. Powiązania

1. Dopisz lub zaktualizuj wiersz w tabeli `miejsca/README.md`.
2. Jeśli miejsce rozstrzyga coś ze `świat.md` (np. „Ada i Antek mieszkają razem”, „do przedszkola idzie się pieszo obok placu”), zaktualizuj tam wiersz i status. Jeśli autor tego nie powiedział wprost, nie rozstrzygaj: dopisz do „Otwarte pytania dla autora”.
3. Jeśli miejsce wymaga połączenia folderów domów (rodzeństwo mieszka razem), zaproponuj to autorowi, nie rób sam.
4. Sprawdź, czy istniejące bajki w `odcinki/` nie opisują tego miejsca inaczej. Jeśli tak, wypisz różnice; autor wybierze.

## Krok 4. Zgłoszenie

Podaj: ścieżkę karty, status, listę pytań otwartych, i czy coś w `świat.md` się zmieniło. Nie commituj.
